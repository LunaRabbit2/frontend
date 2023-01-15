import { REFRESH_CACHED_INTERVAL } from '@/config';
import { useSWR } from 'vswr'
import { simpleRpcProvider } from '@/utils/web3';

const BLOCK_STATE = {
  LOADING: 'LOADING',
  DONE: 'DONE'
}

export interface BlockState {
  initialBlock: number;
  currentBlock: number;
  blockState: string
}

const blockStore = {
  state: <BlockState>{
    initialBlock: 0,
    currentBlock: 0,
    blockState: BLOCK_STATE.LOADING,
  },
  mutations: {
    setBlock(state: { initialBlock: number; currentBlock: number, blockState: string; }, payload: number) {
      if (state.initialBlock === 0) {
        state.initialBlock = payload
      }

      state.currentBlock = payload
      state.blockState = BLOCK_STATE.DONE
    },
    setInitialBlock(state: { initialBlock: number, blockState: string; }, payload: number) {
      state.initialBlock = payload
      state.blockState = BLOCK_STATE.DONE
    },
    setCurrentBlock(state: { currentBlock: number, blockState: string; }, payload: number) {
      state.currentBlock = payload
      state.blockState = BLOCK_STATE.DONE
    },
  },
  actions: {
    async loadBlockNumber({ state, commit }) {
      useSWR('blockNumber', {
        fetcher: async () => {
          const blockNumber = await simpleRpcProvider.getBlockNumber();
          commit('setBlock', blockNumber)
          return blockNumber
        },
        dedupingInterval: REFRESH_CACHED_INTERVAL
      });
    }
  }
}

export default blockStore;