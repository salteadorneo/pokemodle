<template>
  <section>
    <button v-on:click="() => {
      this.helped = true;
    }
      " class="help">
      ?
    </button>
    <div v-if="helped" class="popup active" v-on:click="() => {
      this.helped = false;
    }
      ">
      <div>
        <button v-on:click="() => {
          this.helped = false;
        }
          " class="close">
          x
        </button>
        <h2 class="title">{{ $t("help.title") }}</h2>
        <p>{{ $t("help.description") }}</p>
        <p>
          <strong>{{ $t("help.strong") }}</strong>
        </p>
        <hr class="line" />
        <p class="small">{{ $t("help.version") }} {{ version }}</p>
        <GitHub />
        <p class="small">
          {{ $t("help.legal") }}
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import GitHub from './GitHub'

import { getKey } from '../services/storage'

import packageInfo from '../../package.json'
const { version } = packageInfo

export default {
  data() {
    return {
      version,
      helped: !getKey('pokedex')
    }
  },
  components: {
    GitHub
  },
  methods: {
    closePopup() {
      this.helped = false
    }
  }
}
</script>

<style scoped>
.small {
  font-size: 10px;
  line-height: 12px;
}

.line {
  display: block;
  width: 90%;
  border: 1px solid #ececec;
  margin: 20px auto;
}

.help {
  position: fixed;
  top: 5px;
  left: 5px;
  background: white;
  border-radius: 50%;
  width: 26px;
  font-size: 16px;
  line-height: 23px;
  color: black;
  border: none;
  appearance: none;
  text-align: center;
  padding: 3px 0 0;
  transition: transform 0.5s;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
}

.help:hover {
  transform: rotate(15deg);
}

a {
  color: black;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 10;
  color: #000;
  background: #00000050;
  opacity: 0;
  transition: all 1s;
}

.popup.active {
  opacity: 1;
}

.popup>div {
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
}

.popup>div .close {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 2;
  text-decoration: none;
  font-size: 28px;
  font-weight: 600;
  padding: 5px 15px;
  background: none;
}

.popup>div .title {
  text-align: center;
  margin: 0 auto;
}
</style>
