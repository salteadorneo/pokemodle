<template>
  <div id="app">
    <button v-on:click="() => { this.helped = true }" class="help">?</button>
    <div v-if="helped" class="popup active" v-on:click="() => { this.helped = false }">
      <div>
        <button v-on:click="() => { this.helped = false }" class="close">x</button>
        <h2 class="title">Cómo jugar</h2>
        <p>Adivina el Pokémon oculto en cinco intentos.<br /><br />
        ¡Uno nuevo cada día!</p>
      </div>
    </div>

    <img src="./assets/logo.png" alt="Pokemodle" class="logo" />

    <div :class="{ 'pokedex': true, 'active': showPokedex }">
      <button @click="showPokedex = false" class="close">x</button>
      <div v-for="(pokemon, index) in pokedex" v-bind:key="index" :class="{ 'pokemon': true, 'active': pokemon.active }">
        <img :src="'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + (index + 1) + '.png'" />
        <h2>{{('000'+(index+1)).slice(-3)}}<br />{{ pokemon.name }}</h2>
      </div>
    </div>

    <div class="scene" v-if="pokemon.id">
      <img :src="'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + (pokemon.id) + '.png'" :class="{ 'pokemon': true, 'active': win }" />
    </div>

    <div v-if="!win">

      <div v-if="intents">
        <input list="browsers" v-model="input" placeholder="¿Qué Pokemon es?" class="textInput" @blur="checkPokemon" />
        <datalist id="browsers" v-show="input && input.length > 1">
          <option v-for="(pokemon, index) in pokedex" v-bind:key="index" :tabindex="index">{{pokemon.name}}</option>
        </datalist>
      </div>

      <div class="pokeballs">
        <img v-for="item in intents" v-bind:key="item" src="./assets/pokeball.png" class="pokeball" />
        <!-- <img v-for="item in 5 - intents|length" v-bind:key="item" src="./assets/pokeball.png" class="pokeball disabled" /> -->
      </div>
        
    </div>

    <div v-if="win && !showPokedex" :class="{'popup active': win}" v-on:click="showPokedex = true">
      <div>
        <h2 class="title">¡Enhorabuena!</h2>
        <p>Has atrapado tu Pokémon diario.</p>
        <button @click="showPokedex=true">Consulta tu lista</button>
      </div>
    </div>

    <div v-if="!win && !intents && !showPokedex" :class="{'popup active': !win}" v-on:click="showPokedex = true">
      <div>
        <h2 class="title">¡Se te ha escapado!</h2>
        <p>Vuelve mañana para encontrar otro.</p>
        <button @click="showPokedex=true">Consulta tu lista</button>
      </div>
    </div>

    <br /><br />
    <center><button @click.prevent="showPokedex = true">Completa la lista</button></center>

    <div class="keyboard" v-if="false">
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
      showPokedex: false,
      helped: false
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

        this.helped = true

        this.randomPokemon()
      })
    } else this.randomPokemon()

    //  document.body.addEventListener("keyup", this.keyup) 

    // document.querySelector(".pokedex").addEventListener('touchmove', this.touchMove, false);
    // document.querySelector(".pokedex").addEventListener('touchend', this.touchEnd, false);
    
  },
  methods: {
    closePopup() {
      this.helped = false
    },
    // touchMove(e) {
    //   e.preventDefault();
    //   var dragElem = e.target;
    //   var touch = e.touches[0];
    //   // var positionX = touch.pageX;
    //   var positionY = touch.pageY;

    //   // dragElem.style.left = positionX - anchor.left + 'px';
    //   dragElem.style.top = positionY + 'px';
    // },
    // touchEnd(e) {
    //   e.preventDefault();
    //   var dragElem = e.target;

    //   if (parseInt(dragElem.style.top) > 150) this.showPokedex = false
    //   dragElem.removeAttribute("style")
    // },
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
      if (this.pokemon && this.pokemon.date && moment(this.pokemon.date).isSame(this.today, 'day')) {
        this.win = this.pokemon.active
        return
      }

      this.pokemon = noActives[Math.floor(Math.random() * noActives.length)]
      this.pokemon.id = this.pokemon.url.split('/')[6]
      this.pokemon.date = moment()
      
      this.intents = 5
      localStorage.intents = this.intents

      localStorage.pokemon = JSON.stringify(this.pokemon)

      console.log(this.pokemon.name)
    },
    // search(input) {
    //   if (input.length < 1) { return [] }
    //   return this.pokedex.filter(i => { return i.name.toLowerCase().startsWith(input.toLowerCase())}).map(i => { return i.name })
    // },
    checkPokemon() {
      if (!this.intents) return
      if (this.input.toLowerCase().trim() == this.pokemon.name.toLowerCase().trim()) {
        this.win = true
        this.pokemon.active = true
        // localStorage.removeItem('pokemon')
        localStorage.pokemon = JSON.stringify(this.pokemon)
        localStorage.pokedex = JSON.stringify(this.pokedex)
      } else {
        this.intents--
      }
      localStorage.intents = this.intents
      this.input = ''
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');

html {
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', sans-serif;
  padding: 0;
  margin: 0;
  background: #f5f5f5;
}

a {
  color: white;
}

#app {
  width: 820px;
  max-width: 100%;
  margin: 0 auto;
}

.help {
  position: fixed;
  top: 5px;
  left: 5px;
  background: gray;
  border-radius: 50%;
  width: 26px;
  font-size: 16px;
  line-height: 26px;
  color: white;
  border: none;
  appearance: none;
  text-align: center;
  padding: 0;
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
    border-radius: 5px;
    padding: 20px;
    width: 85%;
    max-width: 300px;
    text-align: center;

    .close {
      background: none;
      border: none;
      appearance: none;
      color: #000;
    }

    .title {
      text-align: center;
      margin: 0 auto;
    }
  }
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
  max-height: 475px;
  margin: 0 auto;
  text-align: center;

  .pokemon {
    position: relative;
    max-width: 50%;
    filter: brightness(0);
    transition: all 1s;

    &.active {
      filter: none;
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
  border: 1px solid gray;
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

.autocomplete {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  width: 250px;
  margin: 0 auto;
  z-index: 10;

  datalist2 {
    display: block;
    list-style: none;
    padding: 2px 0;
    margin: 0;

    option {
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
  appearance: none;
  border: 0;
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

    @media (max-width: 800px) {
    }

    @media (max-width: 680px) {
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
