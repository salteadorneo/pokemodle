<template>
  <div id="app">
    <div class="scene">
      <img :src="'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + (pokemon.id) + '.png'" :class="{ 'pokemon': true, 'active': win }" />
    </div>

    <autocomplete :search="search" placeholder="¿Qué Pokemon es?" @submit="intent" />

    <br />
    <h3>Intentos</h3>
    <div class="pokeballs">
      <img v-for="item in intents" v-bind:key="item" src="./assets/pokeball.png" class="pokeball" />
    </div>

    <br /><br /><br /><br />

    <h1>Pokédex</h1>

    <div class="pokedex">
      <div v-for="(pokemon, index) in pokedex" v-bind:key="index" :class="{ 'pokemon': true, 'active': pokemon.active }">
        <img :src="'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + (index + 1) + '.png'" />
        <h2>{{('000'+(index+1)).slice(-3)}}<br />{{ pokemon.name }}</h2>
      </div>
    </div>

    <div class="keyboard">
      <div>
        <div class="keyrow">
          <button type="button" class="key" aria-label="q">q</button>
          <button type="button" class="key" aria-label="w">w</button>
          <button type="button" class="key" aria-label="e">e</button>
          <button type="button" class="key" aria-label="r">r</button>
          <button type="button" class="key" aria-label="t">t</button>
          <button type="button" class="key" aria-label="y">y</button>
          <button type="button" class="key" aria-label="u">u</button>
          <button type="button" class="key" aria-label="i">i</button>
          <button type="button" class="key" aria-label="o">o</button>
          <button type="button" class="key" aria-label="p">p</button>
        </div>
        <div class="keyrow">
          <button type="button" class="key" aria-label="a">a</button>
          <button type="button" class="key" aria-label="s">s</button>
          <button type="button" class="key" aria-label="d">d</button>
          <button type="button" class="key" aria-label="f">f</button>
          <button type="button" class="key" aria-label="g">g</button>
          <button type="button" class="key" aria-label="h">h</button>
          <button type="button" class="key" aria-label="j">j</button>
          <button type="button" class="key" aria-label="k">k</button>
          <button type="button" class="key" aria-label="l">l</button>
          <button type="button" class="key" aria-label="ñ">ñ</button>
        </div>
        <div class="keyrow">
          <button type="button" class="key" aria-label="enviar">enviar</button>
          <button type="button" class="key" aria-label="z">z</button>
          <button type="button" class="key" aria-label="x">x</button>
          <button type="button" class="key" aria-label="c">c</button>
          <button type="button" class="key" aria-label="v">v</button>
          <button type="button" class="key" aria-label="b">b</button>
          <button type="button" class="key" aria-label="n">n</button>
          <button type="button" class="key" aria-label="m">m</button>
          <button type="button" class="key" aria-label="borrar letra">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" style="width:1.5rem;height:1.5rem">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'App',
  data() {
    return {
      pokedex: localStorage.pokedex ? JSON.parse(localStorage.pokedex) : [],
      pokemon: {},
      intents: 5,
      win: false,
    focused: false,
    value: '',
    results: []
    }
  },
  computed: {
    noResults() {
      return this.value && this.results.length === 0
    }
  },
  components: {
  },
  mounted () {
    if (!localStorage.pokedex) {
      axios.get('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0').then(res => {
        this.pokedex = res.data.results

        localStorage.pokedex = JSON.stringify(this.pokedex)

        this.randomPokemon()
      })
    } else this.randomPokemon()
  },
  methods: {
    randomPokemon() {
      this.win = false
      this.intents = 5

      const random = Math.floor(Math.random() * this.pokedex.length)
      this.pokemon = this.pokedex[random]
      this.pokemon.id = random + 1

      console.log(this.pokemon.name)
    },
    search(input) {
      if (input.length < 1) { return [] }
      return this.pokedex.filter(i => { return i.name.toLowerCase().startsWith(input.toLowerCase())}).map(i => { return i.name })
    },
    intent(e) {
      if (e == this.pokemon.name) {
        this.win = true
        this.pokemon.active = true
        localStorage.pokedex = JSON.stringify(this.pokedex)
      } else {
        this.intents--
      }
      if (this.intents == 0) location.reload()
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');

body {
  font-family: 'Roboto', sans-serif;
  padding: 0;
  margin: 0;
}

#app {
  width: 820px;
  max-width: 90%;
  margin: 0 auto;
}

h3 {
  display: inline;
}

.scene {
  width: 100%;
  height: 50vw;
  max-height: 475px;
  background: url(./assets/back.jpg) no-repeat center / cover;
  margin: 30px auto;

  .pokemon {
    max-width: 50%;
    filter: brightness(0);
    transition: all 1s;

    &.active {
      filter: none;
    }
  }
}

.pokeballs {
  display: flex;

  .pokeball {
    width: 50px;
  }
}

.pokedex {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;

  & > div {
    flex-basis: 10%;
    font-size: 9px;
    text-align: center;

    @media (max-width: 800px) {
      flex-basis: 20%;
    }

    @media (max-width: 680px) {
      flex-basis: 25%;
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
      filter: brightness(0);
      opacity: .01;
      transition: all 1s;
    }
  }
}

.keyboard {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align: center;

  .key {
    display: inline-block;
    vertical-align: top;
    color: white;
    background: #333;
    border-radius: 4px;
    width: 45px;
    height: 56px;
    outline: none;
    border: 0;
    margin: 1px;
  }
}
</style>
