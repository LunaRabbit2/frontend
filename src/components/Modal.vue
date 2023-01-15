<template>
  <transition name="fade">
    <div
      class="s-lightbox"
      :style="sLightbox(lightboxOffset, show)"
      ref="lightboxRef"
      v-show="show"
    >
      <div class="s-modal-container" :style="sModalContainer(show)">
        <div class="s-hit-box" @click="onClose"></div>
        <div class="s-modal-card" :style="sModalCard(show)">
          <div class="d-flex flex-column justify-content-center s-card-header">
            <span>Connect Wallet</span>
            <img
              src="/images/icons/close.png"
              @click="onClose"
              class="s-alt-hitbox"
              alt="close dialog"
            />
          </div>
          <div class="s-card-body mt-4">
            <template v-for="(provider, index) in userOptions">
              <Provider
                v-if="provider"
                :key="index"
                :name="provider.name"
                :logo="provider.logo"
                @onClick="provider.onClick"
              />
            </template>
          </div>
          <div class="d-flex justify-content-center align-items-center flex-column mt-4 mb-3">
            <span
              href="https://crypto.com"
              class="text-dark text-center"
              >Haven't got a crypto wallet yet?</span
            >
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Provider from "./Provider.vue";
export default {
  name: "Modal",
  props: ["show", "userOptions"],
  components: { Provider },
  data() {
    return {
      lightboxOffset: 0,
    };
  },
  mounted() {
    window.updateWeb3Modal = this;
  },
  updated() {
    if (this.$refs.lightboxRef) {
      const lightboxRect = this.$refs.lightboxRef;
      const lightboxOffset = lightboxRect.top > 0 ? lightboxRect.top : 0;
      if (
        lightboxOffset !== this.lightboxOffset &&
        lightboxOffset !== this.state.lightboxOffset
      ) {
        this.lightboxOffset = lightboxOffset;
      }
    }
  },
  methods: {
    sLightbox(offset, show) {
      return {
        top: offset ? `-${offset}px` : 0,
        "pointer-events": show ? "auto" : "none",
      };
    },
    sModalCard(show) {
      return {
        "pointer-events": show ? "auto" : "none",
      };
    },
    sModalContainer(show) {
      return { "pointer-events": show ? "auto" : "none" };
    },
    onClose() {
      this.$emit("onClose");
    },
  },
};
</script>
<style lang="scss" scoped>
.s-lightbox {
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  width: 100vw;
  height: 100vh;
  margin-left: -50vw;
  left: 50%;
  z-index: 8;
  will-change: opacity;
  display: flex;
  justify-content: center;
  align-items: center;
  & * {
    box-sizing: border-box !important;
  }
}
.s-hit-box {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.s-alt-hitbox {
  position: absolute;
  top: 25px;
  right: 30px;
  width: 16px;
  height: 16px;
  cursor: pointer;
}
.s-modal-card {
  background-color: #fff;
  position: relative;
  width: 420px;
  max-width: 100%;
  border-radius: 12px;
  margin: 10px;
  padding: 0;
  max-height: 100%;
  .s-card-header {
    background: linear-gradient(87.84deg, #f1fff7 -18.45%, #fbfbff 72.37%);
    font-family: "Public Sans", sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    min-height: 78px;
    padding: 15px 35px;
    border-top-right-radius: inherit;
    border-top-left-radius: inherit;
  }
  .s-card-body {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(50%, 1fr));
    min-width: fit-content;
    width: 100%;
  }
}
.s-modal-container {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>