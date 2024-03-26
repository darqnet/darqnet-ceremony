<script setup>
import { store } from "../store";
import { onMounted, ref } from "vue";
const props = defineProps(["shardNumber"]);
import * as Bip39 from "bip39";

let input;
let invalidShard = ref(false);
let isFaded = ref(false);
let gotShard = ref(false);
onMounted(() => {
  input = document.querySelector(".input");
  input.focus();
});

function validateShard() {
  if (
    !Bip39.validateMnemonic(input.value.trim().split(" ").slice(1).join(" "))
  ) {
    isFaded.value = true;
    setTimeout(() => {
      invalidShard.value = true;
      isFaded.value = false;
    }, 600);
  } else {
    const shard = input.value.trim();
    input.value = "";
    gotShard.value = true;
    setTimeout(() => {
      store.saveClosingShards(shard);
    }, 700);
  }
}
</script>

<template>
  <div class="input__container" :class="{ faded: gotShard }">
    <div class="heading__container">
      <p
        class="queryText"
        :class="{ faded: isFaded, invalidShardMessage: invalidShard }"
      >
        <span v-if="!invalidShard">offer shard {{ props.shardNumber }}.</span>
        <span v-if="invalidShard"
          >invalid. offer shard {{ props.shardNumber }} again.</span
        >
      </p>
    </div>

    <div class="flame-outermost">
      <div class="flame-circle">
        <div class="flame-container flame-1">
          <div class="flame"></div>
        </div>
        <div class="flame-container flame-2">
          <div class="flame"></div>
        </div>
        <div class="flame-container flame-3">
          <div class="flame"></div>
        </div>
      </div>
    </div>

    <div class="input__area">
      <textarea type="text" class="input"></textarea>
      <button class="submit" @click="validateShard">&#5129;</button>
    </div>
  </div>
</template>

<style scoped>
.faded {
  opacity: 0;
}

textarea,
button {
  background: transparent;
  font: inherit;
  transition: 0.4s all;
  border: transparent;
}

.input {
  opacity: 0;
  animation: fadeIn 0.4s 2s ease-in forwards;
  color: #fff;
  border-radius: 100px;
  padding: 1.2em 0.9em 0 0.9em;
  font-family: "IM Fell DW Pica", serif;
  font-size: 1.2rem;
  min-width: 700px;
  outline: none;
  text-align: center;
  border-right: solid 1px #fbe9954d;
  border-left: solid 1px #fbe9954d;
  min-height: 6rem;
  resize: none;
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

.input__container {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  min-height: 700px;
  margin: 0 auto;
  border-radius: 50%;
  transition: opacity 0.4s;
}

.input__area {
  width: 50%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.heading__container {
  opacity: 0;
  margin-top: 4.5rem;
  text-align: center;
  animation: fadeIn 0.4s 1.8s ease-in forwards;
}

.queryText {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  filter: drop-shadow(0 0 0.3em var(--flame-color));
  color: #fff;
  transition: opacity 0.5s;
}

/* applied when shard is invalid */
.invalidShardMessage {
  color: var(--close-circle);
  filter: drop-shadow(0 0 0.4em var(--close-circle));
}

.flame-outermost {
  opacity: 0;
  animation: fadeIn 0.2s 0.6s ease-in forwards;
  gap: 0rem;
  margin-top: 4rem;
  margin-bottom: 4rem;
  align-items: flex-end;
  justify-content: space-evenly;
}

.flame-container,
.flame {
  min-height: 1.5rem;
  max-width: 1.5rem;
  width: 100%;
}

.flame-container {
  position: absolute;
  filter: blur(0.07rem);
  display: inline;
}

.flame-circle {
  position: relative;
  min-height: 6.5rem;
  width: 6.5rem;
  border-radius: 50%;
  animation: rotate 3.3s linear infinite;
}

.flame {
  border-radius: 56% 44% 88% 12% / 100% 0% 100% 0%;
  transform: rotate(-40deg);
  animation: dissolve 1.5s 0.1s ease-in-out infinite alternate;
  transition: 0.5s all;
  background: var(--close-circle);
  filter: drop-shadow(0 0 0.8em var(--close-circle));
}

.flame-1 {
  top: -0.6rem;
  right: 2.4rem;
  rotate: 90deg;
}

.flame-2 {
  bottom: 0.8rem;
  left: -0.3rem;
  rotate: -30deg;
}

.flame-3 {
  bottom: 0.6rem;
  right: -0.2rem;
  rotate: 210deg;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  20% {
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dissolve {
  100% {
    rotate: 240deg;
    min-height: 0.1rem;
  }
}
</style>
