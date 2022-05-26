<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  mounted () {
    axios
      .get('https://pokeapi.co/api/v2/pokemon?limit=1&offset='+Math.round(Math.random() * 101))
      .then(res => {
        let data = res.data
        const [{name, url}] = data.results
        console.log(name, url)

        axios
          .get(url)
          .then(res => {
            let data = res.data
            console.log(data)
            const [{sprites}] = data.results
          })
      })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
