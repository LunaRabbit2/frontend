import { Call, toCallKey } from "@/helpers/multicall/utils"

export interface MulticallState {
  callListeners?: {
    // on a per-chain basis
    [CHAIN_ID: number]: {
      // stores for each call key the listeners' preferences
      [callKey: string]: {
        // stores how many listeners there are per each blocks per fetch preference
        [blocksPerFetch: number]: number
      }
    }
  }

  callResults: {
    [CHAIN_ID: number]: {
      [callKey: string]: {
        data?: string | null
        blockNumber?: number
        fetchingBlockNumber?: number
      }
    }
  }
}

const mintStore = {
  state: <MulticallState>{
    callResults: {},
    callListeners: {},
  },
  mutations: {
    addMulticallListeners(state: { callListeners: { [x: number]: { [callKey: string]: { [blocksPerFetch: number]: number; }; }; }; }, { calls, CHAIN_ID, options: { blocksPerFetch = 1 } = {}}: { calls: Call[]; CHAIN_ID: number; options: { blocksPerFetch?: number; }; }) {
      const listeners: MulticallState['callListeners'] = state.callListeners
        ? state.callListeners
        : (state.callListeners = {})
      listeners[CHAIN_ID] = listeners[CHAIN_ID] ?? {}
      calls.forEach((call) => {
        const callKey = toCallKey(call)
        listeners[CHAIN_ID][callKey] = listeners[CHAIN_ID][callKey] ?? {}
        listeners[CHAIN_ID][callKey][blocksPerFetch] = (listeners[CHAIN_ID][callKey][blocksPerFetch] ?? 0) + 1
      })
    },
    removeMulticallListeners(state: { callListeners: { [x: number]: { [callKey: string]: { [blocksPerFetch: number]: number; }; }; }; }, { CHAIN_ID, calls, options: { blocksPerFetch = 1 } = {} }: { CHAIN_ID: number; calls: Call[]; options: { blocksPerFetch?: number; }; }) {
      const listeners: MulticallState['callListeners'] = state.callListeners
        ? state.callListeners
        : (state.callListeners = {})

      if (!listeners[CHAIN_ID]) return
      calls.forEach((call) => {
        const callKey = toCallKey(call)
        if (!listeners[CHAIN_ID][callKey]) return
        if (!listeners[CHAIN_ID][callKey][blocksPerFetch]) return

        if (listeners[CHAIN_ID][callKey][blocksPerFetch] === 1) {
          delete listeners[CHAIN_ID][callKey][blocksPerFetch]
        } else {
          listeners[CHAIN_ID][callKey][blocksPerFetch]--
        }
      })
    },
    fetchingMulticallResults(state: any, { CHAIN_ID, fetchingBlockNumber, calls }: { CHAIN_ID: number; fetchingBlockNumber: number; calls: Call[]; }) {
      state.callResults[CHAIN_ID] = state.callResults[CHAIN_ID] ?? {}
      calls.forEach((call) => {
        const callKey = toCallKey(call)
        const current = state.callResults[CHAIN_ID][callKey]
        if (!current) {
          state.callResults[CHAIN_ID][callKey] = {
            fetchingBlockNumber,
          }
        } else {
          if ((current.fetchingBlockNumber ?? 0) >= fetchingBlockNumber) return
          state.callResults[CHAIN_ID][callKey].fetchingBlockNumber = fetchingBlockNumber
        }
      })
    },
    errorFetchingMulticallResults(state: { callResults: { [x: string]: { [x: string]: any; }; }; }, { fetchingBlockNumber, CHAIN_ID, calls }: { fetchingBlockNumber: number; CHAIN_ID: number; calls: Call[]; }) {
      state.callResults[CHAIN_ID] = state.callResults[CHAIN_ID] ?? {}
      calls.forEach((call) => {
        const callKey = toCallKey(call)
        const current = state.callResults[CHAIN_ID][callKey]
        if (!current) return // only should be dispatched if we are already fetching
        if (current.fetchingBlockNumber === fetchingBlockNumber) {
          delete current.fetchingBlockNumber
          current.data = null
          current.blockNumber = fetchingBlockNumber
        }
      })
    },
    updateMulticallResults(state: { callResults: { [x: string]: { [x: string]: { data: any; blockNumber: any; }; }; }; }, { CHAIN_ID, results, blockNumber }: { CHAIN_ID: number; results: { [callKey: string]: string | null }; blockNumber: number; }) {
      state.callResults[CHAIN_ID] = state.callResults[CHAIN_ID] ?? {}
      Object.keys(results).forEach((callKey) => {
        const current = state.callResults[CHAIN_ID][callKey]
        if ((current?.blockNumber ?? 0) > blockNumber) return
        state.callResults[CHAIN_ID][callKey] = {
          data: results[callKey],
          blockNumber,
        }
      })
    }
  },
  actions: {

  }
}

export default mintStore;