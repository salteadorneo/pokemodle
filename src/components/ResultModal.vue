<template>
  <section>
    <div v-if="win" class="msg">
      <div>
        <h2 class="title">¡Enhorabuena!</h2>
        <p>Has atrapado tu Pokémon diario.</p>

        <div class="share">
          <a
            :href="
              'https://twitter.com/intent/tweet?url=https%3A%2F%2Fpokemodle.salteadorneo.dev%2F&text=' +
              shareText
            "
            target="_blank"
            @click="setEvent('twitter')"
            ><TwitterIcon
          /></a>
          <a
            :href="
              'https://api.whatsapp.com/send?text=' +
              shareText +
              'https%3A%2F%2Fpokemodle.salteadorneo.dev%2F'
            "
            target="_blank"
            @click="setEvent('whatsapp')"
            ><WhatsappIcon
          /></a>
          <a
            :href="
              'https://telegram.me/share/url?url=https%3A%2F%2Fpokemodle.salteadorneo.dev%2F&text=' +
              shareText
            "
            target="_blank"
            @click="setEvent('telegram')"
            ><TelegramIcon
          /></a>
          <button @click="clipboard" class="btn rounded"><CopyIcon /></button>
        </div>

        <button @click="setPokedex" class="btn">Pokédex</button>
        <p>Vuelve mañana para encontrar otro.</p>
      </div>
    </div>

    <div v-if="!win && !intents" class="msg">
      <div>
        <h2 class="title">¡Se te ha escapado!</h2>
        <p>Vuelve mañana para encontrar otro.</p>
        <button @click="setPokedex" class="btn">Pokédex</button>
      </div>
    </div>
  </section>
</template>
<script>
import TwitterIcon from "./TwitterIcon.vue";
import WhatsappIcon from "./WhatsappIcon.vue";
import TelegramIcon from "./TelegramIcon.vue";
import CopyIcon from "./CopyIcon.vue";

export default {
  props: {
    pokemon: Object,
    win: Boolean,
    intents: Number,
    setPokedex: { type: Function },
    shareText: String,
  },
  components: {
    TwitterIcon,
    WhatsappIcon,
    TelegramIcon,
    CopyIcon,
  },
  methods: {
    setEvent(e) {
      this.$gtag.event("event", {
        event_category: "share",
        event_label: e,
        value: this.pokemon.name,
      });
    },
    clipboard() {
      navigator.clipboard.writeText(
        decodeURIComponent(
          this.shareText + " https%3A%2F%2Fpokemodle.salteadorneo.dev%2F"
        )
      );
      this.setEvent("clipboard");
    },
  },
};
</script>
<style lang="scss" scoped>
.msg {
  text-align: center;
}

.share {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px auto 20px;

  a,
  .btn {
    width: 35px;
    height: 35px;
    margin: 0 3px;

    &:hover {
      transform: scale(1.1);
    }
  }
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
    padding: 20px 20px 40px;
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
</style>
