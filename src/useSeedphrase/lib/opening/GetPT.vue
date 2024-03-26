<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { store } from "../store";
import { getResolver } from "key-did-resolver";
import * as Bip39 from "bip39";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { DID } from "dids";
import * as seedsplit from "../../js/seedsplit";
let queryText;
let input;
let participantFadeOut = ref(false);
let thresholdFadeOut = ref(false);
onMounted(() => {
  queryText = document.querySelector(".queryText");
  input = document.querySelector("input");
  setTimeout(() => {
    queryText.style.opacity = "1";
    input.focus();
  }, 2000);
});
let gotParticipants = ref(false);
let gotThreshold = ref(false);

function processPT() {
  if (!gotParticipants.value) {
    if (!isNaN(parseInt(input.value))) {
      store.participants = parseInt(input.value);
      queryText.style.opacity = "0";
      setTimeout(() => {
        gotParticipants.value = true;
      }, 500);
      setTimeout(() => {
        participantFadeOut.value = true;
        queryText.style.opacity = "1";
      }, 1000);
      input.value = "";
      input.focus();
    }
  } else if (gotParticipants.value && !gotThreshold.value) {
    if (
      !isNaN(parseInt(input.value)) &&
      parseInt(input.value) <= store.participants
    ) {
      store.threshold = parseInt(input.value);
      thresholdFadeOut.value = true;
      setTimeout(() => {
        gotThreshold.value = true;
      }, 500);
      input.value = "";
      createShards(store.participants, store.threshold);
      store.fadeOutPT();
    }
  }
}

async function createShards(participants, threshold) {
  const mnemonic = Bip39.generateMnemonic();
  const seed = new Uint8Array(Bip39.mnemonicToSeedSync(mnemonic).slice(0, 32));
  const provider = new Ed25519Provider(seed);
  const did = new DID({ provider, resolver: getResolver() });
  await did.authenticate();
  store.did = did;
  const shards = await seedsplit.split(mnemonic, participants, threshold);
  store.saveShards(shards);
}

function validateThreshold() {
  if (gotParticipants.value && parseInt(input.value) > store.participants)
    input.style.borderColor = "red";
  else {
    input.style.borderColor = "var(--flame-color)";
  }
}
</script>

<template>
  <div class="query__container">
    <div class="teardrop-wrap">
      <div class="teardrop"></div>
    </div>
    <p class="queryText">
      <span v-if="!gotParticipants">how many have gathered?</span>
      <span v-if="participantFadeOut">what is your threshold?</span>
    </p>
    <div class="input__container">
      <input type="text" class="input" autofocus @keyup="validateThreshold" />
      <button class="submit" @click="processPT">&#5129;</button>
    </div>
  </div>
</template>

<style scoped>
input,
button {
  background: transparent;
  font: inherit;
  transition: 0.4s all;
  border: transparent;
}

.input {
  color: #fff;
  border-radius: 50%;
  padding: 0.5em;
  font-size: 2.3rem;
  width: 100%;
  outline: none;
  text-align: center;
  border-bottom: solid 1px var(--flame-color);
  transition: border-color 0.4s;
}

.input::placeholder {
  color: #f0f0f0;
  animation: fadeIn 1s ease-in forwards;
}

.submit {
  opacity: 0;
  animation: fadeIn 0.4s 2.8s ease-in forwards;
  rotate: 90deg;
  margin-top: 1rem;
  font-size: 2.7rem;
  outline-color: transparent;
  color: #fff;
  filter: drop-shadow(0 0 0.1em var(--flame-color));
  border-radius: 50%;
  width: min-content;
}

.submit:hover,
.submit:focus {
  rotate: 0deg;
  cursor: pointer;
  color: #9d9d9d;
  outline: transparent;
}

.input__container {
  opacity: 0;
  animation: fadeIn 0.4s 2.2s ease-in forwards;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.1rem;
  width: 100%;
  max-width: 150px;
  margin: 0 auto;
  margin-top: 4.5rem;
}

.query__container {
  margin: 0 auto;
  max-width: 600px;
  width: 100%;
}

.queryText {
  min-height: 50px;
  opacity: 0;
  font-size: 2.1rem;
  font-weight: 700;
  text-align: center;
  filter: drop-shadow(0 0 0.35em var(--flame-color));
  transition: 0.5s all;
}

.teardrop-wrap {
  margin: 0 auto;
  margin-bottom: 6.5rem;
  min-height: 2rem;
  width: 2rem;
  filter: blur(0.025rem);
}

.teardrop {
  opacity: 0;
  animation: fadeIn 0.4s 0.8s ease-in forwards;
  position: relative;
  margin: 0 auto;
  min-height: 2rem;
  width: 2rem;
  border-radius: 95% 15% 100% 0% / 100% 15% 95% 0%;
  border: solid 1px transparent;
  background: var(--open-circle);
  rotate: -45deg;
  filter: drop-shadow(0 0 0.8em var(--open-circle));
  transition: 0.5s all;
}

.teardrop::after {
  content: "";
  position: absolute;
  width: 3rem;
  min-height: 3rem;
  border-bottom: solid 2px var(--flame-color);
  border-radius: 50%;
  left: 0.2rem;
  bottom: 0.2rem;
  rotate: 225deg;
}
</style>
