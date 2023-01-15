<script lang="ts">
import HeadingOne from "@/components/HeadingOne.vue";
import StakingCard from "@/components/stakings/StakingCard.vue";
import { SerializedStaking } from "@/config/constants/types";
import CommonMixin from "@/helpers/mixins/CommonMixin";
import { useStaking, useStakingPageFetch } from "@/helpers/staking";
import { watchEffect } from "vue";
import { Options } from "vue-class-component";

@Options({
  components: {
    StakingCard,
    HeadingOne,
  },
})
export default class Staking extends CommonMixin {
  stakings: SerializedStaking[] = [];
  userDataLoaded: boolean = false;

  mounted(){
    useStakingPageFetch();
    watchEffect(() => {
      const { data: stakingData, userDataLoaded } = useStaking();
      this.stakings = stakingData;
      this.userDataLoaded = userDataLoaded;
    });
  }
}
</script>
<template>
  <HeadingOne />
  <main class="page">
    <section id="welcome_cryptonic_06" class="mt-wilds">
      <div class="container">
        <div class="row justify-content-center">
          <StakingCard v-if="stakings.length > 0" v-for="stakingData in stakings" :stakingData="stakingData" />
        </div>
      </div>
      <span class="bubble1 header-shape"><img src="images/particals_icon/fixed1.png" alt=""></span>
      <span class="bubble2 header-shape"><img src="images/particals_icon/fixed1.png" alt=""></span>
      <div id="particles2-js" class="particles"></div>
    </section>
  </main>
</template>

<style>
</style>
