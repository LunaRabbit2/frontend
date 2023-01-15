import { ChainId } from './constants/types';
import BigNumber from 'bignumber.js/bignumber';
import { BIG_TEN } from '@/utils/bigNumber';
import { CHAIN_ID } from './constants/networks'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

export const BSC_BLOCK_TIME = 3;

export const BASE_BSC_SCAN_URLS = {
  [ChainId.MAINNET]: 'https://bscscan.com',
  [ChainId.TESTNET]: 'https://testnet.bscscan.com',
}

export const BASE_BSC_SCAN_URL = BASE_BSC_SCAN_URLS[CHAIN_ID];
export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18);
export const DEFAULT_GAS_LIMIT = 500000;
export const REFRESH_CACHED_INTERVAL = 6000
