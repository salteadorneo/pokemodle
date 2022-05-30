<template>
  <div id="app">
    <div :class="{ 'pokedex': true, 'active': showPokedex }">
      <a href="#" @click.prevent="showPokedex = false" class="close">x</a>
      <div v-for="(pokemon, index) in pokedex" v-bind:key="index" :class="{ 'pokemon': true, 'active': pokemon.active }">
        <img :src="'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + (index + 1) + '.png'" />
        <h2>{{('000'+(index+1)).slice(-3)}}<br />{{ pokemon.name }}</h2>
      </div>
    </div>

    <div class="scene" v-if="pokemon.id">
      <img :src="'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + (pokemon.id) + '.png'" :class="{ 'pokemon': true, 'active': win }" />
    </div>
    <div class="flex" v-if="!win">
      <div>
        <input v-model="input" placeholder="¿Qué Pokemon es?" readonly />
        <div v-if="input.length >= 2 && pokedex.filter(p => p.name.toLowerCase().indexOf(input.toLowerCase()) == 0).length > 0" class="autocomplete">
          <ul>
            <li v-for="(pokemon, index) in pokedex.filter(p => p.name.toLowerCase().indexOf(input.toLowerCase()) == 0)" v-bind:key="index" @click.prevent="input=pokemon.name">{{pokemon.name}}</li>
          </ul>
        </div>
      </div>
      <div>
        <div class="pokeballs">
          <img v-for="item in intents" v-bind:key="item" src="./assets/pokeball.png" class="pokeball" />
        </div>
      </div>
    </div>

    <br /><br />
    <center><a href="#" @click.prevent="showPokedex = true">Completa la lista</a></center>

    <div class="keyboard">
      <div class="keyrow">
        <button type="button" class="key" @click="setKey('q')">q</button>
        <button type="button" class="key" @click="setKey('w')">w</button>
        <button type="button" class="key" @click="setKey('e')">e</button>
        <button type="button" class="key" @click="setKey('r')">r</button>
        <button type="button" class="key" @click="setKey('t')">t</button>
        <button type="button" class="key" @click="setKey('y')">y</button>
        <button type="button" class="key" @click="setKey('u')">u</button>
        <button type="button" class="key" @click="setKey('i')">i</button>
        <button type="button" class="key" @click="setKey('o')">o</button>
        <button type="button" class="key" @click="setKey('p')">p</button>
      </div>
      <div class="keyrow">
        <button type="button" class="key" @click="setKey('a')">a</button>
        <button type="button" class="key" @click="setKey('s')">s</button>
        <button type="button" class="key" @click="setKey('d')">d</button>
        <button type="button" class="key" @click="setKey('f')">f</button>
        <button type="button" class="key" @click="setKey('g')">g</button>
        <button type="button" class="key" @click="setKey('h')">h</button>
        <button type="button" class="key" @click="setKey('j')">j</button>
        <button type="button" class="key" @click="setKey('k')">k</button>
        <button type="button" class="key" @click="setKey('l')">l</button>
        <button type="button" class="key" @click="setKey('ñ')">ñ</button>
      </div>
      <div class="keyrow">
        <button type="button" class="key" @click="setKey('enter')"><span style=font-size:22px>✓</span></button>
        <button type="button" class="key" @click="setKey('z')">z</button>
        <button type="button" class="key" @click="setKey('x')">x</button>
        <button type="button" class="key" @click="setKey('c')">c</button>
        <button type="button" class="key" @click="setKey('v')">v</button>
        <button type="button" class="key" @click="setKey('b')">b</button>
        <button type="button" class="key" @click="setKey('n')">n</button>
        <button type="button" class="key" @click="setKey('m')">m</button>
        <button type="button" class="key" @click="setKey('return')">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" style="width:1.5rem;height:1.5rem">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"></path>
          </svg>
        </button>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'App',
  data() {
    return {
      pokedex: localStorage.pokedex ? JSON.parse(localStorage.pokedex) : [],
      pokemon: {},
      intents: localStorage.intents ? parseInt(localStorage.intents) : 5,
      win: false,
      input: '',
      showPokedex: false
    }
  },
  computed: {
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

     document.body.addEventListener("keyup", this.keyup) 
  },
  methods: {
    setKey(v) {
      if (v === 'enter') {
        this.checkPokemon(this.input)
      } else if (v === 'return') {
        this.input = this.input.slice(0, -1)
      } else {
        this.input += v
      }
    },
    keyup(e) {
      if (e.key === 'Enter') {
        this.checkPokemon(this.input)
      } else if (e.key === 'Backspace') {
        this.input = this.input.slice(0, -1)
      } else if (e.key.match(/^[a-zA-Z]$/g)) {
        this.input += e.key
      }
    },
    randomPokemon() {
      this.win = false
      this.intents = localStorage.intents ? parseInt(localStorage.intents) : 5
      this.today = moment()

      let noActives = this.pokedex.filter(i => !i.active)

      if (localStorage.pokemon) this.pokemon = JSON.parse(localStorage.pokemon)
      console.log(this.pokemon.name)
      if (this.pokemon && this.pokemon.date && moment(this.pokemon.date).isSame(this.today, 'day')) return

      this.pokemon = noActives[Math.floor(Math.random() * noActives.length)]
      this.pokemon.id = this.pokemon.url.split('/')[6]
      this.pokemon.date = moment()
      
      this.intents = 5
      localStorage.intents = this.intents

      localStorage.pokemon = JSON.stringify(this.pokemon)

      console.log(this.pokemon.name)
    },
    search(input) {
      if (input.length < 1) { return [] }
      return this.pokedex.filter(i => { return i.name.toLowerCase().startsWith(input.toLowerCase())}).map(i => { return i.name })
    },
    checkPokemon(e) {
      if (!this.intents) return
      if (e.toLowerCase().trim() == this.pokemon.name.toLowerCase().trim()) {
        this.win = true
        this.pokemon.active = true
        localStorage.removeItem('pokemon')
        localStorage.pokedex = JSON.stringify(this.pokedex)
      } else {
        this.intents--
      }
      localStorage.intents = this.intents
      this.input = ''
      //if (this.intents == 0) location.reload()
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');

* {
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', sans-serif;
  padding: 0;
  margin: 0;
  background: #db1516;
}

a {
  color: white;
}

#app {
  width: 820px;
  max-width: 100%;
  margin: 0 auto;
}

.scene {
  width: 100%;
  height: 100%;
  max-height: 475px;
  background: url(./assets/back.jpg) no-repeat center / cover;
  margin: 0 auto;

  .pokemon {
    position: relative;
    top: 3%;
    left: 5%;
    max-width: 50%;
    filter: brightness(0);
    transition: all 1s;

    &.active {
      filter: none;
    }
  }
}

.flex {
  display: flex;
  align-items: flex-start;
  margin: 5px auto 0;

  & > div {
    flex-basis: 50%;
  }
}

input {
  width: 100%;
  padding: 10px;
  outline: none;
  appearance: none;
  border: 1px solid gray;
}

.autocomplete {
  background: white;
  //color: white;

  ul {
    list-style: none;
    padding: 2px 0;
    margin: 0;

    li {
      font-size: 12px;
      padding: 4px 12px;
    }
  }
}

.pokeballs {
  display: flex;

  .pokeball {
    width: 40px;
  }
}

.close {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 2;
  color: white;
  text-decoration: none;
  font-size: 20px;
  font-weight: 600;
  padding: 5px 15px;
}

.pokedex {
  position: fixed;
  top: 0;
  left: 100vw;
  z-index: 2;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;
  background: url(./assets/pokedex.png) no-repeat center top #ed1e24;
  background-size: contain;
  padding-top: 100px;
  opacity: 0;
  transition: left .5s, opacity .5s;

  &.active {
    position: absolute;
    left: 0;
    opacity: 1;

    & > div {
      transform: translateY(0) !important;
      opacity: 1;
    }
  }

  .pokemon {
    flex-basis: 10%;
    font-size: 9px;
    text-align: center;
    color: white;
    position: relative;
    transition: all 1s;
    opacity: 0;
    
    @for $i from 1 through 151 {
      &:nth-of-type(#{$i}) {
        transform: translateY($i * 100px);
      }
    }

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
      filter: brightness(0) invert(1);
      opacity: .05;
      transition: all 1s;
    }
  }
}

.keyboard {
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 100%;
  max-width: 492px;
  max-height: 40vh;
  text-align: center;
  padding: 0 4px 4px;

  .keyrow {
    display: flex;
    justify-content: center;
    width: 100%;

    .key {
      flex: 1 1 0px;
      color: white;
      background: #333;
      border-radius: 6px;
      height: 56px;
      outline: none;
      border: 0;
      margin: 2px;
    }
  }
}
</style>
