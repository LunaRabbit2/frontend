import { fetchStakingAllowance, fetchUserBalances, fetchUserDetails, fetchUserStaked } from "@/store/modules/staking/fetchStakingData";
import store from "@/store";
import { watchEffect } from "vue";
import stakingConfig from "@/config/constants/staking";

export const stakingWithUserDataLoadingSelector = () => {
  const stakingData = store.state.staking.data;
  const userDataLoaded = store.state.staking.userDataLoaded;

  return { data: stakingData, userDataLoaded }
}

export const useStaking = () => {
  const stakingWithUserDataLoading = stakingWithUserDataLoadingSelector()
  const { data, userDataLoaded } = stakingWithUserDataLoading

  return { data, userDataLoaded }
}

export const useStakingPageFetch = () => {
  store.dispatch('fetchStakingData');

  watchEffect(() => {
    const { address } = store.state.web3.user;
    if (address) {
      store.dispatch('fetchStakingUserDataAsync', address);
    }
  })
}

export const updateUserStakingAllowance =
  async (account: string, lid: number) => {
    const allowances = await fetchStakingAllowance(account)
    stakingConfig.map((skaingLv) => {
      store.commit("updateStakingUserData", { lid, field: 'allowance', value: allowances[skaingLv.lid] });
    })
  }

  export const updateUserStakingDetails = async (account: string, lid: number) => {
    const userStakingsDetail = await fetchUserDetails(account);
    const fields = ['amountStaked', 'totalReward', 'lockEndTimestamp'];
    fields.map((field) => {
      store.commit("updateStakingUserData", { lid, field: field, value: userStakingsDetail[lid][field] });
    })
  }

export const updateUserStakedBalance =
  async (account: string, lid: number) => {
    const stakedBalance = await fetchUserStaked(account)
    store.commit('updateStakingUserData', { lid, field: 'stakedBalance', value: stakedBalance[lid] })
  }

export const updateUserBalance =
  async (account: string, lid: number) => {
    const balance = await fetchUserBalances(account)
    store.commit('updateStakingUserData', { lid, field: 'balance', value: balance[lid] })
  }