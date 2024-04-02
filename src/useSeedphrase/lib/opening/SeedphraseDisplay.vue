<script setup>
import { ref } from "vue";
import { store } from "../store";
const props = defineProps(["shardIndex", "intentions", "keyHolderLabel"]);
let isFaded = ref(false);
function saveAndFadeOut() {
  isFaded.value = true;
  setTimeout(() => {
    store.saveIntentions(
      props.intentions[0],
      props.intentions[1],
      props.intentions[2]
    );
    store.shardIndex++; // increment shard association tracker
    store.keyHolderLabel++; // increment keyholder tracker
  }, 500);
}
</script>

<template>
  <div class="seedphrase__container" :class="{ faded: isFaded }">
    <div class="teardrop-wrap">
      <div class="teardrop"></div>
    </div>
    <p class="keyholder-label">
      you are shardbearer {{ props.keyHolderLabel }}
    </p>
    <p class="seedphrase__directive">record your seed phrase.</p>
    <p class="seedphrase__content">
      {{ store.shards[props.shardIndex] }}
    </p>
    <button class="submit" @click="saveAndFadeOut">&#5129;</button>
  </div>
</template>

<style scoped>
.faded {
  opacity: 0;
}

.keyholder-label {
  opacity: 0;
  animation: fadeIn 0.4s 1.2s ease-in forwards;
  font-size: 2.4rem;
  color: var(--open-circle);
  filter: drop-shadow(0 0 0.2em var(--open-circle));
}

.seedphrase__container {
  max-width: 1000px;
  text-align: center;
  transition: opacity 0.4s;
}

.seedphrase__directive,
.seedphrase__content {
  opacity: 0;
}

.seedphrase__directive {
  font-size: 2rem;
  font-weight: 700;
  filter: drop-shadow(0 0 0.4em var(--flame-color));
  animation: fadeIn 0.4s 1.6s ease-in forwards;
  margin-top: 100px;
  margin-bottom: 100px;
}

.seedphrase__content {
  font-family: "Merriweather", serif;
  font-size: 1.2rem;
  line-height: 2.2rem;
  animation: fadeIn 0.4s 2s ease-in forwards;
  margin: 0rem 0 2rem 0;
  color: var(--open-circle);
  border-radius: 100px;
  border-right: solid 1px var(--flame-color);
  border-left: solid 1px var(--flame-color);
  padding: 0.5em 1.2em;
}

button {
  background: transparent;
  font: inherit;
  transition: 0.4s all;
  border: transparent;
}

.submit {
  opacity: 0;
  animation: fadeIn 0.4s 2.6s ease-in forwards;
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

.teardrop-wrap {
  margin: 0 auto;
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
