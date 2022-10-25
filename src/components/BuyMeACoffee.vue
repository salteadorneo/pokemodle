<template>
  <div class="buymeacoffee">
    <a href="https://www.buymeacoffee.com/salteadorneo" target="_blank"
      ><img
        src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
        alt="Buy Me A Coffee"
        style="height: 50px !important; width: 178px !important"
    /></a>
  </div>
</template>

<style scoped>
.buymeacoffee {
  position: fixed;
  bottom: 5px;
  right: 5px;
  z-index: 999;
}
@media (max-width: 950px) {
  .buymeacoffee {
    display: none;
  }
}
</style>
