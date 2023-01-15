import { ethers } from "ethers";
import { parseInt } from 'lodash';
import { CHAIN_ID } from "@/config/constants/networks";
import { GAS_PRICE_GWEI } from "@/helpers/utils";
import { getLibrary } from "@/utils/web3";

const ALERT_LIFTIME = 5000;

export interface UserState {
  web3Modal: any;
  chainId: number;
  library: ethers.providers.Web3Provider;
  provider: ethers.providers.ExternalProvider;
  user: {
    address: string;
    active: boolean;
    balance: string;
    gasPrice: string;
  }
}

const web3Store = {
  state: <UserState>{
    web3Modal: null,
    chainId: 0,
    provider: getLibrary().provider,
    library: getLibrary(),
    user: {
      active: false,
      address: null,
      balance: '0',
      gasPrice: GAS_PRICE_GWEI.default,
    }
  },
  mutations: {
    setWeb3Modal(state: UserState, web3Modal: any) {
      state.web3Modal = web3Modal
    },
    setActive(state: UserState, active: boolean) {
      state.user.active = active
    },
    setAccount(state: UserState, account) {
      state.user.address = !account ? null : account
    },
    setChainId(state: UserState, chainId: number) {
      state.chainId = chainId
    },
    setLibrary(state: UserState, library: ethers.providers.Web3Provider) {
      state.library = library
    },
    setProvider(state: UserState, provider: ethers.providers.ExternalProvider) {
      state.provider = provider;
    },
    setBalance(state: UserState, balance: string) {
      state.user.balance = balance;
    },
    setUserGasPrice(state: UserState, { gasPrice }: { gasPrice: string }) {
      state.user.gasPrice = gasPrice;
    },
    updateGasPrice(state: UserState, { gasPrice }: { gasPrice: string }) {
      state.user.gasPrice = gasPrice;
    }
  },
  actions: {
    async connect({ state, commit, dispatch, rootState }) {
      const toast = rootState.toast;
      try {
        const provider = await state.web3Modal.connect();
        const library = new ethers.providers.Web3Provider(provider);
        const network = await library.getNetwork();

        commit('setProvider', library.provider);
        library.pollingInterval = 12000;
        commit('setLibrary', library);

        if (network.chainId != CHAIN_ID) {
          toast.add({ severity: 'error', summary: 'Unsupported Chain', detail: `Make sure you're on BSC network`, life: ALERT_LIFTIME });
          return;
        }

        const accounts = await library.listAccounts();
        if (accounts.length > 0) {
          commit('setAccount', accounts[0]);
        } else {
          await dispatch('resetApp');
          return;
        }

        commit('setChainId', network.chainId);
        commit('setActive', true);

        provider.on("connect", async (info) => {
          let chainId = parseInt(info.chainId)
          if (chainId != CHAIN_ID) {
            commit('setChainId', null)
            commit('setActive', false)
            toast.add({ severity: 'error', summary: 'Unsupported Chain', detail: `Make sure you're on BSC network`, life: ALERT_LIFTIME });
            return;
          }
          commit('setChainId', chainId)
        });

        provider.on("accountsChanged", async (accounts) => {
          if (accounts.length > 0) {
            commit('setAccount', accounts[0])
          } else {
            await dispatch('resetApp')
          }
        });
        provider.on("disconnect", async (error) => {
          console.log('error.code');
          console.log(error.code);
        });
        provider.on("chainChanged", async (chainId) => {
          chainId = parseInt(chainId)
          if (chainId != CHAIN_ID) {
            commit('setChainId', null);
            commit('setActive', false);
            toast.add({ severity: 'error', summary: 'Unsupported Chain', detail: `Make sure you're on BSC network`, life: ALERT_LIFTIME });
            return;
          }
          commit('setChainId', chainId)
          window.location.reload();
        });
      } catch (err) {
      }
    },
    async resetApp({ state, commit }) {
      try {
        await state.web3Modal.clearCachedProvider();
      } catch (error) {
        console.error(error)
      }
      commit('setAccount', null);
      commit('setActive', false);
      commit('setProvider', getLibrary().provider);
      commit('setLibrary', getLibrary())
      commit('setBalance', 0);
      window.location.reload();
    },
  }
}

export default web3Store;