<template>
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
        <button type="button" class="key" @click="setKey('-')">-</button>
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
</template>

<script>
export default {
  data() {
    return {
    }
  },
  methods: {
    setKey(v) {
      this.$emit('setKey', v);
    },
  }
}
</script>

<style lang="scss" scoped>
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
