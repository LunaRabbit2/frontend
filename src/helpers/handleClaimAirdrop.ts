import { useCallWithGasPrice } from './useCallWithGasPrice'
import { usePrimAirContract } from './useContract'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from '@/utils/bigNumber';

export const useClaimAirdrop = () => {
  const primAirContract = usePrimAirContract();
  const { callWithGasPrice } = useCallWithGasPrice()

  const handleClaimAirdrop = async (account: string) => {
    const decimals = 18
    console.log(primAirContract);
    const depositAmount = new BigNumber('0.004239631336406').times(BIG_TEN.pow(decimals)).toString(10)
    return callWithGasPrice(primAirContract, 'airdrop', [account], { value: depositAmount })
  }

  return { handleClaimAirdrop }
}