<template>
  <div class="s-provider-wrapper" @click="onClick">
    <div class="s-provider-container">
      <div class="si-icon">
        <img :src="logo" :alt="name" />
      </div>
      <div class="si-name">
        {{ name }}
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.si-icon {
  width: 60px;
  height: 60px;
  display: flex;
  overflow: visible;
  box-shadow: none;
  justify-content: center;
  align-items: center;

  & img {
    width: 100%;
    height: 100%;
  }
}
@media screen and (max-width: 448px) {
  .si-icon {
    width: 45px;
    height: 45px;
  }
}
.si-name {
  font-family: "Public Sans", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #1f2924;
  text-align: center;
  margin-top: 10px;
}
.s-provider-container {
  transition: background-color 0.2s ease-in-out;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  padding: 24px 16px;
}
@media screen and (max-width: 768px) {
  .s-provider-container {
    padding: 1vw;
  }
}
.s-provider-wrapper {
  width: 100%;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  border-radius: 0;
  * {
    cursor: pointer;
  }
}
</style>
<script>
export default {
  name: "Provider",
  props: ["name", "logo"],
  methods: {
    onClick() {
      this.$emit("onClick");
    },
  },
};
</script>