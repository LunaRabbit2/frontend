import { ChainId } from '../config/constants/types'
import addresses from '../config/constants/contracts'
import { Address } from '../config/constants/types'
import { CHAIN_ID } from '@/config/constants/networks'

export const getAddress = (address: Address): string => {
  return address[CHAIN_ID] ? address[CHAIN_ID] : address[ChainId.MAINNET]
}

export const getStakingAddress = () => {
  return getAddress(addresses.staking)
}

export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall);
}

export const getLunarTokenAddress = () => {
  return getAddress(addresses.lunar);
}
