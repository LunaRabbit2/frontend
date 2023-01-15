import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from '@/config'
import getGasPrice from '@/utils/getGasPrice'
import { useLunarStaking } from '../useContract'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

const harvestLunar = async (stakingContract, lid: number) => {
  const gasPrice = getGasPrice()

  return stakingContract.harvest(lid, {
    ...options,
    gasPrice,
  })
}


const useHarvestStakings = (lid: number) => {
  const stakingContract = useLunarStaking()

  const handleHarvest = async () => {
    return harvestLunar(stakingContract, lid)
  }

  return { onReward: handleHarvest }
}

export default useHarvestStakings
