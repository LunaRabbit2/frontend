import { Order } from '@gelatonetwork/limit-orders-lib'
import { ChainId } from "@/config/constants/types"
const now = () => new Date().getTime()

export type TransactionType =
  | 'approve'
  | 'swap'
  | 'wrap'
  | 'add-liquidity'
  | 'remove-liquidity'
  | 'limit-order-submission'
  | 'limit-order-cancellation'
  | 'limit-order-approval'

export interface SerializableTransactionReceipt {
  to: string
  from: string
  contractAddress: string
  transactionIndex: number
  blockHash: string
  transactionHash: string
  blockNumber: number
  status?: number
}

export interface TransactionDetails {
  hash: string
  approval?: { tokenAddress: string; spender: string }
  type?: TransactionType
  order?: Order
  summary?: string
  claim?: { recipient: string }
  receipt?: SerializableTransactionReceipt
  lastCheckedBlockNumber?: number
  addedTime: number
  confirmedTime?: number
  from: string
}

export interface TransactionState {
  [CHAIN_ID: number]: {
    [txHash: string]: TransactionDetails
  }
}

const transactionStore = {
  state: <TransactionState>{},
  mutations: {
    addTransaction(state: TransactionState, { CHAIN_ID, from, hash, approval, summary, claim, type, order }: {
      CHAIN_ID: ChainId
      hash: string
      from: string
      approval?: { tokenAddress: string; spender: string }
      claim?: { recipient: string }
      summary?: string
      type?: TransactionType
      order?: Order
    }) {
      if (state[CHAIN_ID]?.[hash]) {
        throw Error('Attempted to add existing transaction.')
      }
      const txs = state[CHAIN_ID] ?? {}
      txs[hash] = { hash, approval, summary, claim, from, addedTime: now(), type, order }
      state[CHAIN_ID] = txs
    },
    clearAllTransactions(state: TransactionState, { CHAIN_ID }: {
      CHAIN_ID: ChainId
    }) {
      if (!state[CHAIN_ID]) return
      state[CHAIN_ID] = {}
    },
    checkedTransaction(state: TransactionState, { CHAIN_ID, hash, blockNumber }: {
      CHAIN_ID: ChainId
      hash: string
      blockNumber: number
    }) {
      const tx = state[CHAIN_ID]?.[hash]
      if (!tx) {
        return
      }
      if (!tx.lastCheckedBlockNumber) {
        tx.lastCheckedBlockNumber = blockNumber
      } else {
        tx.lastCheckedBlockNumber = Math.max(blockNumber, tx.lastCheckedBlockNumber)
      }
    },
    finalizeTransaction(state: TransactionState, { CHAIN_ID, hash, receipt }: {
      CHAIN_ID: ChainId
      hash: string
      receipt: SerializableTransactionReceipt
    }) {
      const tx = state[CHAIN_ID]?.[hash]
      if (!tx) {
        return
      }
      tx.receipt = receipt
      tx.confirmedTime = now()
    }
  }
}

export default transactionStore;