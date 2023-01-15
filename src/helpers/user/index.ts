import { CHAIN_ID } from "@/config/constants/networks"
import { ChainId } from "@/config/constants/types"
import { GAS_PRICE_GWEI } from "../utils"
import store from '@/store'

export function useGasPrice(): string {
  const chainId = CHAIN_ID
  const userGas = store.state.web3.user.gasPrice
  return chainId === ChainId.MAINNET ? userGas : GAS_PRICE_GWEI.testnet
}

export function useGasPriceManager(): [string, (userGasPrice: string) => void] {
  const userGasPrice = useGasPrice()

  const setGasPrice = (gasPrice: string) => {
    store.commit('updateGasPrice', { gasPrice })
  }

  return [userGasPrice, setGasPrice]
}