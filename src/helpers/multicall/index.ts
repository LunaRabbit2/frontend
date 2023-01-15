import { Interface, FunctionFragment } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from "@ethersproject/contracts"
import { CHAIN_ID } from "@/config/constants/networks"
import store from '../../store';
import { Call, toCallKey } from './utils';
import { watchEffect } from 'vue';

export function parseCallKey(callKey: string): Call {
  const pcs = callKey.split('-')
  if (pcs.length !== 2) {
    throw new Error(`Invalid call key: ${callKey}`)
  }
  return {
    address: pcs[0],
    callData: pcs[1],
  }
}

export interface Result extends ReadonlyArray<any> {
  readonly [key: string]: any
}

export interface ListenerOptions {
  // how often this data should be fetched, by default 1
  readonly blocksPerFetch?: number
}

type MethodArg = string | number | BigNumber
type MethodArgs = Array<MethodArg | MethodArg[]>

const INVALID_RESULT: CallResult = { valid: false, blockNumber: undefined, data: undefined }
const INVALID_CALL_STATE: CallState = { valid: false, result: undefined, loading: false, syncing: false, error: false }
const LOADING_CALL_STATE: CallState = { valid: true, result: undefined, loading: true, syncing: true, error: false }

type OptionalMethodInputs = Array<MethodArg | MethodArg[] | undefined> | undefined

function isMethodArg(x: unknown): x is MethodArg {
  return ['string', 'number'].indexOf(typeof x) !== -1
}

function isValidMethodArgs(x: unknown): x is MethodArgs | undefined {
  return (
    x === undefined ||
    (Array.isArray(x) && x.every((xi) => isMethodArg(xi) || (Array.isArray(xi) && xi.every(isMethodArg))))
  )
}

function toCallState(
  callResult: CallResult | undefined,
  contractInterface: Interface | undefined,
  fragment: FunctionFragment | undefined,
  latestBlockNumber: number | undefined,
): CallState {
  if (!callResult) return INVALID_CALL_STATE
  const { valid, data, blockNumber } = callResult
  if (!valid) return INVALID_CALL_STATE
  if (valid && !blockNumber) return LOADING_CALL_STATE
  if (!contractInterface || !fragment || !latestBlockNumber) return LOADING_CALL_STATE
  const success = data && data.length > 2
  const syncing = (blockNumber ?? 0) < latestBlockNumber
  let result: Result | undefined
  if (success && data) {
    try {
      result = contractInterface.decodeFunctionResult(fragment, data)
    } catch (error) {
      console.debug('Result data parsing failed', fragment, data)
      return {
        valid: true,
        loading: false,
        error: true,
        syncing,
        result,
      }
    }
  }
  return {
    valid: true,
    loading: false,
    syncing,
    result,
    error: !success,
  }
}

function useCallsData(calls: (Call | undefined)[], options?: ListenerOptions): CallResult[] {
  const callResults = store.state.multicall.callResults;

  if (!callResults || callResults === undefined) return;

  const serializedCallKeys: string = JSON.stringify(
    calls
      ?.filter((c): c is Call => Boolean(c))
      ?.map(toCallKey)
      ?.sort() ?? [],
  )

  watchEffect(async (onCleanup) => {
    const callKeys: string[] = JSON.parse(serializedCallKeys)
    if (!CHAIN_ID || callKeys.length === 0) return undefined
    const calls = callKeys.map((key) => parseCallKey(key))
    store.commit('addMulticallListeners', {
      CHAIN_ID,
      calls,
      options,
    });

    onCleanup(() => store.commit('removeMulticallListeners', {
      CHAIN_ID,
      calls,
      options,
    }))
  })

  return calls.map<CallResult>((call) => {
    if (!CHAIN_ID || !call) return INVALID_RESULT

    const result = callResults[CHAIN_ID]?.[toCallKey(call)]
    let data
    if (result?.data && result?.data !== '0x') {
      // eslint-disable-next-line prefer-destructuring
      data = result.data
    }

    return { valid: true, data, blockNumber: result?.blockNumber }
  })
}

interface CallResult {
  readonly valid: boolean
  readonly data: string | undefined
  readonly blockNumber: number | undefined
}

export interface CallState {
  readonly valid: boolean
  // the result, or undefined if loading or errored/no data
  readonly result: Result | undefined
  // true if the result has never been fetched
  readonly loading: boolean
  // true if the result is not for the latest block
  readonly syncing: boolean
  // true if the call was made and is synced, but the return data is invalid
  readonly error: boolean
}

// use this options object
export const NEVER_RELOAD: ListenerOptions = {
  blocksPerFetch: Infinity,
}

export function useSingleCallResult(
  contract: Contract | null | undefined,
  methodName: string,
  inputs?: OptionalMethodInputs,
  options?: ListenerOptions,
): CallState {
  const fragment = contract?.interface?.getFunction(methodName)

  const calls = contract && fragment && isValidMethodArgs(inputs)
    ? [
      {
        address: contract.address,
        callData: contract.interface.encodeFunctionData(fragment, inputs),
      },
    ]
    : []

  const result = useCallsData(calls, options)[0]
  const blockStore = store.state.blockStore;
  const currentBlock = blockStore.currentBlock;

  return toCallState(result, contract?.interface, fragment, currentBlock)
}

export function useSingleContractMultipleData(
  contract: Contract | null | undefined,
  methodName: string,
  callInputs: OptionalMethodInputs[],
  options?: ListenerOptions,
): CallState[] {
  const fragment = contract?.interface?.getFunction(methodName)

  const calls = contract && fragment && callInputs && callInputs.length > 0
    ? callInputs.map<Call>((inputs) => {
      return {
        address: contract.address,
        callData: contract.interface.encodeFunctionData(fragment, inputs),
      }
    })
    : []

  const results = useCallsData(calls, options)

  const blockStore = store.state.blockStore;
  const currentBlock = blockStore.currentBlock

  return results.map((result) => toCallState(result, contract?.interface, fragment, currentBlock))
}

export function useMultipleContractSingleData(
  addresses: (string | undefined)[],
  contractInterface: Interface,
  methodName: string,
  callInputs?: OptionalMethodInputs,
  options?: ListenerOptions,
): CallState[] {
  const fragment = contractInterface.getFunction(methodName)
  const callData: string | undefined = fragment && isValidMethodArgs(callInputs)
    ? contractInterface.encodeFunctionData(fragment, callInputs)
    : undefined

  const calls = fragment && addresses && addresses.length > 0 && callData
    ? addresses.map<Call | undefined>((address) => {
      return address && callData
        ? {
          address,
          callData,
        }
        : undefined
    })
    : []

  const results = useCallsData(calls, options)

  const blockStore = store.state.blockStore;
  const currentBlock = blockStore.currentBlock

  return results.map((result) => toCallState(result, contractInterface, fragment, currentBlock))
}
