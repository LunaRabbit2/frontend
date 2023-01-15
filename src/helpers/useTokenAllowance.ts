import { Token, TokenAmount } from '@pancakeswap/sdk'

import { useTokenContract } from './useContract'
import { useSingleCallResult } from './multicall'

function useTokenAllowance(token?: Token, owner?: string, spender?: string): TokenAmount | undefined {
  const contract = useTokenContract(token?.address, false)

  const inputs = [owner, spender]
  const allowance = useSingleCallResult(contract, 'allowance', inputs).result

  return token && allowance ? new TokenAmount(token, allowance.toString()) : undefined
}

export default useTokenAllowance
