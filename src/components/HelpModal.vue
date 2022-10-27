<template>
  <section>
    <button
      v-on:click="
        () => {
          this.helped = true;
        }
      "
      class="help"
    >
      ?
    </button>
    <div
      v-if="helped"
      class="popup active"
      v-on:click="
        () => {
          this.helped = false;
        }
      "
    >
      <div>
        <button
          v-on:click="
            () => {
              this.helped = false;
            }
          "
          class="close"
        >
          x
        </button>
        <h2 class="title">{{ $t("help.title") }}</h2>
        <p>{{$t("help.description")}}</p>
        <p><strong>{{$t("help.strong")}}</strong></p>
        <p class="small">{{$t("help.version")}} {{ version }}</p>
        <p class="small">
          {{$t("help.legal")}}
        </p>
        <GitHub />
      </div>
    </div>
  </section>
</template>

<script>
import GitHub from "./GitHub";

import packageInfo from "../../package.json";
const { version } = packageInfo;

export default {
  data() {
    return {
      version,
      helped: !localStorage.pokedex,
    };
  },
  components: {
    GitHub,
  },
  methods: {
    closePopup() {
      this.helped = false;
    },
  },
};
</script>
