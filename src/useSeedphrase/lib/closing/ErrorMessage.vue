<script setup>
import { onMounted, ref } from "vue";
import { store } from "../store";
let isFaded = ref(false);
onMounted(() => {
  setTimeout(() => {
    isFaded.value = true;
  }, 4500);
  store.recollectShards();
});
</script>

<template>
  <div class="container" :class="{ faded: isFaded }">
    <div class="teardrop-wrap">
      <div class="teardrop"></div>
    </div>
    <h2 class="message">incorrect shard combination.</h2>
  </div>
</template>

<style scoped>
.faded {
  opacity: 0;
}

.container {
  transition: opacity 0.4s;
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
  background: var(--close-circle);
  rotate: -45deg;
  filter: drop-shadow(0 0 0.8em var(--close-circle));
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

.message {
  opacity: 0;
  animation: fadeIn 0.4s 1.4s ease-in forwards;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  filter: drop-shadow(0 0 0.3em var(--flame-color));
  color: #fff;
  transition: opacity 0.5s;
}
</style>
