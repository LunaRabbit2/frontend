<template>
  <Button type="button" class="btn btn-block mt-3 btn-primary cornered-btn" @click="onPresentCollect" :class="{
    'no-click': !hasEarnings,
  }" label="Harvest" />
  <Dialog :class="'mx-w'" header="LUNA Harvest" v-model:visible="displayDialog" contentClass="d-flex flex-column" dismissableMask modal>
    <div class="d-flex justify-content-between align-items-center mt-5 mb-5">
      <div>Harvesting:</div>
      <div class="">
        <h3>{{ formattedBalance }} LUNA</h3>
      </div>
    </div>
    <template #footer>
      <Button v-if="pendingTx" :loading="pendingTx" type="button"
        class="btn btn-block mt-3 btn-primary cornered-btn w-100" label="Confirming..." />
      <Button v-else type="button" @click="handleHarvestConfirm"
        class="btn btn-block mt-3 btn-primary cornered-btn w-100" :class="{
          'no-click': pendingTx,
        }" label="Confirm" />
    </template>
  </Dialog>
</template>
<script lang="ts">
import { Vue, mixins, Options } from "vue-class-component";
import BigNumber from "bignumber.js";
import { Token } from "@pancakeswap/sdk";
import {
  formatNumber,
  getBalanceNumber,
  getFullDisplayBalance,
} from "@/utils/formatBalance";
import useCatchTxError, { TxResponse } from "@/helpers/useCatchTxError";
import { watchEffect } from "vue";
import { SerializedStaking } from "@/config/constants/types";
import { updateUserBalance, updateUserStakedBalance, updateUserStakingDetails } from "@/helpers/staking";
import useHarvestStakings from "@/helpers/staking/useHarvestStakings";
import CommonMixin from "@/helpers/mixins/CommonMixin";

class Props {
  stakingData: SerializedStaking;
  isLoading?: boolean;
}

@Options({
  components: {},
  watch: {},
})
export default class HarvestAction extends mixins(Vue.with(Props), CommonMixin) {
  hasEarnings = false;
  displayDialog = false;
  pendingTx: boolean = false;

  formattedBalance = "0";

  onPresentCollect() {
    if (this.hasEarnings) {
      this.displayDialog = true;
    }
  }

  formatNumber(number: number, minPrecision = 2, maxPrecision = 2) {
    return formatNumber(number, minPrecision, maxPrecision);
  }

  async handleHarvestConfirm() {
    if (this.pendingTx) return;

    const { onReward } = useHarvestStakings(this.stakingData.lid);

    let tx: TxResponse = null;
    try {
      this.pendingTx = true;
      tx = await onReward();

      const receipt = await tx.wait();
      if (receipt?.status) {
        this.$store.state.toast.add({ severity: 'success', summary: 'Harvested', detail: `Your LUNA earnings have been sent to your wallet!`, life: 5000 });

        this.$store.commit('useTxToast', { txHash: tx.hash })

        const address = this.$store.state.web3.user.address;

        updateUserStakingDetails(address, this.stakingData.lid);
        updateUserStakedBalance(address, this.stakingData.lid);
        updateUserBalance(address, this.stakingData.lid);

        this.displayDialog = false;
      }
      this.$store.commit('useTxToast', { txHash: tx.hash })
    } catch (err) {
      useCatchTxError(err, tx);
    } finally {
      this.pendingTx = false;
    }
  }

  mounted() {
    watchEffect(() => {
      const earningTokenBalance = getBalanceNumber(
        new BigNumber(this.stakingData.userData.totalReward),
        18
      );
      this.formattedBalance = formatNumber(earningTokenBalance, 2, 8);

      this.hasEarnings = new BigNumber(this.stakingData.userData.totalReward).toNumber() > 0;
    });
  }
}
</script>
<style lang="scss" scoped>

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