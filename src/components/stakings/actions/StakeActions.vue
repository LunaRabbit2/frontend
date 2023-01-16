<template>
  <div v-if="isStaked" class="d-flex justify-content-between align-items-center">
    <div class="d-flex flex-column">
      <span class="k-valueOne">{{
      getFormattedBalanceNumber(stakedTokenBalance, 3)
      }} LUNA</span>
    </div>
    <div class="d-flex justify-content-between">
      <button type="button" @click="onPresentStake" class="btn btn-sm stake-btn">
        <i class="bi bi-plus"></i>
      </button>
      <template v-if="stakingData.lockPlan == 'Fixed'">
        <button type="button" @click="onPresentUnstake" class="btn btn-sm stake-btn ml-2" v-if="allowUnstaking">
          <i class="bi bi-dash"></i>
        </button>
      </template>
      <button type="button" @click="onPresentUnstake" class="btn btn-sm stake-btn ml-2" v-else>
        <i class="bi bi-dash"></i>
      </button>
    </div>
  </div>
  <Button v-else type="button" class="btn btn-block mt-3 btn-primary cornered-btn" @click="onPresentStake"
    label="Stake" />
  <StakeDialog :stakingData="stakingData" :stakingTokenBalance="stakingTokenBalance" />
</template>
<script lang="ts">
import { Options, Vue, mixins } from "vue-class-component";
import { SerializedStaking } from "@/config/constants/types";
import { BigNumber } from "bignumber.js";
import StakeDialog from "../StakeDialog.vue";
import { getBalanceNumber } from "@/utils/formatBalance";
import CommonMixin from "@/helpers/mixins/CommonMixin";
import useUnStaking from "@/helpers/staking/useUnStaking";
import useCatchTxError from "@/helpers/useCatchTxError";
import { TxResponse } from "@/helpers/useCatchTxError";
import { updateUserBalance, updateUserStakedBalance, updateUserStakingDetails } from "@/helpers/staking";

class Props {
  stakingData: SerializedStaking;
  stakingTokenBalance: BigNumber;
  stakedBalance: BigNumber;
  isStaked: ConstrainBoolean;
  isLoading?: boolean;
}

@Options({
  watch: {},
  components: { StakeDialog },
})
export default class StakeActions extends mixins(Vue.with(Props), CommonMixin) {
  needsApproval: boolean = true;
  pendingTx: boolean = false;

  stakedTokenBalance: number = null;

  async onPresentUnstake() {
    const { onUnstake } = useUnStaking(this.stakingData.lid);
    let tx: TxResponse = null;

    try {
      this.pendingTx = true;
        tx = await onUnstake();
      const receipt = await tx.wait();
      if (receipt?.status) {
        this.$store.commit("useToast", {
            severity: "success",
            summary: "Unstaked",
            detail: `Your LUNA earnings have also been harvested to your wallet!`,
          });

        const address = this.$store.state.web3.user.address;
        updateUserStakedBalance(address, this.stakingData.lid);
        updateUserBalance(address, this.stakingData.lid);
        updateUserStakingDetails(address, this.stakingData.lid);
      }
      this.$store.commit("useTxToast", { txHash: tx.hash });
    } catch (err) {
      console.log(err);
      useCatchTxError(err, tx);
    } finally {
      this.pendingTx = false;
    }
  }

  getFormattedBalanceNumber(val: number, decimals = 2) {
    var formatter = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: decimals,
    });
    return formatter.format(val);
  }

  get allowUnstaking() {
    return new Date(Number(this.stakingData.userData.lockEndTimestamp) * 1000) < new Date()
  }

  onPresentStake() {
    // if (this.stakingTokenBalance.gt(0)) {
      this.emitter.emit("shouldDisplayStakeDialog" + this.stakingData.lid, true, false);
    // }
  }

  mounted() {
    this.stakedTokenBalance = getBalanceNumber(this.stakedBalance, 18);
  }
}
</script>
<style lang="scss">
.stake-btn {
  min-width: 20px;
  width: initial;
  border: solid 1px #8975d4;
  color: #9982ed;
  background: transparent;
  padding: 7px 12px;

  i {
    font-size: 25px;
    cursor: pointer;
  }
}

.thXu {
  color: #606d66;
  font-size: 12px;
}

.k-valueOne {
  color: #606d66;
  font-weight: 500;
  font-size: 14px;
  line-height: 16.4px;
}

.k-valueTwo {
  color: #9982ed;
  font-weight: 400;
  font-size: 10px;
  line-height: 12.4px;
}
</style>