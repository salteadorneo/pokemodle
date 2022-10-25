<template>
  <div class="locale-changer">
    <select v-model="$i18n.locale">
      <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang">
        {{ lang }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.locale-changer {
  position: absolute;
  top: 0;
  right: 0;
}
</style>

<script>
export default {
  name: 'locale-changer',
  data () {
    return { langs: ['es', 'en'] }
  }
}
</script>