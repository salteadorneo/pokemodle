<template>
  <div :class="style">
    <a href="https://www.buymeacoffee.com/salteadorneo" target="_blank"
      ><img
        src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
        alt="Buy Me A Coffee"
        style="height: 50px !important; width: 178px !important"
    /></a>
  </div>
</template>

<script>
export default {
  name: "BuyMeACoffee",
  props: {
    center: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    style() {
      return "buymeacoffee" + (this.center ? " center" : "");
    },
  },
};
</script>

<style scoped>
.buymeacoffee {
  position: fixed;
  bottom: 5px;
  left: 5px;
  z-index: 1;
  opacity: 0;
  animation: fadeIn 1s ease-in-out forwards;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.center {
  display: block !important;
  left: 50%;
  transform: translateX(-50%);
}
@media (max-width: 950px) {
  .buymeacoffee {
    display: none;
  }
}
</style>
