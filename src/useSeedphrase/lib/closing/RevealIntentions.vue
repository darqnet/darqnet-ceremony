<script setup>
import { store } from "../store";
import { onMounted } from "vue";
import ResponseBlock from "./ResponseBlock.vue";

let blurObserver;
let fadeObserver;
let targetElements;
let h2s;

onMounted(() => {
  blurObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("blur");
        } else {
          entry.target.classList.add("blur");
        }
      });
    },
    {
      root: document.querySelector(".scrollable-content"),
      threshold: 1,
    }
  );
  targetElements = document.querySelectorAll(".response-block");
  targetElements.forEach((el) => {
    blurObserver.observe(el);
  });

  fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.filter = "none";
          entry.target.style.animation = "fadeIn ease-in forwards";
        } else {
          entry.target.style.filter = "blur(3px)";
        }
      });
    },
    {
      root: document.querySelector(".scrollable-content"),
      threshold: 1,
    }
  );

  h2s = document.querySelectorAll("h2");
  h2s.forEach((el) => {
    fadeObserver.observe(el);
  });
});
</script>

<template>
  <div class="display-container">
    <div class="teardrop-wrap">
      <div class="teardrop"></div>
    </div>
    <h1 class="title">summoned intentions</h1>
    <div class="scrollable-content">
      <div class="responses">
        <h2 class="h2-1">what is your biggest dream for the new year?</h2>
        <div class="dream-responses">
          <ResponseBlock
            v-for="(item, i) in store.cleartext.d"
            :participantNumber="i + 1"
            :intention="item"
          />
        </div>
      </div>
      <div class="responses">
        <h2 class="h2-2">what will you conjure by the summer solstice?</h2>
        <div class="conjure-responses">
          <ResponseBlock
            v-for="(item, i) in store.cleartext.c"
            :participantNumber="i + 1"
            :intention="item"
          />
        </div>
      </div>
      <div class="responses">
        <h2 class="h2-3">feel into the moment and capture its essence.</h2>
        <div class="essence-responses">
          <ResponseBlock
            v-for="(item, i) in store.cleartext.e"
            :participantNumber="i + 1"
            :intention="item"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.teardrop-wrap {
  margin: 0 auto;
  margin-top: 5rem;
  margin-bottom: 1.5rem;
  min-height: 2rem;
  width: 2rem;
  filter: blur(0.025rem);
}

.teardrop {
  opacity: 0;
  animation: fadeIn 0.4s 0.5s ease-in forwards;
  position: relative;
  margin: 0 auto;
  min-height: 2rem;
  width: 2rem;
  border-radius: 95% 15% 100% 0% / 100% 15% 95% 0%;
  border: solid 1px transparent;
  background: var(--success);
  rotate: -45deg;
  filter: drop-shadow(0 0 0.8em var(--success));
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

.display-container {
  max-width: 1200px;
  min-height: 500px;
  margin: 0 auto;
  margin-bottom: 5rem;
  position: relative;
  background-color: #05001900;
  border-radius: 30px;
}

.scrollable-content {
  opacity: 0;
  animation: fadeIn 0.4s 1.8s ease-in forwards;
  padding: 0 1em 0 1em;
  min-width: 1200px;
  max-height: 420px;
  overflow-y: auto;
  scrollbar-width: none;
}

::-webkit-scrollbar {
  background: transparent; /* Chrome/Safari/Webkit */
  width: 0px;
}

h1,
h2 {
  text-align: center;
}

.h2-2,
.h2-3 {
  margin-bottom: 2.5rem;
}

h1 {
  opacity: 0;
  font-size: 2.4rem;
  font-variant: small-caps;
  color: #fff;
  filter: drop-shadow(0 0 0.1em #fff);
  margin-top: 0rem;
  margin-bottom: 2rem;
  text-align: center;
  animation: fadeIn 0.4s 1s ease-in forwards;
}

h2 {
  opacity: 0;
  position: relative;
  margin-top: 2rem;
  font-size: 1.7rem;
  font-variant: small-caps;
  color: var(--success);
  filter: drop-shadow(0 0 0.1em var(--success));
  transition: 0.4s all;
}

.h2-1 {
  margin-top: 2.5rem;
}

h2::after {
  content: "";
  position: absolute;
  width: 2rem;
  min-height: 2rem;
  border-bottom: solid 4px var(--success);
  border-radius: 50%;
  filter: drop-shadow(0 0 0.05em var(--success));
  top: -3rem;
  right: 48.3%;
}

.responses {
  padding: 0 5em;
}

response-block {
  transition: filter 0.4s;
  text-align: center;
}

.dream-responses {
  opacity: 0;
  animation: fadeIn 0.4s 2.1s ease-in forwards;
}

.blur {
  filter: blur(3px);
}

.intention-text {
  min-width: 100%;
  min-height: 4rem;
  margin-bottom: 0;
}

.submit {
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

button {
  opacity: 0;
  animation: fadeIn 0.4s 3s ease-in forwards;
  display: block;
  margin: 0 auto;
  background: transparent;
  font: inherit;
  transition: 0.4s all;
  border: transparent;
}
</style>
