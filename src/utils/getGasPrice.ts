import { CHAIN_ID } from '../config/constants/networks'
import store from '../store'
import { ChainId } from '@/config/constants/types'
import { GAS_PRICE_GWEI } from '@/helpers/utils'

const getGasPrice = (): string => {
  const chainId = CHAIN_ID;
  const web3 = store.state.web3;
  const userGas = web3.user.gasPrice || GAS_PRICE_GWEI.default;
  return chainId === ChainId.MAINNET ? userGas : GAS_PRICE_GWEI.testnet;
}

export default getGasPrice;