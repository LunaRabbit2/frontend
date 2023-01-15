import BigNumber from 'bignumber.js'

export enum FetchStatus {
  Idle = 'IDLE',
  Fetching = 'FETCHING',
  Fetched = 'FETCHED',
  Failed = 'FAILED',
}

export enum GAS_PRICE {
  default = '5',
  fast = '6',
  instant = '7',
  testnet = '10',
}

export interface Address {
  97?: string
  56: string,
  5777?: string
}

export interface SerializedToken {
  chainId: number
  address: string
  decimals: number
  symbol?: string
  name?: string
  projectLink?: string
}

export interface SerializedStaking {
  lid: number
  tier: string
  contractAddress: Address
  apr: BigNumber
  totalStaked?: string
  totalEarned?: string
  stakingDuration: string
  lockPlan: string
  userData?: {
    allowance: string
    totalReward: string
    balance: BigNumber
    amountStaked: string
    lockEndTimestamp: string
  }
}

export interface SerializedStakingPoolState {
  data: SerializedStaking[]
  userDataLoaded: boolean
}

export enum ChainId {
  MAINNET = 56,
  TESTNET = 97,
}

export type SerializedBigNumber = string