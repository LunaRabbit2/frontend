import stakingConfig from '@/config/constants/staking';
import { SerializedStaking } from '@/config/constants/types';
import BigNumber from 'bignumber.js'
import { fetchStakingAllowance, fetchStakingData, fetchUserBalances, fetchUserDetails } from './fetchStakingData';

export interface StakingState {
  data: SerializedStaking[]
  userDataLoaded: boolean
}

const stakingStore = {
  state: <StakingState>{
    data: [...stakingConfig],
    userDataLoaded: false
  },
  mutations: {
    setStakingData(state: StakingState, { data }: { data: SerializedStaking[] }) {
      state.data = data;
    },
    setStakingsPublicData(state: StakingState, liveStakingsData) {
      state.data = state.data.map((stakingData) => {
        const liveStakingData = liveStakingsData.find((entry) => entry.lid === stakingData.lid)
        return { ...stakingData, ...liveStakingData }
      });
    },
    updateStakingUserData(state: StakingState, payload: any) {
      const { field, value, lid } = payload
      const index = state.data.findIndex((p) => p.lid === lid)

      if (index >= 0) {
        state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
      }
    },
    setStakingUserData(state: StakingState, payload: any) {
      const userData = payload;
      state.data = state.data.map((stakingData) => {
        const userStakingData = userData.find((entry) => entry.lid === stakingData.lid)
        return { ...stakingData, userDataLoaded: true, userData: userStakingData }
      })
      state.userDataLoaded = true
    }
  },
  actions: {
    async fetchStakingData({ state, commit, rootState, dispatch }) {
      const stakingsData = await fetchStakingData();

      const liveData = stakingConfig.map((level) => {
        const stakingData = stakingsData.find((entry) => entry.lid === level.lid)
        return {
          ...stakingData
        }
      })
      commit('setStakingsPublicData', liveData);
    },
    async fetchStakingUserDataAsync({ state, commit, rootState, dispatch }, account: string) {
      try {
        const [allowances, userBalances, userStakingsDetail] = await Promise.all([
          fetchStakingAllowance(account),
          fetchUserBalances(account),
          fetchUserDetails(account),
        ])

        const userData = stakingConfig.map((stakingLvl, i) => ({
          lid: stakingLvl.lid,
          allowance: allowances[stakingLvl.lid],
          balance: userBalances[stakingLvl.lid],
          ...userStakingsDetail[stakingLvl.lid],
        }))

        commit('setStakingUserData', userData);
      } catch (error) {
        console.error('[Pools Action] Error fetching pool user data', error)
      }
    }
  }
}

export default stakingStore;