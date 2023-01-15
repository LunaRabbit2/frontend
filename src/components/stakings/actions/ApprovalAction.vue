<template>
  <template v-if="!isLoading">
    <Button
      v-if="pendingTx"
      :loading="pendingTx"
      type="button"
      class="btn btn-block mt-3 btn-primary cornered-btn"
      label="Enabling..."
    />
    <Button
      v-else
      type="button"
      @click="handleApprove"
      class="btn btn-block mt-3 btn-primary cornered-btn"
      :class="{
        'no-click': pendingTx,
      }"
      label="Enable Staking"
    />
  </template>
</template>
<script lang="ts">
import { Options, Vue, mixins } from "vue-class-component";
import { SerializedStaking } from "@/config/constants/types";
import { useERC20 } from "@/helpers/useContract";
import useCatchTxError, { TxResponse } from "@/helpers/useCatchTxError";
import { getLunarTokenAddress } from "@/utils/addressHelpers";
import { useApproveStaking } from "@/helpers/staking/useApprove";
import { updateUserStakingAllowance } from "@/helpers/staking";
import CommonMixin from "@/helpers/mixins/CommonMixin";

class Props {
  stakingData: SerializedStaking;
  isLoading: boolean;
}

@Options({
  watch: {},
  components: {},
})
export default class ApprovalActions extends mixins(Vue.with(Props), CommonMixin) {
  pendingTx: boolean = false;

  mounted() {}

  async handleApprove() {
    const lunarContract = useERC20(getLunarTokenAddress() || "");
    const { handleApprove } = useApproveStaking(lunarContract);
    const { address } = this.user;

    let tx: TxResponse = null;
    try {
      this.pendingTx = true;
      tx = await handleApprove();
      this.$store.commit("useToast", {
          severity: "success",
          summary: "Transaction Submitted",
          detail: `Transaction Submitted`,
        });
      const receipt = await tx.wait();
      if (receipt?.status) {
        this.$store.commit("useToast", {
          severity: "success",
          summary: "Contract Enabled!",
          detail: `You can now stake your LUNA!`,
        });
        updateUserStakingAllowance(address, this.stakingData.lid);
      }
      this.$store.commit("useTxToast", { txHash: tx.hash });
    } catch (err) {
      useCatchTxError(err, tx);
    } finally {
      this.pendingTx = false;
    }
  }
}
</script>
<style lang="scss" scoped>
.cornered-btn {
  border-radius: 0.75rem !important;
}
.btn-primary {
  background: #D6D613 !important;

  &:hover {
    background: #c5c510;
  }
}
.no-click {
  cursor: not-allowed;
  filter: grayscale(0.8);
}
</style>