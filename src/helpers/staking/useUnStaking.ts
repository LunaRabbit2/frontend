import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from '@/config'
import { BIG_TEN } from '@/utils/bigNumber'
import getGasPrice from '@/utils/getGasPrice'
import BigNumber from 'bignumber.js'
import { useLunarStaking } from '../useContract'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

const unstake = async (stakingContract, lid: number) => {
  const gasPrice = getGasPrice()

  return stakingContract.withdraw(lid, {
    ...options,
    gasPrice,
  })
}


const useUnStaking = (lid: number) => {
  const stakingContract = useLunarStaking()

  const handleUnstake = async () => {
    return unstake(stakingContract, lid)
  }

  return { onUnstake: handleUnstake }
}

export default useUnStaking
