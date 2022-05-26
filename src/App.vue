<template>
  <div id="app">
    <div class="scene">
      <img :src="'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + (pokemon.id) + '.png'" :class="{ 'pokemon': true, 'active': win }" />
    </div>

    <h3>Intentos</h3>
    <div class="pokeballs">
      <img v-for="item in intents" v-bind:key="item" src="./assets/pokeball.png" class="pokeball" />
    </div>

    <autocomplete :search="search" placeholder="¿Qué Pokemon es?" @submit="intent"></autocomplete>

    <h1>Pokédex</h1>

    <div class="pokemones">
      <div v-for="(pokemon, index) in pokemones" v-bind:key="index" :class="{ 'pokemon': true, 'active': pokemon.active }">
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
      pokemones: localStorage.pokemones ? JSON.parse(localStorage.pokemones) : [],
      pokemon: {},
      intents: 5,
      win: false
    }
  },
  components: {
  },
  mounted () {
    if (!localStorage.pokemones) {
      axios.get('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0').then(res => {
        this.pokemones = res.data.results

        localStorage.pokemones = JSON.stringify(this.pokemones)
      })
    }
    
    const random = Math.floor(Math.random() * this.pokemones.length)
    this.pokemon = this.pokemones[random]
    this.pokemon.id = random + 1

    console.log(this.pokemon.name)

    /*axios.get(pokemon.url).then(res => {
        let data = res.data
        this.image = data.sprites.other["official-artwork"].front_default
      })*/
  },
  methods: {
    search(input) {
      if (input.length < 1) { return [] }
      return this.pokemones.filter(i => { return i.name.toLowerCase().startsWith(input.toLowerCase())}).map(i => { return i.name })
    },
    intent(e) {
      if (e == this.pokemon.name) {
        this.win = true
        this.pokemon.active = true
        localStorage.pokemones = JSON.stringify(this.pokemones)
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
  height: 475px;
  background: url(./assets/back.jpg) no-repeat center / cover;

  .pokemon {
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

.pokemones {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;

  & > div {
    flex-basis: 10%;
    font-size: 9px;
    text-align: center;

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
