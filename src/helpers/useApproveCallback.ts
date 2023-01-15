import { calculateGasMargin } from '@/utils'
import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { TokenAmount, CurrencyAmount, ETHER } from '@pancakeswap/sdk'
import { useTokenContract } from './useContract'
import store from '@/store';
import { useCallWithGasPrice } from './useCallWithGasPrice'
import useTokenAllowance from './useTokenAllowance'
import { useHasPendingApproval, useTransactionAdder } from './transactions'

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

const _approveState = (amountToApprove: CurrencyAmount, spender: string, currentAllowance: TokenAmount, pendingApproval: boolean) => {
  if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
  if (amountToApprove.currency === ETHER || amountToApprove.currency.symbol === ETHER.symbol) return ApprovalState.APPROVED
  // we might not have enough data to know whether or not we need to approve
  if (!currentAllowance) return ApprovalState.UNKNOWN

  // amountToApprove will be defined if currentAllowance is
  return currentAllowance.lessThan(amountToApprove)
    ? pendingApproval
      ? ApprovalState.PENDING
      : ApprovalState.NOT_APPROVED
    : ApprovalState.APPROVED
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: CurrencyAmount,
  spender?: string,
): [ApprovalState, () => Promise<void>] {
  const { callWithGasPrice } = useCallWithGasPrice()
  const token = amountToApprove instanceof TokenAmount ? amountToApprove.token : undefined
  const currentAllowance = useTokenAllowance(token, store.state.web3.user.address ?? undefined, spender)
  const pendingApproval = useHasPendingApproval(token?.address, spender)

  // check the current approval status
  const approvalState: ApprovalState = _approveState(amountToApprove, spender, currentAllowance, pendingApproval)

  const tokenContract = useTokenContract(token?.address)
  const addTransaction = useTransactionAdder()

  const approve = async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }
    if (!token) {
      console.error('no token')
      return
    }

    if (!tokenContract) {
      console.error('tokenContract is null')
      return
    }

    if (!amountToApprove) {
      console.error('missing amount to approve')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }

    let useExact = false

    const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
      // general fallback for tokens who restrict approval amounts
      useExact = true
      return tokenContract.estimateGas.approve(spender, amountToApprove.raw.toString())
    })

    // eslint-disable-next-line consistent-return
    return callWithGasPrice(
      tokenContract,
      'approve',
      [spender, useExact ? amountToApprove.raw.toString() : MaxUint256],
      {
        gasLimit: calculateGasMargin(estimatedGas),
      },
    )
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: `Approve ${amountToApprove.currency.symbol}`,
          approval: { tokenAddress: token.address, spender },
        })
      })
      .catch((error: Error) => {
        console.error('Failed to approve token', error)
        throw error
      })
  }

  return [approvalState, approve]
}