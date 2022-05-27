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
        <h2>{{('000'+(index+1)).slice(-3)}} {{ pokemon.name }}</h2>
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
</style>
