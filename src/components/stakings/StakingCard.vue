<script lang="ts">
import { SerializedStaking } from "@/config/constants/types";
import { Vue, mixins, Options } from "vue-class-component";
import CommonMixin from "@/helpers/mixins/CommonMixin";
import { getAddress } from "@/utils/addressHelpers";
import { BASE_BSC_SCAN_URL } from "@/config";
import { BIG_ZERO } from "@/utils/bigNumber";
import BigNumber from "bignumber.js";
import ConnectWalletButton from "../Buttons/ConnectWalletButton.vue";
import CardActions from "./actions/CardActions.vue";
import { getBalanceNumber } from "@/utils/formatBalance";
import HarvestAction from "./actions/HarvestAction.vue";
import CountDown from "../CountDown.vue";

class Props {
  stakingData: SerializedStaking;
}

@Options({
  components: {
    ConnectWalletButton,
    CardActions,
    HarvestAction,
    CountDown,
  },
  watch: {

  },
})
export default class StakingCard extends mixins(Vue.with(Props), CommonMixin) {
  BASE_BSC_SCAN_URL = BASE_BSC_SCAN_URL;
  BIG_ZERO = BIG_ZERO;

  isLoading = true;

  BigNumber = BigNumber;

  getAddress(address) {
    return getAddress(address);
  }

  getFormattedBalance(val) {
    var formatter = new Intl.NumberFormat("en-US", {
      // These options are needed to round to whole numbers if that's what you want.
      //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      maximumFractionDigits: 6,
    });
    return formatter.format(val);
  }

  getBalanceNumber(val: BigNumber, decimal = 2) {
    return getBalanceNumber(val, decimal);
  }
}
</script>

<template>
  <div class="col-12 col-md-5">
    <div class="card">
      <div class="card-header">
        <div class="d-flex align-items-end flex-wrap gap-1">
          <div class="stacked">
            <img class="item sq-3 rounded-circle" src="/img/llogoo.png" alt="LUNA" />
          </div>
          <div class="text-left content">
            <h5>{{stakingData.tier}}</h5>
            <p style="color: #606060">Stake LunarRabbit</p>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="d-flex mb-3">
          <span class="mr-auto">APR:</span>
          <span v-if="stakingData.apr">{{ stakingData.apr }}%</span>
          <span v-else>-</span>
        </div>
        <div class="d-flex mb-3">
          <span class="mr-auto">Total staked:</span>
          <span v-if="stakingData.totalStaked > 0">
            {{ getFormattedBalance(getBalanceNumber(stakingData.totalStaked, 18)) }}
            LUNA
          </span>
          <span v-else>-</span>
        </div>
        <div class="d-flex mb-3">
          <span class="mr-auto">Total Earnings:</span>
          <span class="text-primary" v-if="stakingData.userData?.totalReward > 0">{{
            getFormattedBalance(getBalanceNumber(stakingData.userData?.totalReward, 18)) }}</span>
          <span class="text-primary" v-else>0</span>
        </div>
        <div class="d-flex mb-3">
          <span class="mr-auto">Duration:</span>
          <span class="text-primary">{{ stakingData.stakingDuration }}</span>
        </div>
        <div class="d-flex mb-3">
          <span class="mr-auto">Plan:</span>
          <span class="text-primary">{{ stakingData.lockPlan }}</span>
        </div>
        <div class="d-flex mb-3" v-if="stakingData.userData?.amountStaked > 0">
          <span class="mr-auto">Lock Duration:</span>
          <CountDown :countDownEndTime="stakingData.userData.lockEndTimestamp" />
        </div>
        <div v-if="stakingData.lockPlan == 'Flexible'" class="info-text">
          You can unstake anytime
        </div>
        <HarvestAction v-if="stakingData.userData?.totalReward > 0"
          :stakingData="stakingData" :isLoading="isLoading" />
        <hr class="s-2" />
        <p>Your Staking</p>
        <ConnectWalletButton />
        <CardActions v-if="isWalletConnected" :stakingData="stakingData" :stakedBalance="
          stakingData.userData?.amountStaked
            ? new BigNumber(stakingData.userData?.amountStaked)
            : BIG_ZERO
        " />
        <hr class="s-2" />
        <div class="flex-container align-items-center">
          <span class="
              flex-center
              h
              py-1
              px-2
              link
            "></span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.info-text {
  color: #55c165;
  padding: 5px;
}
</style>