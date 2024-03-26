<script setup>
import "@fontsource/im-fell-double-pica-sc";
import "@fontsource/im-fell-dw-pica";
import { ref } from "vue";
import { store } from "./useSeedphrase/lib/store";
import { onMounted } from "vue";
import ChooseCeremony from "./useSeedphrase/lib/opening/ChooseCeremony.vue";
import GetPT from "./useSeedphrase/lib/opening/GetPT.vue";
import GetIntentions from "./useSeedphrase/lib/opening/GetIntentions.vue";
import EncryptionMessage from "./useSeedphrase/lib/opening/EncryptionMessage.vue";
import GetThreshold from "./useSeedphrase/lib/closing/GetThreshold.vue";
import GetShards from "./useSeedphrase/lib/closing/GetShards.vue";
import DecryptionMessage from "./useSeedphrase/lib/closing/DecryptionMessage.vue";
import ErrorMessage from "./useSeedphrase/lib/closing/ErrorMessage.vue";
import RevealIntentions from "./useSeedphrase/lib/closing/RevealIntentions.vue";
import MobileMessage from "./useSeedphrase/lib/MobileMessage.vue";
let welcomeVisible = ref(true);
let correctViewport = ref(false);
const viewportWidth = window.screen.width;
onMounted(() => {
  if (viewportWidth >= 1280) {
    correctViewport.value = true;
    setTimeout(() => {
      console.log("Welcome to Darqnet 🔮");
      welcomeVisible.value = false;
    }, 7500);
  }
});
</script>

<template>
  <!-- APP LOAD / CEREMONY CHOICE -->
  <MobileMessage v-if="viewportWidth <= 1280" />

  <h1 v-if="welcomeVisible && correctViewport" class="welcome">DARQNET</h1>

  <Transition>
    <ChooseCeremony v-if="!welcomeVisible && !store.ceremonyChosen" />
  </Transition>

  <!-- OPENING CEREMONY -->

  <Transition>
    <GetPT v-if="store.ceremonyType === 'open' && !store.acquiredPT" />
  </Transition>

  <GetIntentions
    v-if="store.beginIntentions && !store.acquiredIntentions"
    :participantLabel="store.participantLabel"
    :key="store.rerender"
  />

  <Transition>
    <EncryptionMessage v-if="store.acquiredIntentions" />
  </Transition>

  <!-- CLOSING CEREMONY -->

  <Transition>
    <GetThreshold
      v-if="store.ceremonyType === 'close' && !store.acquiredThreshold"
    />
  </Transition>

  <GetShards
    v-if="store.acquiredThreshold && store.collectingShards"
    :shardNumber="store.shardNumber"
    :key="store.rerender"
  />

  <Transition>
    <DecryptionMessage
      v-if="store.acquiredClosingShards && store.decryptionVisible"
    />
  </Transition>

  <ErrorMessage v-if="store.decryptionError" />

  <RevealIntentions
    v-if="!store.decryptionVisible && store.intentionsVisible"
  />
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

:root {
  --bg-dark: #060b18;
  font-family: "IM Fell Double Pica SC", serif;
  font-size: 17px;
  color: #fff;
  background-color: var(--bg-dark);
  --dark-gradient: linear-gradient(
    to right bottom,
    #fbc381,
    #e1995a,
    #c76f38,
    #ac441c,
    #900505
  );
  --light-gradient: linear-gradient(
    to right bottom,
    #fbc381,
    #eeae6d,
    #e1995a,
    #d48448,
    #c76f38
  );
  --success-gradient: linear-gradient(
    to right bottom,
    #ff5555,
    #e1423f,
    #c42f2a,
    #a71b16,
    #8b0000
  );

  --success-border: linear-gradient(
    to right bottom,
    #fd4444,
    #da3533,
    #b82522,
    #971513,
    #780202
  );

  --decrypt-gradient: linear-gradient(
    to right bottom,
    #04eca3,
    #01c78a,
    #01a371,
    #028159,
    #036042
  );

  --close-circle: rgb(255, 86, 86);
  --open-circle: #fbe995;
  --flame-color: #1942f9;
  --teardrop-ds: #5869b5;
  --success: #04eca3;
}

*,
*::after,
*::before {
  box-sizing: border-box;
}

html {
  overflow-y: hidden;
}

html,
body {
  margin: 0;
  padding: 0;
}

/* || ANIMATIONS */
@keyframes fadeIn {
  100% {
    opacity: 1;
  }
}

@keyframes fadeIn-Out {
  25% {
    opacity: 1;
  }
  75% {
    opacity: 0.8;
  }
  100% {
    opacity: 0;
  }
}

@keyframes shiftBG {
  100% {
    background-position: top center;
  }
}

/* GLOBAL STYLES */
body {
  min-height: 100vh;
  display: grid;
  place-items: center;
}

.ceremonyContainer {
  backdrop-filter: blur(1.9px);
  min-height: 100vh;
  position: relative;
  width: 100%;
  display: grid;
  place-items: center;
}

.welcome {
  font-family: "IM Fell Double Pica SC", serif;
  opacity: 0;
  font-size: 4rem;
  border-bottom: solid 1.8px #1942f979;
  border-radius: 50%;
  padding: 0 0 0.5em 0;
  animation: fadeIn-Out 6s 1s ease-in forwards;
  filter: drop-shadow(0 0 0.035em var(--flame-color));
}

/* COMPONENT STYLES */
.chooseCeremony__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  opacity: 0;
  animation: fadeIn 0.5s ease-in forwards;
}

conjuration-input,
encryption-message,
shard-input,
reveal-intentions,
decryption-message {
  width: 100%;
}

reveal-intentions {
  margin-bottom: 6.5rem;
}

participant-input {
  width: 65%;
}
</style>
