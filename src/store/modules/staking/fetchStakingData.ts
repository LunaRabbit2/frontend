import stakingsConfig from '@/config/constants/staking';
import multicall from '@/utils/multicall';
import stakingABI from '@/config/abis/staking.json';
import erc20ABI from '@/config/abis/erc20.json';
import BigNumber from 'bignumber.js';
import { getAddress, getLunarTokenAddress } from '@/utils/addressHelpers';


const stakingTotals = stakingsConfig.map((stakingConfig) => {
  return {
    address: getAddress(stakingConfig.contractAddress),
    name: 'levelInfo',
    params: [stakingConfig.lid],
  }
})

export const fetchStakingData = async () => {
  const poolsTotalStaked = await multicall(stakingABI, stakingTotals)
  return stakingsConfig.map((p, index) => ({
    lid: p.lid,
    totalStaked: new BigNumber(poolsTotalStaked[index].totalStaked.toString()).toJSON(),
  }))
}

const userDetails = (account) => stakingsConfig.map(stakingConfig => {
  return {
    address: getAddress(stakingConfig.contractAddress),
    name: 'getUserDetails',
    params: [account, stakingConfig.lid]
  }
})

export const fetchUserStaked = async (account) => {
  const result = await multicall(stakingABI, userDetails(account));
  const [info, reward] = result[0];

  return stakingsConfig.reduce((acc, p, index) => ({ ...acc, [p.lid]: new BigNumber(info.amount.toString()).toJSON() }),
    {});
}

export const fetchUserDetails = async (account) => {
  const result = await multicall(stakingABI, userDetails(account));

  return stakingsConfig.reduce((acc, p, index) => {
    const [info, reward] = result[index];
    return ({
      ...acc, [p.lid]: {
        amountStaked: new BigNumber(info.amount.toString()).toJSON(),
        totalReward: new BigNumber(reward.toString()).toJSON(),
        lockEndTimestamp: info.lockEndTime.toString()
      }
    })
  },
    {});
}

export const fetchStakingAllowance = async (account) => {
  const calls = [{
    address: getLunarTokenAddress() || "",
    name: 'allowance',
    params: [account, getAddress(stakingsConfig[0].contractAddress)],
  }]

  const allowance = await multicall(erc20ABI, calls)
  return stakingsConfig.reduce((acc, p, index) => ({ ...acc, [p.lid]: new BigNumber(allowance).toJSON() }),
    {});
}

export const fetchUserBalances = async (account) => {
  const calls = [{
    address: getLunarTokenAddress() || "",
    name: 'balanceOf',
    params: [account],
  }]
  const tokenBalancesRaw = await multicall(erc20ABI, calls)

  return stakingsConfig.reduce((acc, p, index) => ({ ...acc, [p.lid]: new BigNumber(tokenBalancesRaw).toJSON() }),
    {});
}
