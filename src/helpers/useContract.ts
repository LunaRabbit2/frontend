import {
  getBep20Contract,
  getStakingContract,
} from '@/utils/contractHelpers'
import { getMulticallAddress } from '@/utils/addressHelpers'

// Imports below migrated from Exchange useContract.ts
import { Contract } from '@ethersproject/contracts'
import ERC20_ABI from '@/config/abis/erc20.json'
import multiCallAbi from '../config/abis/Multicall.json'
import { getContract, getProviderOrSigner } from '@/utils'
import store from '../store';
import { ethers } from 'ethers'
import { ERC20_BYTES32_ABI } from '@/config/abis/erc20'
import { Web3Provider } from '@ethersproject/providers'

/**
 * Helper hooks to get specific contracts (by ABI)
 */

const providerObj = (): Web3Provider | undefined => {
  const web3 = store.state.web3;
  const provider = web3.provider ? new ethers.providers.Web3Provider(
    web3.provider
  ) : undefined;
  return provider;
}

export const useERC20 = (address: string, withSignerIfPossible = true) => {
  const { user } = store.state.web3;

  return getBep20Contract(address, withSignerIfPossible ? getProviderOrSigner(providerObj(), user.address) : null)
}

export const useLunarStaking = () => {
  const { user } = store.state.web3;
  return getStakingContract(getProviderOrSigner(providerObj(), user.address))
}

// Code below migrated from Exchange useContract.ts

// returns null on errors
function useContract<T extends Contract = Contract>(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true,
): T | null {

  if (!address || !ABI) return null
  try {
    const { user } = store.state.web3;
    return getContract(address, ABI, withSignerIfPossible ? getProviderOrSigner(providerObj(), user.address) : null) as T
  } catch (error) {
    console.error('Failed to get contract', error)
    return null
  }
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function useMulticallContract() {
  return useContract(getMulticallAddress(), multiCallAbi, false)
}