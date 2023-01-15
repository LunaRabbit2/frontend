import { Vue } from "vue-class-component";

export default class Web3Mixins extends Vue {

  get web3() {
    return this.$store.state.web3;
  }

  get isWalletConnected() {
    return this.web3.user.active;
  }

  get user() {
    return this.web3.user;
  }

  connectWallet() {
    this.$store.dispatch("connect");
  }
}