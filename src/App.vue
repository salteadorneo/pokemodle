<template>
  <div id="app">
    <div class="grad"></div>

    <HelpModal />

    <Languages v-if="false" />
    <PokedexModal :pokedex="pokedex" :win="win" :pokemon="pokemon" />

    <img src="./assets/logo.png" alt="Pokemodle" class="logo" />

    <div class="scene" v-if="pokemon.id">
      <img :src="'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' +
        pokemon.id +
        '.png'
        " alt="" :class="{
    pokemon: true,
    active: win,
    disappear: !intents && !pokemon.active,
  }" fetchPriority="high" draggable="false" />
    </div>

    <div v-if="intents && !pokemon.active">
      <div>
        <input v-if="input" v-model="input" :placeholder="$t('question')" class="textInput"
          :class="{ 'error-shake': errorShake }" readonly />
        <p v-else class="textInput">{{ $t('question') }}</p>

        <div v-if="input &&
          input.length >= 2 &&
          pokedex.filter(
            (p) => p.name.toLowerCase().indexOf(input.toLowerCase()) == 0
          ).length > 0
          " class="autocomplete">
          <ul>
            <li v-for="(pokemon, index) in pokedex.filter(
              (p) => p.name.toLowerCase().indexOf(input.toLowerCase()) == 0
            )" v-bind:key="index" @click.prevent="setAndValidate(pokemon)">
              {{ pokemon.name }}
            </li>
          </ul>
        </div>
      </div>

      <section class="pokeballs">
        <p>{{ $t("attempts") }} = {{ intents }}</p>
        <div class="intents">
          <img v-for="item in intents" v-bind:key="item + 1000" src="./assets/pokeball.png" alt="" class="pokeball" />
          <img v-for="item in 5 - intents" v-bind:key="item + 2000" src="./assets/pokeball.png" alt=""
            class="pokeball disabled" />
        </div>
      </section>
    </div>

    <ResultModal :pokemon="pokemon" :win="win" :intents="intents" />

    <FixKeyboard @setKey="(v) => setKey(v)" v-if="!win && intents" />

    <BuyMeACoffee />
  </div>
</template>

<script>
import splitbee from '@splitbee/web'

import HelpModal from './components/HelpModal.vue'
import Languages from './components/Languages.vue'
import PokedexModal from './components/PokedexModal.vue'
import ResultModal from './components/ResultModal.vue'
import FixKeyboard from './components/FixKeyboard.vue'
import BuyMeACoffee from './components/BuyMeACoffee.vue'

import { getKey, setKey, removeKey } from './services/storage'

import confetti from 'canvas-confetti'

export default {
  name: 'App',
  data() {
    return {
      pokedex: [],
      pokemon: {},
      intents: 5,
      win: false,
      input: '',
      errorShake: false,
      shareText: ''
    }
  },
  computed: {},
  components: {
    HelpModal,
    Languages,
    PokedexModal,
    ResultModal,
    FixKeyboard,
    BuyMeACoffee
  },
  async mounted() {
    this.pokedex = getKey('pokedex') ?? []
    this.intents = getKey('intents') ?? 5

    if (this.pokedex.length === 0) {
      const { results: pokedex } = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0').then((res) => res.json())

      this.pokedex = pokedex

      setKey('pokedex', pokedex)
    }

    this.randomPokemon()

    document.body.addEventListener('keyup', this.keyup)
  },
  methods: {
    setAndValidate(v) {
      this.input = v.name
      this.checkPokemon()
    },
    setKey(v) {
      if (v === 'enter') {
        this.checkPokemon()
      } else if (v === 'return') {
        this.input = this.input.slice(0, -1)
      } else {
        this.input += v
      }
    },
    keyup(e) {
      if (!e.key) return
      if (e.key === 'Enter') {
        this.checkPokemon()
      } else if (e.key === 'Backspace') {
        this.input = this.input.slice(0, -1)
      } else if (e.key.match(/^[a-zA-Z-]$/g)) {
        this.input += e.key
      }
    },
    randomPokemon() {
      this.win = false
      this.intents = getKey('intents') ?? 5
      this.pokemon = getKey('pokemon') ?? {}

      const todayDate = new Date()
      // todayDate.setDate(todayDate.getDate() - 7);
      const todayDateString = todayDate.toLocaleDateString()

      if (this.pokemon.id && this.pokemon.date && new Date(this.pokemon.date).toLocaleDateString() === todayDateString) {
        this.win = this.pokemon.active
      } else {
        removeKey('pokemon')
        this.pokemon = {}
      }

      if (!this.pokemon.id) {
        const noActives = this.pokedex.filter((i) => !i.active)

        this.pokemon = noActives[Math.floor(Math.random() * noActives.length)]
        this.pokemon.id = this.pokemon.url.split('/')[6]
        this.pokemon.date = todayDate

        this.intents = 5
        setKey('intents', this.intents)
        setKey('pokemon', this.pokemon)
      }

      if (location.href.includes('localhost')) {
        console.log(this.pokemon.name)
      }

      splitbee.track('Pokedex', {
        pokedex: this.pokedex.filter((p) => p.active).length
      })
    },
    checkPokemon() {
      if (!this.intents || !this.input) return
      if (!this.pokedex.some((i) => i.name === this.input)) {
        const self = this
        self.errorShake = true

        setTimeout(() => {
          self.errorShake = false
        }, 200)
        return
      }
      if (
        this.input.toLowerCase().trim() ===
        this.pokemon.name.toLowerCase().trim()
      ) {
        this.pokemon.active = true
        this.win = this.pokemon.active

        try {
          window.navigator.vibrate(500)
          confetti()
        } catch (e) {
          console.log(e)
        }

        const pokemon = this.pokedex.find((i) => i.name === this.pokemon.name)
        if (pokemon) pokemon.active = true

        setKey('pokemon', this.pokemon)
        setKey('pokedex', this.pokedex)

        this.randomPokemon()

        splitbee.track('Catch', {
          pokemon: this.pokemon.name
        })
      } else {
        this.intents--

        try {
          window.navigator.vibrate(200)
        } catch (e) {
          console.log(e)
        }

        if (!this.intents) {
          splitbee.track('Flee', {
            pokemon: this.pokemon.name
          })
        }
      }
      setKey('intents', this.intents)
      this.input = ''
    }
  }
}
</script>

<style>
@font-face {
  font-family: "Lato";
  src: url("./fonts/Lato-Bold.woff2") format("woff2"),
    url("./fonts/Lato-Bold.woff") format("woff");
  font-weight: bold;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Lato";
  src: url("./fonts/Lato-Light.woff2") format("woff2"),
    url("./fonts/Lato-Light.woff") format("woff");
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Lato";
  src: url("./fonts/Lato-Regular.woff2") format("woff2"),
    url("./fonts/Lato-Regular.woff") format("woff");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

:root {
  --primary: #ED1E24;
  --secondary: #aa181d;
}

* {
  box-sizing: border-box;
  user-select: none;
}

body {
  font-family: "Lato", sans-serif;
  padding: 20px 0 0;
  margin: 0;
  color: white;
  overflow-x: hidden;
}

::-webkit-scrollbar {
  width: 0;
}

a {
  color: white;
}

#app {
  width: 530px;
  max-width: 100%;
  margin: 0 auto;
}

.logo {
  display: block;
  max-width: 80%;
  max-height: 120px;
  margin: 0 auto;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
  transition: all 0.3s;
}

.logo:hover {
  transform: scale(1.05);
}

.grad {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100dvw;
  height: 100dvh;
}

.grad:after,
.grad:before {
  content: '';
  position: absolute;
  background: linear-gradient(90deg, transparent 50%, var(--primary) 50%, var(--primary)), linear-gradient(82deg, transparent 50%, var(--secondary) 50%, var(--secondary)), linear-gradient(67deg, transparent 50%, var(--primary) 50%, var(--primary)), linear-gradient(52deg, transparent 50%, var(--secondary) 50%, var(--secondary)), linear-gradient(37deg, transparent 50%, var(--primary) 50%, var(--primary)), linear-gradient(22deg, transparent 50%, var(--secondary) 50%, var(--secondary)), linear-gradient(7deg, transparent 50%, var(--primary) 50%, var(--primary)), linear-gradient(-8deg, transparent 50%, var(--secondary) 50%, var(--secondary)), linear-gradient(-23deg, transparent 50%, var(--primary) 50%, var(--primary)), linear-gradient(-38deg, transparent 50%, var(--secondary) 50%, var(--secondary)), linear-gradient(-53deg, transparent 50%, var(--primary) 50%, var(--primary)), linear-gradient(-68deg, transparent 50%, var(--secondary) 50%, var(--secondary)), linear-gradient(-83deg, transparent 50%, var(--primary) 50%, var(--primary)), linear-gradient(-90deg, transparent 50%, var(--secondary) 50%, var(--secondary));
  background-position: 0% 0%;
  background-size: 200% 100%;
  height: 100%;
  width: 50%;
}

.grad:before {
  left: 50%;
  transform: rotate(180deg);
}

.scene {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  text-align: center;
}

.scene .pokemon {
  position: relative;
  max-width: 65%;
  max-height: 40vh;
  filter: brightness(0);
  transition: all 1s;
  pointer-events: none;
  aspect-ratio: 1;
}

.scene .pokemon.active {
  filter: none;
}

.scene .pokemon.disappear {
  opacity: 0;
}

@media (max-height: 667px) {
  .scene .pokemon {
    max-height: 30vh;
  }
}

.textInput {
  display: block;
  width: 250px;
  margin: 0 auto;
  padding: 12px;
  outline: none;
  appearance: none;
  color: white;
  background: none;
  border: 0;
  font-size: 18px;
  line-height: 20px;
  text-align: center;
}

.pokeballs {
  font-size: 14px;
  text-align: center;
  margin: 15px auto 0;
}

.pokeballs>.intents {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pokeball {
  width: 35px;
  animation: fadeIn 1s ease both;
}

.pokeball.disabled {
  opacity: 0.4 !important;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.autocomplete {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.99);
  width: 250px;
  margin: 0 auto;
  z-index: 10;
  overflow: hidden;
}

.autocomplete ul {
  display: block;
  list-style: none;
  padding: 2px 0;
  margin: 0;
  max-height: calc(30px * 4);
}

.autocomplete ul li {
  font-size: 14px;
  color: black;
  padding: 6px 12px;
  border: none;
  appearance: none;
  width: 100%;
  border-radius: none;
}

button {
  border: 0;
  appearance: none;
}

.error-shake {
  animation: error_shake 0.4s 1 linear;
}

@keyframes error_shake {
  0% {
    -webkit-transform: translate(30px);
  }

  20% {
    -webkit-transform: translate(-30px);
  }

  40% {
    -webkit-transform: translate(15px);
  }

  60% {
    -webkit-transform: translate(-15px);
  }

  80% {
    -webkit-transform: translate(8px);
  }

  100% {
    -webkit-transform: translate(0px);
  }
}
</style>
