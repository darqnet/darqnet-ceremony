<script setup>
import { store } from "../store";
</script>

<template>
  <div class="container">
    <div class="teardrop-wrap">
      <div class="teardrop"></div>
    </div>
    <h2 class="message">encryption unsuccessful.</h2>
    <p>
      <span>Error Details</span><br />
      {{ store.encryptionErrorDetails }}
    </p>
  </div>
</template>

<style scoped>
.faded {
  opacity: 0;
}

.container {
  max-width: 800px;
  transition: opacity 0.4s;
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

p {
  text-align: center;
  line-height: 2rem;
  opacity: 0;
  animation: fadeIn 0.4s 1.8s ease-in forwards;
  font-family: "Merriweather", serif;
  color: var(--close-circle);
  padding: 1em 2em;
  font-weight: 600;
  font-size: 1.15rem;
  border-radius: 100px;
  border-right: solid 1px var(--close-circle);
  border-left: solid 1px var(--close-circle);
  padding: 1em 5em;
  margin-top: 5rem;
  span {
    color: #ffffff;
  }
}
</style>
