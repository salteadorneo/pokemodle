import Vue from "vue";
import VueI18n from "vue-i18n";

import App from "./App.vue";

Vue.use(VueI18n);

const messages = {
  es: {
    help: {
      title: "Cómo jugar",
    },
  },
  en: {
    help: {
      title: "How to play",
    },
  },
};

const i18n = new VueI18n({
  locale: "es",
  messages,
});

Vue.config.productionTip = false;

import VueGtag from "vue-gtag";
Vue.use(VueGtag, {
  config: {
    id: "G-H270X6V7RL",
    params: {
      send_page_view: false,
    },
  },
});

Vue.use(require("vue-moment"));

new Vue({
  i18n,
  render: (h) => h(App),
}).$mount("#app");
