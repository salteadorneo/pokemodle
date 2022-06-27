<template>
  <div id="app">
    <button v-on:click="() => { this.helped = true }" class="help">?</button>
    <div v-if="helped" class="popup active" v-on:click="() => { this.helped = false }">
      <div>
        <button v-on:click="() => { this.helped = false }" class="close">x</button>
        <h2 class="title">Cómo jugar</h2>
        <p>Adivina el Pokémon oculto y atrápalo. Tienes 5 intentos.</p>
        <p><strong>¡Un nuevo Pokémon cada día!</strong></p>
        <p class="small">Versión {{ version }}</p>
        <p class="small">Pokémon y los nombres de los personajes de Pokémon son marcas comerciales de Nintendo.</p>
      </div>
    </div>

    <img src="./assets/logo.png" alt="Pokemodle" class="logo" />

    <div :class="{ 'pokedex': true, 'active': showPokedex }">
      <button @click="showPokedex = false" class="close">x</button>
      <div v-for="(pokemon, index) in pokedex" v-bind:key="index" :class="{ 'pokemon': true, 'active': pokemon.active }" :id="'pokemon' + getPokenumber(index + 1)">
        <img :src="'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + (index + 1) + '.png'" />
        <h2>{{getPokenumber(index + 1)}}<br />{{ pokemon.name }}</h2>
      </div>
    </div>

    <div class="scene" v-if="pokemon.id">
      <img :src="'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + (pokemon.id) + '.png'" :class="{ 'pokemon': true, 'active': win, 'disappear': !intents && !pokemon.active }" />
    </div>

    <div v-if="intents && !pokemon.active">
      <div>
        <input v-model="input" placeholder="¿Qué Pokémon es?" class="textInput" readonly />
        <div v-if="input && input.length >= 2 && pokedex.filter(p => p.name.toLowerCase().indexOf(input.toLowerCase()) == 0).length > 0" class="autocomplete">
          <ul>
            <li v-for="(pokemon, index) in pokedex.filter(p => p.name.toLowerCase().indexOf(input.toLowerCase()) == 0)" v-bind:key="index" @click.prevent="setAndValidate(pokemon)">{{pokemon.name}}</li>
          </ul>
        </div>
      </div>

      <div class="pokeballs">
        <img v-for="item in intents" v-bind:key="item + 1000" src="./assets/pokeball.png" class="pokeball" />
        <img v-for="item in 5 - intents|length" v-bind:key="item + 2000" src="./assets/pokeball.png" class="pokeball disabled" />
      </div>

      <br />
      <button @click.prevent="showPokedex = true" class="btn centered">Pokédex</button>
    </div>

    <div v-if="win && !showPokedex" class="msg">
      <div>
        <h2 class="title">¡Enhorabuena!</h2>
        <p>Has atrapado tu Pokémon diario.</p>
        
        <div class="share">
          <a :href="'https://twitter.com/intent/tweet?url=https%3A%2F%2Fpokemodle.salteadorneo.dev%2F&text=' + shareText" target="_blank"><TwitterIcon /></a>
          <a :href="'https://web.whatsapp.com/send?text=' + shareText + 'https%3A%2F%2Fpokemodle.salteadorneo.dev%2F'" target="_blank"><WhatsappIcon /></a>
          <a :href="'https://telegram.me/share/url?url=https%3A%2F%2Fpokemodle.salteadorneo.dev%2F&text=' + shareText" target="_blank"><TelegramIcon /></a>
          <button @click="clipboard" class="btn rounded"><CopyIcon /></button>
        </div>

        <button @click="showPokedexAndScroll" class="btn">Pokédex</button>
        <p>Vuelve mañana para encontrar otro.</p>
      </div>
    </div>

    <div v-if="!win && !intents && !showPokedex" class="msg">
      <div>
        <h2 class="title">¡Se te ha escapado!</h2>
        <p>Vuelve mañana para encontrar otro.</p>
        <button @click="showPokedex=true" class="btn">Pokédex</button>
      </div>
    </div>

    <FixKeyboard @setKey="v => setKey(v)" v-if="!win && intents" />
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

import FixKeyboard from './components/FixKeyboard.vue'

import TwitterIcon from './components/TwitterIcon.vue'
import WhatsappIcon from './components/WhatsappIcon.vue'
import TelegramIcon from './components/TelegramIcon.vue'
import CopyIcon from './components/CopyIcon.vue'

export default {
  name: 'App',
  data() {
    return {
      version: 0.2,
      pokedex: localStorage.pokedex ? JSON.parse(localStorage.pokedex) : [],
      pokemon: {},
      intents: localStorage.intents ? parseInt(localStorage.intents) : 5,
      win: false,
      input: '',
      showPokedex: false,
      helped: false,
      shareText: ''
    }
  },
  computed: {
  },
  components: {
    FixKeyboard,
    TwitterIcon,
    WhatsappIcon,
    TelegramIcon,
    CopyIcon
  },
  mounted () {
    if (!localStorage.pokedex) {
      axios.get('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0').then(res => {
        this.pokedex = res.data.results

        localStorage.pokedex = JSON.stringify(this.pokedex)

        this.helped = true

        this.randomPokemon()
      })
    } else this.randomPokemon()

     document.body.addEventListener("keyup", this.keyup) 
  },
  methods: {
    clipboard() {
      navigator.clipboard.writeText(decodeURIComponent(this.shareText + ' https%3A%2F%2Fpokemodle.salteadorneo.dev%2F'))
    },
    closePopup() {
      this.helped = false
    },
    getPokenumber(v) {
      return ('000' + v).slice(-3);
    },
    showPokedexAndScroll() {
      this.showPokedex = true

      setTimeout(() => {
        var element = document.querySelector('#pokemon' + this.getPokenumber(this.pokemon.id))
        element.scrollIntoView({behavior: 'smooth', block: 'center'})
      }, 1000);
    },
    setAndValidate(v) {
      this.input = v.name;
      this.checkPokemon();
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
      this.intents = localStorage.intents ? parseInt(localStorage.intents) : 5
      this.today = moment()

      if (localStorage.pokemon) this.pokemon = JSON.parse(localStorage.pokemon)
      if (this.pokemon && this.pokemon.date && moment(this.pokemon.date).isSame(this.today, 'day'))
        this.win = this.pokemon.active
      else
        localStorage.removeItem('pokemon')

      if (!localStorage.pokemon) {
        let noActives = this.pokedex.filter(i => !i.active)

        this.pokemon = noActives[Math.floor(Math.random() * noActives.length)]
        this.pokemon.id = this.pokemon.url.split('/')[6]
        this.pokemon.date = moment()
        
        this.intents = 5
        localStorage.intents = this.intents
      
        localStorage.pokemon = JSON.stringify(this.pokemon)
      }

      if (location.href.includes("localhost")) console.log(this.pokemon.name)

      this.shareText = encodeURIComponent('Pokemodle #' + this.getPokenumber(this.pokemon.id) + ' ¡Hoy he atrapado un ' + this.pokemon.name + '! ')
    },
    checkPokemon() {
      if (!this.intents || !this.input) return
      if (this.input.toLowerCase().trim() == this.pokemon.name.toLowerCase().trim()) {
        this.pokemon.active = true
        this.win = this.pokemon.active

        try { window.navigator.vibrate(500); } catch (e) { console.log(e) }

        let pokemon = this.pokedex.find(i => i.name == this.pokemon.name)
        if (pokemon) pokemon.active = true
        
        localStorage.pokemon = JSON.stringify(this.pokemon)
        localStorage.pokedex = JSON.stringify(this.pokedex)

        this.randomPokemon()

      } else {
        this.intents--

        try { window.navigator.vibrate(200); } catch (e) { console.log(e) }
      }
      localStorage.intents = this.intents
      this.input = ''
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap');

* {
  box-sizing: border-box;
  user-select: none;
}

button {
  cursor: pointer;
}

body {
  font-family: 'Lato', sans-serif;
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

.help {
  position: fixed;
  top: 5px;
  left: 5px;
  background: #666;
  border-radius: 50%;
  width: 26px;
  font-size: 16px;
  line-height: 23px;
  color: white;
  border: none;
  appearance: none;
  text-align: center;
  padding: 3px 0 0;

  &:hover {
    background: #555;
  }
}

.small {
  font-size: 10px;
  line-height: 12px;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 10;
  background: #00000050;
  opacity: 0;
  transition: all 1s;

  &.active {
    opacity: 1;
  }

  & > div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    background: #fff;
    border-radius: 6px;
    padding: 20px;
    width: 85%;
    max-width: 300px;
    text-align: center;

    .close {
      background: none;
      color: #000;
    }

    .title {
      text-align: center;
      margin: 0 auto;
    }
  }
}

.msg {
  text-align: center;
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

    &.active {
      filter: none;
    }

    &.disappear {
      opacity: 0;
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
  justify-content: center;
  margin: 10px auto 0;

  .pokeball {
    width: 40px;

    &.disabled {
      opacity: .3;
    }
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
  background: rgba(255, 255, 255, .99);
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

.share {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px auto 20px;

  a, .btn {
    width: 35px;
    height: 35px;
    margin: 0 3px;

    &:hover {
      transform: scale(1.1);  
    }
  }
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
  transition: top .5s, opacity .5s;

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
      opacity: .05;
      transition: all 1s;
    }
  }
}
</style>
