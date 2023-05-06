import Vue from 'vue'
import VueI18n from 'vue-i18n'

import splitbee from '@splitbee/web'

import App from './App.vue'
splitbee.init({ disableCookie: true })

Vue.use(VueI18n)

const messages = {
  es: {
    help: {
      title: 'Cómo jugar',
      description: 'Adivina el Pokémon oculto y atrápalo. Tienes 5 intentos.',
      strong: '¡Un nuevo Pokémon cada día!',
      version: 'Versión',
      legal:
        'Pokémon y los nombres de los personajes de Pokémon son marcas comerciales de Nintendo.'
    },
    question: '¿Qué Pokémon es?',
    attempts: 'Intentos',
    congratulations: '¡Enhorabuena!',
    catch: 'Has atrapado tu Pokémon diario.',
    flee: '¡Se ha escapado!',
    comeback: 'Vuelve mañana para encontrar otro.'
  },
  en: {
    help: {
      title: 'How to play',
      description:
        'Guess the hidden Pokémon and catch it. You have 5 attempts.',
      strong: 'A new Pokémon every day!',
      version: 'Version',
      legal: 'Pokémon and Pokémon character names are trademarks of Nintendo.'
    },
    question: 'What Pokémon is it?',
    attempts: 'Attempts',
    congratulations: 'Congratulations!',
    catch: 'You catched your daily Pokémon.',
    flee: 'It has escaped!',
    comeback: 'Come back tomorrow to find another.'
  }
}

const i18n = new VueI18n({
  locale:
    navigator.language.split('-')[0] || navigator.userLanguage.split('-')[0],
  messages
})

Vue.config.productionTip = false

new Vue({
  i18n,
  render: (h) => h(App)
}).$mount('#app')
