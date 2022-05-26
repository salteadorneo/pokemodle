import Vue from 'vue'
import App from './App.vue'
import Autocomplete from '@trevoreyre/autocomplete-vue'
import '@trevoreyre/autocomplete-vue/dist/style.css'

Vue.use(Autocomplete)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
