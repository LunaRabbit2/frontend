import { TransactionResponse } from '@ethersproject/providers'
import { CHAIN_ID } from "@/config/constants/networks"
import { TransactionDetails, TransactionType } from "@/store/modules/transactions"
import store from '@/store';
import { Order } from '@gelatonetwork/limit-orders-lib';

/**
 * Returns whether a transaction happened in the last day (86400 seconds * 1000 milliseconds / second)
 * @param tx to check for recency
 */
export function isTransactionRecent(tx: TransactionDetails): boolean {
  return new Date().getTime() - tx.addedTime < 86_400_000
}

export function useAllTransactions(): { [txHash: string]: TransactionDetails } {
  const state = store.state.transactions;

  return CHAIN_ID ? state[CHAIN_ID] ?? {} : {}
}

// helper that can take a ethers library transaction response and add it to the list of transactions
export function useTransactionAdder(): (
  response: TransactionResponse,
  customData?: {
    summary?: string
    approval?: { tokenAddress: string; spender: string }
    claim?: { recipient: string }
    type?: TransactionType
    order?: Order
  },
) => void {
  const user = store.state.web3.user;
  return (
      response: TransactionResponse,
      {
        summary,
        approval,
        claim,
        type,
        order,
      }: {
        summary?: string
        claim?: { recipient: string }
        approval?: { tokenAddress: string; spender: string }
        type?: TransactionType
        order?: Order
      } = {},
    ) => {
    if (!user.active) return
      if (!CHAIN_ID) return

      const { hash } = response
      if (!hash) {
        throw Error('No transaction hash found.')
      }
    store.commit('addTransaction', { hash, from: user.address, CHAIN_ID, approval, summary, claim, type, order })
    }
}

export function useHasPendingApproval(tokenAddress: string | undefined, spender: string | undefined): boolean {
  const allTransactions = useAllTransactions()
  return typeof tokenAddress === 'string' &&
    typeof spender === 'string' &&
    Object.keys(allTransactions).some((hash) => {
      const tx = allTransactions[hash]
      if (!tx) return false
      if (tx.receipt) {
        return false
      }
      const { approval } = tx
      if (!approval) return false
      return approval.spender === spender && approval.tokenAddress === tokenAddress && isTransactionRecent(tx)
    })
}