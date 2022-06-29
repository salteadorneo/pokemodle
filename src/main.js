import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import VueGtag from "vue-gtag";
Vue.use(VueGtag, {
  config: { 
    id: "G-H270X6V7RL",
    params: {
      send_page_view: false
    }
  }
});

Vue.use(require('vue-moment'));

new Vue({
  render: h => h(App),
}).$mount('#app')
