import type { Signer } from '@ethersproject/abstract-signer'
import type { Provider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'

import { simpleRpcProvider } from './web3'

// Addresses
import {
  getMulticallAddress,
  getStakingAddress
} from './addressHelpers'

// ABI
import bep20Abi from '../config/abis/erc20.json'
import MultiCallAbi from '../config/abis/Multicall.json'
import stakingABI from '../config/abis/staking.json';

const getContract = (abi: any, address: string, signer?: Signer | Provider) => {
  const signerOrProvider = signer ?? simpleRpcProvider
  return new Contract(address, abi, signerOrProvider)
}
export const getBep20Contract = (address: string, signer?: Signer | Provider) => {
  return getContract(bep20Abi, address, signer)
}
export const getStakingContract = (signer?: Signer | Provider) => {
  return getContract(stakingABI, getStakingAddress(), signer)
}
export const getMulticallContract = (signer?: Signer | Provider) => {
  return getContract(MultiCallAbi, getMulticallAddress(), signer)
}
