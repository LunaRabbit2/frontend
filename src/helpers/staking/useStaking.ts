import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from '@/config'
import { BIG_TEN } from '@/utils/bigNumber'
import getGasPrice from '@/utils/getGasPrice'
import BigNumber from 'bignumber.js'
import { useLunarStaking } from '../useContract'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

const stake = async (stakingContract, amount, decimals = 18, lid: number) => {
  const gasPrice = getGasPrice()
  const depositAmount = new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString(10)

  return stakingContract.stake(depositAmount, lid, {
    ...options,
    gasPrice,
  })
}

const useStaking = (lid: number) => {
  const stakingContract = useLunarStaking()

  const handleStake = async (amount: string, decimals: number) => {
    return stake(stakingContract, amount, decimals, lid)
  }

  return { onStake: handleStake }
}

export default useStaking
