<template>
  <template v-if="needsApproval">
    <ApprovalAction :stakingData="stakingData" :isLoading="isLoading" />
  </template>
  <StakeActions
    v-else
    :isLoading="isLoading"
    :stakingData="stakingData"
    :stakingTokenBalance="stakingTokenBalance"
    :stakedBalance="stakedBalance"
    :isStaked="isStaked"
  />
</template>
<script lang="ts">
import { Options, Vue, mixins } from "vue-class-component";
import { SerializedStaking } from "@/config/constants/types";
import { BigNumber } from "bignumber.js";
import ApprovalAction from "./ApprovalAction.vue";
import StakeActions from "./StakeActions.vue";
import { BIG_ZERO } from "@/utils/bigNumber";
import { watchEffect } from "vue";
import CommonMixin from "@/helpers/mixins/CommonMixin";

class Props {
  stakingData: SerializedStaking;
  stakedBalance: BigNumber;
}

@Options({
  watch: {},
  components: { ApprovalAction, StakeActions },
})
export default class CardActions extends mixins(Vue.with(Props), CommonMixin) {
  isLoading = true;
  needsApproval: boolean = true;
  isStaked: boolean = false;
  stakingTokenBalance: BigNumber = BIG_ZERO;

  mounted() {
    watchEffect(() => {
      const allowance = this.stakingData.userData?.allowance
        ? new BigNumber(this.stakingData.userData.allowance)
        : BIG_ZERO;
      this.stakingTokenBalance = this.stakingData.userData?.balance
        ? new BigNumber(this.stakingData.userData.balance)
        : BIG_ZERO;
      this.isLoading = !this.stakingData.userData;
      this.needsApproval = !allowance.gt(0);
      this.isStaked = this.stakedBalance.gt(0);
    });
  }
}
</script>