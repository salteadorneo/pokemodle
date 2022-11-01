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

        <p>Vuelve mañana para encontrar otro.</p>
      </div>
    </div>

    <div v-if="!win && !intents" class="msg">
      <div>
        <h2 class="title">¡Se te ha escapado!</h2>
        <p>Vuelve mañana para encontrar otro.</p>
      </div>
    </div>
  </section>
</template>
<script>
import TwitterIcon from "./icons/TwitterIcon.vue";
import WhatsappIcon from "./icons/WhatsappIcon.vue";
import TelegramIcon from "./icons/TelegramIcon.vue";
import CopyIcon from "./icons/CopyIcon.vue";

export default {
  props: {
    pokemon: Object,
    win: Boolean,
    intents: Number,
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

.rounded {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 0;
  text-align: center;
  color: white;
  background: #ed1e24;
}
</style>
