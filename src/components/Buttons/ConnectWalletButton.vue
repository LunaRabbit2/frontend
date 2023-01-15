<script lang="ts">
import Web3Mixins from "../../helpers/mixins/web3Mixin";
export default class ConnectWalletButton extends Web3Mixins { }
</script>

<template>
  <div class="btn contract__btn" v-if="!isWalletConnected" @click="connectWallet()">
    <span class="label">Connect Wallet</span>
  </div>
</template>
<style lang="scss" scoped>
// .btn {
//   display: block;
//   cursor: pointer;
//   padding-bottom: 0.6rem !important;
//   padding-top: 0.6rem !important;
//   border: 0;
//   transition: all ease 0.3s;
//   -webkit-transition: all ease 0.3s;
//   -moz-transition: all ease 0.3s;
//   -o-transition: all ease 0.3s;
//   background: #9982ed;
//   color: #fff;

//   &:hover {
//     background-color: darken(#9982ed, 2%) !important;
//   }
// }
</style>