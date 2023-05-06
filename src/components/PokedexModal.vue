<template>
  <div>
    <button
      @click.prevent="hidePokedex = !hidePokedex"
      :class="{ tab: true, active: !hidePokedex }"
    >
      Pokédex
    </button>
    <div :class="{ pokedex: true, active: !hidePokedex }">
      <button @click="hidePokedex = true" class="close">x</button>
      <div class="counter">
        {{ pokedex.filter((p) => p.active).length }}/{{ pokedex.length }}
      </div>
      <div class="list">
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
          <h2 class="name">
            {{ getPokenumber(index + 1) }}<br />{{ pokemon.name }}
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .tab {
    position: fixed;
    top: 40%;
    right: -20px;
    transform: translateY(-50%) rotate(-90deg);
    z-index: 2;
    color: white;
    font-size: 15px;
    padding: 0 15px 0 0;
    transition: all 0.5s;
  }

  .tab:hover:before {
    border-bottom-color: #d51a21;
  }

  .tab.active {
    transform: translate3d(-500px, -50%, 0) rotate(-90deg);

    @media (max-width: 500px) {
      transform: translate3d(-100vw, -50%, 0) rotate(-90deg);
    }
  }

  .tab:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    display: block;
    width: 100px;
    height: 0;
    border-right: 20px solid transparent;
    border-bottom: 40px solid #ed1e24;
    border-left: 0 solid transparent;
    padding-right: 30px;
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

  .counter {
    font-size: 30px;
    color: white;
    font-weight: bold;
    opacity: 0.3;
    text-align: right;
    padding: 0 25px;
    margin-top: -80px;
    margin-bottom: 30px;
  }

  .pokedex {
    position: fixed;
    top: 0;
    left: 0;
    transform: translateX(100vw);
    z-index: 2;
    width: 100%;
    max-width: 500px;
    background: url(../assets/pokedex.png) no-repeat left top #ed1e24;
    padding-top: 140px;
    transition: all 0.5s;
  }

  .pokedex.active {
    position: absolute;
    transform: translate3d(calc(100vw - 500px), 0, 0);
  }

  @media (max-width: 500px) {
    .pokedex.active  {
    transform: translateX(0);
    }
  }

  .pokedex .pokemon {
    transform: translateY(0) !important;
    opacity: 1;
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-end;
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
  }

  .pokemon.active img {
    filter: none;
    opacity: 1;
  }

  .pokemon img {
    max-width: 70%;
    filter: brightness(0) invert(1);
    opacity: 0.05;
    transition: all 1s;
  }

  .pokemon .name {
    text-transform: capitalize;
  }

  @media (max-width: 480px) {
    .pokemon {
      flex-basis: 33%;
    }
  }
</style>

<script>
import splitbee from '@splitbee/web'

export default {
  props: {
    pokedex: Array,
    win: Boolean,
    pokemon: Object
  },
  data () {
    return {
      hidePokedex: true
    }
  },
  methods: {
    getPokenumber (v) {
      return ('000' + v).slice(-3)
    }
  },
  watch: {
    hidePokedex () {
      splitbee.track('ShowPokedex')

      if (this.win) {
        setTimeout(() => {
          const element = document.querySelector(
            '#pokemon' + this.getPokenumber(this.pokemon.id)
          )
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 1000)
      }
    }
  }
}
</script>
