<script setup>
import { ref } from "vue";

let isFaded = ref(false);
let encryptionDone = ref(false);
let type = ref("default");

setTimeout(() => {
  isFaded.value = true;
}, 9500);

setTimeout(() => {
  encryptionDone.value = true;
  type.value = "success";
}, 10500);

setTimeout(() => {
  isFaded.value = false;
}, 11000);
</script>

<template>
  <div class="orb-container container">
    <div class="orb" :type="type" :class="{ faded: isFaded }"></div>
    <div class="flame-container container">
      <div class="flame flame-1"></div>
      <div class="flame flame-2"></div>
      <div class="flame flame-3"></div>
    </div>
    <div class="flame-base" :type="type"></div>
  </div>
  <p class="encryptionMessage__content">
    <span v-if="!encryptionDone" :class="{ faded: isFaded }"
      >encrypting intentions</span
    >
    <span v-if="encryptionDone" :class="{ faded: isFaded }"
      >ceremony complete</span
    >
  </p>
</template>

<style scoped>
.faded {
  opacity: 0;
}

.container {
  max-width: 18rem;
}

.flame-container {
  position: absolute;
  width: 10%;
  bottom: 1rem;
  display: flex;
  justify-content: center;
}

.flame-base {
  min-height: 1.25rem;
  max-width: 2.5rem;
  width: 100%;
  background-color: var(--flame-color);
  border-radius: 2.5rem 2.5rem 0 0;
  transform: rotate(180deg);
  filter: drop-shadow(0 0 0.3em var(--flame-color));
  z-index: 4;
  margin: 8rem 0 1rem 0;
  transition: 0.5s all;
}

.flame-base[type="success"] {
  background-color: #e1423f;
  filter: drop-shadow(0 0 0.3em #ff5555);
}

.flame {
  position: absolute;
  z-index: -1;
  opacity: 0;
  bottom: 0.4rem;
  min-height: 1.8rem;
  max-width: 1.8rem;
  width: 100%;
  background-color: #fbe995;
  filter: drop-shadow(0 0 0.3em #ffe366);
  border-radius: 56% 44% 88% 12% / 100% 0% 100% 0%;
  transform: rotate(-40deg);
  transition: 0.5s all;
}

.flame-1 {
  animation: float 1.5s 0.5s 5;
}

.flame-2 {
  animation: float 1.5s 1s 5;
}

.flame-3 {
  animation: float 1.5s 1.5s 5;
}

.orb-container {
  opacity: 0;
  animation: fadeIn 0.7s ease-in forwards;
  position: relative;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  filter: blur(0.055rem);
  border-bottom: solid 1px var(--flame-color);
  border-radius: 50%;
}

.orb {
  min-height: 5.5rem;
  max-width: 5.5rem;
  width: 100%;
  background-image: var(--dark-gradient);
  background-size: 300%;
  filter: drop-shadow(0 0 0.3em #fbc381);
  background-position: right;
  border: solid 2px var(--dark-gradient);
  animation: shiftGradient 1.2s infinite ease-in-out alternate;
  border-radius: 50%;
  transform: translateY(2.3rem);
  transition: 0.5s all;
}

.orb[type="success"] {
  background-image: var(--success-gradient);
  filter: drop-shadow(0 0 0.9em #ac441c);
  animation: successGradient 1.2s infinite ease-in-out alternate;
}

@keyframes shiftGradient {
  100% {
    filter: drop-shadow(0 0 0.9em #fbc381);
    background-position: left;
    border: solid 2px var(--light-gradient);
    transform: translateY(3.2rem);
  }
}

@keyframes successGradient {
  100% {
    filter: drop-shadow(0 0 0.9em #fd4444);
    background-position: left;
    border: solid 2px var(--success-border);
    transform: translateY(3.2rem);
  }
}

@keyframes float {
  40% {
    opacity: 1;
  }
  80% {
    transform: translate(0rem, -5.5rem);
  }
  90% {
    opacity: 0;
  }
  100% {
    min-height: 0;
  }
}

.encryptionMessage__content {
  opacity: 0;
  animation: fadeIn 0.5s 1s ease-in forwards;
  font-size: 2.8rem;
  font-weight: 700;
  text-align: center;
  margin-top: 5rem;
  filter: drop-shadow(0 0 0.1em #fff);
  text-align: center;
  transition: 0.5s all;
  span {
    transition: opacity 0.5s;
  }
}
</style>
