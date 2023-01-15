<template>
  <Dialog :header="
    isRemovingStake ? 'Unstake your LUNA' : 'Stake LUNA to earn more LUNA'
  " v-model:visible="displayDialog" contentClass="d-flex flex-column" dismissableMask modal>
    <div class="d-flex justify-content-between mb-2">
      <strong>{{ isRemovingStake ? "Unstake" : "Stake" }}: </strong>
      <div class="d-flex align-items-center">
        <img class="item sq-2 rounded-circle" src="/img/llogoo.png" alt="LUNA" />
        <span class="ml-2">LUNA</span>
      </div>
    </div>
    <div class="token-input mb-3">
      <div class="d-flex flex-column align-items-end mt-3">
        <InputNumber @input="handleStakeInputChange($event)" inputClass="border-0 p-0 text-right" mode="decimal"
          :minFractionDigits="2" :maxFractionDigits="18" :max="79" :modelValue="stakeAmount" />
      </div>
    </div>
    <div class="jfPlkw" v-if="userNotEnoughToken">
      Insufficient LUNA in your wallet
    </div>
    <div class="text-right">
      {{ `Bal: ${getFullDisplayBalance(getCalculatedStakingLimit(), 18)}` }}
    </div>

    <div class="d-flex justify-content-between mt-5">
      <button class="btn btn-sm btn-default cornered-btn mx-2" @click="handleChangePercent(25)">
        25%
      </button>
      <button class="btn btn-sm btn-default cornered-btn mx-2" @click="handleChangePercent(50)">
        50%
      </button>
      <button class="btn btn-sm btn-default cornered-btn mx-2" @click="handleChangePercent(75)">
        75%
      </button>
      <button class="btn btn-sm btn-default cornered-btn mx-2" @click="handleChangePercent(100)">
        Max
      </button>
    </div>

    <div class="d-flex justify-content-between mt-3" v-if="!isRemovingStake">
      <span>APR at current rates:</span>
      <span v-if="annualRoi > 0">{{ formatNumber(annualRoi, 2, 4) }} LUNA</span>
      <span v-else>_</span>
    </div>
    <template #footer>
      <Button v-if="pendingTx" :loading="pendingTx" type="button"
        class="btn btn-block mt-3 btn-primary cornered-btn w-100" label="Confirming..." />
      <Button v-else type="button" @click="handleConfirmClick" class="btn btn-block mt-3 btn-primary cornered-btn w-100"
        :class="{
          'no-click':
            !stakeAmount || parseFloat(stakeAmount) === 0 || userNotEnoughToken,
        }" label="Confirm" />
    </template>
  </Dialog>
</template>
<script lang="ts">
import { Options, Vue, mixins } from "vue-class-component";
import { SerializedStaking } from "@/config/constants/types";
import { BigNumber } from "bignumber.js";
import {
  getDecimalAmount,
  getFullDisplayBalance,
  formatNumber,
} from "@/utils/formatBalance";
import { watchEffect } from "vue";
import useCatchTxError from "@/helpers/useCatchTxError";
import { TxResponse } from "@/helpers/useCatchTxError";
import useStaking from "@/helpers/staking/useStaking";
import { updateUserBalance, updateUserStakedBalance, updateUserStakingDetails } from "@/helpers/staking";
import useUnStaking from "@/helpers/staking/useUnStaking";
import CommonMixin from "@/helpers/mixins/CommonMixin";

class Props {
  stakingData: SerializedStaking;
  stakingTokenBalance: BigNumber;
}

@Options({
  watch: {},
  components: {},
})
export default class StakeDialog extends mixins(Vue.with(Props), CommonMixin) {
  displayDialog = false;
  userNotEnoughToken: boolean = false;
  pendingTx: boolean = false;
  isRemovingStake = false;

  minimumStakingBalance: BigNumber = new BigNumber(2000000000);

  fullDecimalStakeAmount: BigNumber = new BigNumber(0);
  BigNumber = BigNumber;

  percent = 0;

  stakeAmount = "";

  annualRoi = null;

  formatNumber(number: number, minPrecision = 2, maxPrecision = 2) {
    return formatNumber(number, minPrecision, maxPrecision);
  }

  getFullDisplayBalance(
    balance: BigNumber,
    decimals = 18,
    displayDecimals?: number
  ) {
    return getFullDisplayBalance(balance, decimals, displayDecimals);
  }

  getCalculatedStakingLimit() {
    if (this.isRemovingStake) {
      return new BigNumber(this.stakingData.userData.amountStaked);
    }
    return this.stakingTokenBalance;
  }

  handleStakeInputChange(e) {
    const input = e.value;
    if (input) {
      const convertedInput = getDecimalAmount(new BigNumber(input), 18);
      const percentage = Math.floor(
        convertedInput
          .dividedBy(this.getCalculatedStakingLimit())
          .multipliedBy(100)
          .toNumber()
      );
      this.percent = Math.min(percentage, 100);
    } else {
      this.percent = 0;
    }
    this.stakeAmount = input;
  }

  handleChangePercent(sliderPercent: number) {
    if (sliderPercent > 0) {
      const percentageOfStakingMax = this.getCalculatedStakingLimit()
        .dividedBy(100)
        .multipliedBy(sliderPercent);
      const amountToStake = getFullDisplayBalance(
        percentageOfStakingMax,
        18,
        18
      );
      this.stakeAmount = amountToStake;
    } else {
      this.stakeAmount = "0";
    }
    this.percent = sliderPercent;
  }

  async handleConfirmClick() {
    if (
      !this.stakeAmount ||
      parseFloat(this.stakeAmount) === 0 ||
      this.userNotEnoughToken
    )
      return;
    const { onStake } = useStaking(this.stakingData.lid);
    const { onUnstake } = useUnStaking(this.stakingData.lid);
    let tx: TxResponse = null;
    try {
      this.pendingTx = true;
      if (this.isRemovingStake) {
        // tx = await onUnstake(this.stakeAmount, 18);
      } else {
        tx = await onStake(this.stakeAmount, 18);
      }
      const receipt = await tx.wait();
      if (receipt?.status) {
        if (this.isRemovingStake) {
          this.$store.commit("useToast", {
            severity: "success",
            summary: "Unstaked",
            detail: `Your LUNA earnings have also been harvested to your wallet!`,
          });
        } else {
          this.$store.commit("useToast", {
            severity: "success",
            summary: "Staked",
            detail: `Your LUNA funds have been staked!`,
          });
        }
        const address = this.$store.state.web3.user.address;
        updateUserStakedBalance(address, this.stakingData.lid);
        updateUserBalance(address, this.stakingData.lid);
        updateUserStakingDetails(address, this.stakingData.lid);
        this.displayDialog = false;
      }
      this.$store.commit("useTxToast", { txHash: tx.hash });
    } catch (err) {
      console.log(err);
      useCatchTxError(err, tx);
    } finally {
      this.pendingTx = false;
    }
  }

  getAnnualRoi(amount) {
    const annualReward = (amount * Number(this.stakingData.apr.toString())) / 100;
    return annualReward;
  }

  mounted() {
    watchEffect(() => {
      this.fullDecimalStakeAmount = getDecimalAmount(
        new BigNumber(this.stakeAmount),
        18
      );
      this.userNotEnoughToken = this.isRemovingStake
        ? new BigNumber(this.stakingData.userData.amountStaked).lt(
            this.fullDecimalStakeAmount
          )
        : new BigNumber(this.stakingData.userData.balance).lt(
            this.fullDecimalStakeAmount
          );
      this.annualRoi =
        Number(this.stakeAmount) > 0
          ? this.getAnnualRoi(this.stakeAmount)
          : null;
    });

    this.emitter.off("shouldDisplayUnstakeDialog" + this.stakingData.lid);
    this.emitter.on("shouldDisplayUnstakeDialog" + this.stakingData.lid, (isOpen: boolean) => {
      this.displayDialog = isOpen;
      this.isRemovingStake = true;
    });

    this.emitter.off("shouldDisplayStakeDialog" + this.stakingData.lid);
    this.emitter.on("shouldDisplayStakeDialog" + this.stakingData.lid, (isOpen: boolean) => {
      this.displayDialog = isOpen;
      this.isRemovingStake = false;
    });
  }
}
</script>
<style lang="scss" scoped>
.token-input {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
}
.jfPlkw {
  color: #ed4b9e;
  font-weight: 400;
  line-height: 1.5;
  margin-top: 4px;
  font-size: 12px;
}
.btn-sm {
  min-width: 30px;
  padding: 4px 16px;
  flex-grow: 1;
}
.cornered-btn {
  border-radius: 0.75rem !important;
}
.btn-primary {
background: #9982ed !important;

  &:hover {
    background: #9982ed;
  }
}
.no-click {
  cursor: not-allowed;
  filter: grayscale(0.8);
}
</style>