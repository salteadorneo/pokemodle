<template>
  <div id="app">
    <HelpModal />

    <Languages v-if="false" />

    <img src="./assets/logo.png" alt="Pokemodle" class="logo" />

    <div :class="{ pokedex: true, active: showPokedex }">
      <button @click="showPokedex = false" class="close">x</button>
      <div
        v-for="(pokemon, index) in pokedex"
        v-bind:key="index"
        :class="{ pokemon: true, active: pokemon.active }"
        :id="'pokemon' + getPokenumber(index + 1)"
      >
        <img
          loading="lazy"
          :srcset="
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' +
            (index + 1) +
            '.png'
          "
          alt=""
        />
        <h2>{{ getPokenumber(index + 1) }}<br />{{ pokemon.name }}</h2>
      </div>
    </div>

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

      <div class="pokeballs">
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

      <br />
      <button @click.prevent="setPokedex" class="btn centered">Pokédex</button>
    </div>

    <ResultModal
      v-if="!showPokedex"
      :pokemon="pokemon"
      :shareText="shareText"
      :win="win"
      :intents="intents"
      :setPokedex="setPokedex"
    />

    <FixKeyboard @setKey="(v) => setKey(v)" v-if="!win && intents" />

    <BuyMeACoffee />
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

import HelpModal from "./components/HelpModal.vue";
import Languages from "./components/Languages.vue";
import ResultModal from "./components/ResultModal.vue";
import FixKeyboard from "./components/FixKeyboard.vue";
import BuyMeACoffee from "./components/BuyMeACoffee.vue";

export default {
  name: "App",
  data() {
    return {
      pokedex: localStorage.pokedex ? JSON.parse(localStorage.pokedex) : [],
      pokemon: {},
      intents: localStorage.intents ? parseInt(localStorage.intents) : 5,
      win: false,
      input: "",
      showPokedex: false,
      errorShake: false,
      shareText: "",
    };
  },
  computed: {},
  components: {
    HelpModal,
    Languages,
    ResultModal,
    FixKeyboard,
    BuyMeACoffee,
  },
  mounted() {
    if (!localStorage.pokedex) {
      axios
        .get("https://pokeapi.co/api/v2/pokemon?limit=151&offset=0")
        .then((res) => {
          this.pokedex = res.data.results;

          localStorage.pokedex = JSON.stringify(this.pokedex);

          this.randomPokemon();
        });
    } else this.randomPokemon();

    document.body.addEventListener("keyup", this.keyup);
  },
  methods: {
    getPokenumber(v) {
      return ("000" + v).slice(-3);
    },
    setPokedex() {
      this.showPokedex = true;

      this.$gtag.pageview("/pokedex");

      if (this.win) {
        setTimeout(() => {
          const element = document.querySelector(
            "#pokemon" + this.getPokenumber(this.pokemon.id)
          );
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 1000);
      }
    },
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

      this.shareText = encodeURIComponent(
        "Pokemodle #" +
          this.getPokenumber(this.pokemon.id) +
          " ¡Hoy he atrapado un " +
          this.pokemon.name +
          "! "
      );
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
        } catch (e) {
          console.log(e);
        }

        let pokemon = this.pokedex.find((i) => i.name == this.pokemon.name);
        if (pokemon) pokemon.active = true;

        localStorage.pokemon = JSON.stringify(this.pokemon);
        localStorage.pokedex = JSON.stringify(this.pokedex);

        this.randomPokemon();
      } else {
        this.intents--;

        try {
          window.navigator.vibrate(200);
        } catch (e) {
          console.log(e);
        }
      }
      localStorage.intents = this.intents;
      this.input = "";
    },
  },
};
</script>

<style lang="scss">
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
  padding: 0;
  margin: 0;
  background: #f5f5f5;
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
  margin: 20px auto 0;
}

.scene {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  text-align: center;

  .pokemon {
    position: relative;
    max-width: 65%;
    max-height: 40vh;
    filter: brightness(0);
    transition: all 1s;
    pointer-events: none;
    aspect-ratio: 1;

    &.active {
      filter: none;
    }

    &.disappear {
      opacity: 0;
    }

    @media (max-height: 667px) {
      max-height: 30vh;
    }
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
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px auto 0;

  .pokeball {
    width: 40px;
    position: relative;
    transition: all 1s;
    opacity: 0;
    animation: top 2s ease-out forwards;

    @for $i from 1 through 5 {
      &:nth-of-type(#{$i}) {
        transform: translateY($i * 10px);
      }
    }

    &.disabled {
      transform: none;
      animation: none;
      opacity: 0.3 !important;
    }
  }
}

@keyframes top {
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.btn {
  background: #ed1e24;
  color: white;
  border-radius: 6px;
  padding: 10px 30px;
  cursor: pointer;

  &:hover {
    background: #bb171c;
  }

  &.centered {
    display: block;
    margin: 0 auto;
  }

  &.rounded {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    padding: 0;
    text-align: center;
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

  ul {
    display: block;
    list-style: none;
    padding: 2px 0;
    margin: 0;
    max-height: calc(30px * 4);

    li {
      font-size: 14px;
      color: black;
      padding: 6px 12px;
      border: none;
      appearance: none;
      width: 100%;
      border-radius: none;
    }
  }
}

button {
  border: 0;
  appearance: none;
}

.close {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 2;
  color: white;
  text-decoration: none;
  font-size: 28px;
  font-weight: 600;
  padding: 5px 15px;
  background: none;
}

.pokedex {
  position: fixed;
  top: 100vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;
  background: url(./assets/pokedex.png) no-repeat left top #ed1e24;
  padding-top: 140px;
  opacity: 0;
  transition: top 0.5s, opacity 0.5s;

  &.active {
    position: absolute;
    top: 0;
    opacity: 1;

    & > div {
      transform: translateY(0) !important;
      opacity: 1;
    }
  }

  .pokemon {
    flex-basis: 25%;
    font-size: 9px;
    text-align: center;
    color: white;
    position: relative;
    transition: all 1s;
    opacity: 0;
    min-height: 145px;

    @for $i from 1 through 151 {
      &:nth-of-type(#{$i}) {
        transform: translateY($i * 100px);
      }
    }

    @media (max-width: 480px) {
      flex-basis: 33%;
    }

    &.active {
      img {
        filter: none;
        opacity: 1;
      }
    }

    img {
      max-width: 70%;
      filter: brightness(0) invert(1);
      opacity: 0.05;
      transition: all 1s;
    }
  }
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
