import Vue from "vue";
import VueI18n from "vue-i18n";

import splitbee from "@splitbee/web";
splitbee.init({ token: "QKJZNPQK9M2X", disableCookie: true });

import App from "./App.vue";

Vue.use(VueI18n);

const messages = {
  es: {
    help: {
      title: "Cómo jugar",
      description: "Adivina el Pokémon oculto y atrápalo. Tienes 5 intentos.",
      strong: "¡Un nuevo Pokémon cada día!",
      version: "Versión",
      legal:
        "Pokémon y los nombres de los personajes de Pokémon son marcas comerciales de Nintendo.",
    },
    question: "¿Qué Pokémon es?",
    attempts: "Intentos",
  },
  en: {
    help: {
      title: "How to play",
      description:
        "Guess the hidden Pokémon and catch it. You have 5 attempts.",
      strong: "A new Pokémon every day!",
      version: "Version",
      legal: "Pokémon and Pokémon character names are trademarks of Nintendo.",
    },
    question: "What Pokémon is it?",
    attempts: "Attempts",
  },
};

const i18n = new VueI18n({
  locale:
    navigator.language.split("-")[0] || navigator.userLanguage.split("-")[0],
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
