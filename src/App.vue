<template>
  <div id="app">
    <HelpModal />

    <Languages v-if="false" />
    <PokedexModal :pokedex="pokedex" :win="win" :pokemon="pokemon" />

    <img src="./assets/logo.png" alt="Pokemodle" class="logo" />

    <div class="scene" v-if="pokemon.id">
      <img
        :src="
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' +
          pokemon.id +
          '.png'
        "
        alt=""
        :class="{
          pokemon: true,
          active: win,
          disappear: !intents && !pokemon.active,
        }"
        fetchPriority="high"
        draggable="false"
      />
    </div>

    <div v-if="intents && !pokemon.active">
      <div>
        <input
          v-model="input"
          :placeholder="$t('question')"
          class="textInput"
          :class="{ 'error-shake': errorShake }"
          readonly
        />
        <div
          v-if="
            input &&
            input.length >= 2 &&
            pokedex.filter(
              (p) => p.name.toLowerCase().indexOf(input.toLowerCase()) == 0
            ).length > 0
          "
          class="autocomplete"
        >
          <ul>
            <li
              v-for="(pokemon, index) in pokedex.filter(
                (p) => p.name.toLowerCase().indexOf(input.toLowerCase()) == 0
              )"
              v-bind:key="index"
              @click.prevent="setAndValidate(pokemon)"
            >
              {{ pokemon.name }}
            </li>
          </ul>
        </div>
      </div>

      <section class="pokeballs">
        <p>{{ $t("attempts") }}</p>
        <div class="intents">
          <img
            v-for="item in intents"
            v-bind:key="item + 1000"
            src="./assets/pokeball.png"
            alt=""
            class="pokeball"
          />
          <img
            v-for="item in 5 - intents"
            v-bind:key="item + 2000"
            src="./assets/pokeball.png"
            alt=""
            class="pokeball disabled"
          />
        </div>
      </section>
    </div>

    <ResultModal :pokemon="pokemon" :win="win" :intents="intents" />

    <FixKeyboard @setKey="(v) => setKey(v)" v-if="!win && intents" />

    <BuyMeACoffee />
  </div>
</template>

<script>
import splitbee from "@splitbee/web";

import moment from "moment";

import HelpModal from "./components/HelpModal.vue";
import Languages from "./components/Languages.vue";
import PokedexModal from "./components/PokedexModal.vue";
import ResultModal from "./components/ResultModal.vue";
import FixKeyboard from "./components/FixKeyboard.vue";
import BuyMeACoffee from "./components/BuyMeACoffee.vue";

import confetti from "canvas-confetti";

export default {
  name: "App",
  data() {
    return {
      pokedex: localStorage.pokedex ? JSON.parse(localStorage.pokedex) : [],
      pokemon: {},
      intents: localStorage.intents ? parseInt(localStorage.intents) : 5,
      win: false,
      input: "",
      errorShake: false,
      shareText: "",
    };
  },
  computed: {},
  components: {
    HelpModal,
    Languages,
    PokedexModal,
    ResultModal,
    FixKeyboard,
    BuyMeACoffee,
  },
  mounted() {
    if (!localStorage.pokedex) {
      fetch("https://pokeapi.co/api/v2/pokemon?limit=151&offset=0")
        .then((response) => response.json())
        .then((data) => {
          this.pokedex = data.results;

          localStorage.pokedex = JSON.stringify(data.results);

          this.randomPokemon();
        });
    } else this.randomPokemon();

    document.body.addEventListener("keyup", this.keyup);
  },
  methods: {
    setAndValidate(v) {
      this.input = v.name;
      this.checkPokemon();
    },
    setKey(v) {
      if (v === "enter") {
        this.checkPokemon();
      } else if (v === "return") {
        this.input = this.input.slice(0, -1);
      } else {
        this.input += v;
      }
    },
    keyup(e) {
      if (!e.key) return;
      if (e.key === "Enter") {
        this.checkPokemon();
      } else if (e.key === "Backspace") {
        this.input = this.input.slice(0, -1);
      } else if (e.key.match(/^[a-zA-Z-]$/g)) {
        this.input += e.key;
      }
    },
    randomPokemon() {
      this.win = false;
      this.intents = localStorage.intents ? parseInt(localStorage.intents) : 5;
      this.today = moment();

      if (localStorage.pokemon) this.pokemon = JSON.parse(localStorage.pokemon);
      if (
        this.pokemon &&
        this.pokemon.date &&
        moment(this.pokemon.date).isSame(this.today, "day")
      )
        this.win = this.pokemon.active;
      else localStorage.removeItem("pokemon");

      if (!localStorage.pokemon) {
        let noActives = this.pokedex.filter((i) => !i.active);

        this.pokemon = noActives[Math.floor(Math.random() * noActives.length)];
        this.pokemon.id = this.pokemon.url.split("/")[6];
        this.pokemon.date = moment();

        this.intents = 5;
        localStorage.intents = this.intents;

        localStorage.pokemon = JSON.stringify(this.pokemon);
      }

      if (location.href.includes("localhost")) console.log(this.pokemon.name);

      splitbee.track("Pokedex", {
        pokedex: this.pokedex.filter((p) => p.active).length,
      });
    },
    checkPokemon() {
      if (!this.intents || !this.input) return;
      if (!this.pokedex.some((i) => i.name == this.input)) {
        const self = this;
        self.errorShake = true;

        setTimeout(() => {
          self.errorShake = false;
        }, 200);
        return;
      }
      if (
        this.input.toLowerCase().trim() ==
        this.pokemon.name.toLowerCase().trim()
      ) {
        this.pokemon.active = true;
        this.win = this.pokemon.active;

        try {
          window.navigator.vibrate(500);
          confetti();
        } catch (e) {
          console.log(e);
        }

        let pokemon = this.pokedex.find((i) => i.name == this.pokemon.name);
        if (pokemon) pokemon.active = true;

        localStorage.pokemon = JSON.stringify(this.pokemon);
        localStorage.pokedex = JSON.stringify(this.pokedex);

        this.randomPokemon();

        splitbee.track("Catch", {
          pokemon: this.pokemon.name,
        });
      } else {
        this.intents--;

        try {
          window.navigator.vibrate(200);
        } catch (e) {
          console.log(e);
        }

        if (!this.intents) {
          splitbee.track("Flee", {
            pokemon: this.pokemon.name,
          });
        }
      }
      localStorage.intents = this.intents;
      this.input = "";
    },
  },
};
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

* {
  box-sizing: border-box;
  user-select: none;
}

body {
  font-family: "Lato", sans-serif;
  padding: 20px 0 0;
  margin: 0;
  background: #f5f5f5;
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
}

.logo:hover {
  transform: scale(1.05);
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
  background: none;
  border: 0;
  font-size: 18px;
  line-height: 20px;
  text-align: center;
}

.pokeballs {
  font-size: 12px;
  text-align: center;
  color: #888;
  margin: 15px auto 0;
}

.pokeballs > .intents {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pokeball {
  width: 40px;
  position: relative;
  transition: all 1s;
  opacity: 0;
  animation: top 2s ease-out forwards;
}

.pokeball:nth-of-type(1) {
  transform: translateY(10px);
}

.pokeball:nth-of-type(2) {
  transform: translateY(20px);
}

.pokeball:nth-of-type(3) {
  transform: translateY(30px);
}

.pokeball:nth-of-type(4) {
  transform: translateY(40px);
}

.pokeball:nth-of-type(5) {
  transform: translateY(50px);
}

.pokeball.disabled {
  transform: none;
  animation: none;
  opacity: 0.3 !important;
}

@keyframes top {
  100% {
    transform: translateY(0);
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
