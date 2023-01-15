import { ethers } from 'ethers'
import web3 from 'web3'
import { NETWORK_URL } from '../config/constants/networks';

const POLLING_INTERVAL = 12000;
export const getLibrary = () => {
  
  const httpProvider = new web3.providers.HttpProvider(NETWORK_URL);
  // @ts-ignore
  const web3NoAccount = new ethers.providers.Web3Provider(httpProvider);
  web3NoAccount.pollingInterval = POLLING_INTERVAL;
  return web3NoAccount;
}

export const simpleRpcProvider = new ethers.providers.JsonRpcProvider(NETWORK_URL)