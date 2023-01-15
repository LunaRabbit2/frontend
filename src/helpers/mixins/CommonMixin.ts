import { CHAIN_ID } from "@/config/constants/networks";
import { Contract } from "@ethersproject/contracts";
import { useMulticallContract } from "@/helpers/useContract";
import { Options } from "vue-class-component";
import { CancelledError, retry, RetryableError } from '@/helpers/multicall/retry';
import { parseCallKey } from "@/helpers/multicall";
import chunkArray from '@/helpers/multicall/chunkArray'
import { Call } from "@/helpers/multicall/utils";
import { watchEffect } from "vue";
import _ from "lodash";
import Web3Mixins from "./web3Mixin";

@Options({
  watch: {},
})
export default class CommonMixin extends Web3Mixins {
  debouncedListeners: {
    [chainId: number]: {
      [callKey: string]: {
        [blocksPerFetch: number]: number;
      };
    };
  };

  previousDebounceListener: {
    [chainId: number]: {
      [callKey: string]: {
        [blocksPerFetch: number]: number;
      };
    };
  } = {};
  previousBlock: number;

  debouncedValue: any;

  CALL_CHUNK_SIZE = 500;

  watchCall() {
    const currentBlock = this.$store.state.blockStore.currentBlock
    const multicallContract = useMulticallContract();

    const listeningKeys = this.activeListeningKeys(this.debouncedListeners, CHAIN_ID)
    const unserializedOutdatedCallKeys = this.outdatedListeningKeys(
      this.$store.state.multicall.callResults,
      listeningKeys,
      CHAIN_ID,
      currentBlock
    );
    const serializedOutdatedCallKeys = JSON.stringify(unserializedOutdatedCallKeys.sort())
    if (!currentBlock || !CHAIN_ID || !multicallContract) return;


    const outdatedCallKeys: string[] = JSON.parse(serializedOutdatedCallKeys);
    if (outdatedCallKeys.length === 0) return;
    const calls = outdatedCallKeys.map((key) => parseCallKey(key));

    const chunkedCalls = chunkArray(calls, this.CALL_CHUNK_SIZE);

    let cancellations;

    if (cancellations?.blockNumber !== currentBlock) {
      cancellations?.cancellations?.forEach((c) => c());
    }

    this.$store.commit('fetchingMulticallResults', {
      calls,
      CHAIN_ID,
      fetchingBlockNumber: currentBlock,
    });

    cancellations = {
      blockNumber: currentBlock,
      cancellations: chunkedCalls.map((chunk, index) => {
        const { cancel, promise } = retry(
          () => this.fetchChunk(multicallContract, chunk, currentBlock),
          {
            n: Infinity,
            minWait: 2500,
            maxWait: 3500,
          }
        );
        promise
          .then(({ results: returnData, blockNumber: fetchBlockNumber }) => {
            cancellations = {
              cancellations: [],
              blockNumber: currentBlock,
            };

            // accumulates the length of all previous indices
            const firstCallKeyIndex = chunkedCalls
              .slice(0, index)
              .reduce<number>((memo, curr) => memo + curr.length, 0);
            const lastCallKeyIndex = firstCallKeyIndex + returnData.length;

            this.$store.commit('updateMulticallResults', {
              CHAIN_ID,
              results: outdatedCallKeys
                .slice(firstCallKeyIndex, lastCallKeyIndex)
                .reduce<{ [callKey: string]: string | null }>(
                  (memo, callKey, i) => {
                    memo[callKey] = returnData[i] ?? null;
                    return memo;
                  },
                  {}
                ),
              blockNumber: fetchBlockNumber,
            });
          })
          .catch((error: any) => {
            if (error instanceof CancelledError) {
              console.debug('Cancelled fetch for blockNumber', currentBlock);
              return;
            }
            console.error(
              'Failed to fetch multicall chunk',
              chunk,
              CHAIN_ID,
              error
            );
            this.$store.commit('errorFetchingMulticallResults', {
              calls: chunk,
              CHAIN_ID,
              fetchingBlockNumber: currentBlock,
            });
          });
        return cancel;
      }),
    };
  }

  isArrayEqual(x, y) {
    return _(x).xorWith(y, _.isEqual).isEmpty();
  }

  useDebounce<T>(value: T, delay: number) {
    this.debouncedValue = value

    watchEffect((onCleanup) => {
      const handler = setTimeout(() => {
        this.debouncedValue = value;
      }, delay)

      onCleanup(() => {
        clearTimeout(handler)
      })
    })

    return this.debouncedValue;
  }

  mounted(): void {
    this.debouncedListeners = this.useDebounce(this.$store.state.multicall.callListeners, 100)
    // this.previousDebounceListener = this.debouncedListeners;
    // this.previousBlock = this.$store.state.blockStore.currentBlock;
    const multicallContract = useMulticallContract()

    this.$watch(vm => [vm.debouncedListeners, vm.$store.state.blockStore.currentBlock], val => {
      // if (lodash.isEqual(val[0], this.previousDebounceListener) && val[1] === this.previousBlock) {
      //   return;
      // }
      console.log('KKK:::: ', val[1] === this.previousBlock, val[1], this.previousBlock);

      this.previousDebounceListener = val[0]
      this.previousBlock = val[1]

      console.log(val);
      this.watchCall();
    }, {
      deep: true,
      immediate: false
    })
  }

  outdatedListeningKeys(
    callResults: any,
    listeningKeys: { [callKey: string]: number },
    chainId: number | undefined,
    currentBlock: number | undefined
  ): string[] {
    if (!chainId || !currentBlock) return [];
    const results = callResults[chainId];
    // no results at all, load everything
    if (!results) return Object.keys(listeningKeys);

    return Object.keys(listeningKeys).filter((callKey) => {
      const blocksPerFetch = listeningKeys[callKey];

      const data = callResults[chainId][callKey];
      // no data, must fetch
      if (!data) return true;

      const minDataBlockNumber = currentBlock - (blocksPerFetch - 1);

      // already fetching it for a recent enough block, don't refetch it
      if (
        data.fetchingBlockNumber &&
        data.fetchingBlockNumber >= minDataBlockNumber
      )
        return false;

      // if data is older than minDataBlockNumber, fetch it
      return !data.blockNumber || data.blockNumber < minDataBlockNumber;
    });
  }

  async fetchChunk(
    multicallContract: Contract,
    chunk: Call[],
    minBlockNumber: number
  ): Promise<{ results: string[]; blockNumber: number }> {
    console.debug('Fetching chunk', multicallContract, chunk, minBlockNumber);
    let resultsBlockNumber;
    let returnData;
    try {
      // prettier-ignore
      [resultsBlockNumber, returnData] = await multicallContract.aggregate(
        chunk.map((obj) => [obj.address, obj.callData]),
        {
          blockTag: minBlockNumber,
        }
      )
    } catch (err) {
      const error = err as any;
      if (
        error.code === -32000 ||
        (error?.data?.message &&
          error?.data?.message?.indexOf('header not found') !== -1) ||
        error.message?.indexOf('header not found') !== -1
      ) {
        throw new RetryableError(
          `header not found for block number ${minBlockNumber}`
        );
      } else if (
        error.code === -32603 ||
        error.message?.indexOf('execution ran out of gas') !== -1
      ) {
        if (chunk.length > 1) {
          if (process.env.NODE_ENV === 'development') {
            console.debug('Splitting a chunk in 2', chunk);
          }
          const half = Math.floor(chunk.length / 2);
          const [c0, c1] = await Promise.all([
            this.fetchChunk(multicallContract, chunk.slice(0, half), minBlockNumber),
            this.fetchChunk(
              multicallContract,
              chunk.slice(half, chunk.length),
              minBlockNumber
            ),
          ]);
          return {
            results: c0.results.concat(c1.results),
            blockNumber: c1.blockNumber,
          };
        }
      }
      console.debug('Failed to fetch chunk inside retry', error);
      throw error;
    }
    if (resultsBlockNumber.toNumber() < minBlockNumber) {
      console.debug(
        `Fetched results for old block number: ${resultsBlockNumber.toString()} vs. ${minBlockNumber}`
      );
    }
    return { results: returnData, blockNumber: resultsBlockNumber.toNumber() };
  }

  activeListeningKeys(
    allListeners: any,
    chainId?: number
  ): { [callKey: string]: number } {
    if (!allListeners || !chainId) return {};
    const listeners = allListeners[chainId];
    if (!listeners) return {};

    return Object.keys(listeners).reduce<{ [callKey: string]: number }>(
      (memo, callKey) => {
        const keyListeners = listeners[callKey];

        memo[callKey] = Object.keys(keyListeners)
          .filter((key) => {
            const blocksPerFetch = parseInt(key);
            if (blocksPerFetch <= 0) return false;
            return keyListeners[blocksPerFetch] > 0;
          })
          .reduce((previousMin, current) => {
            return Math.min(previousMin, parseInt(current));
          }, Infinity);
        return memo;
      },
      {}
    );
  }
}
