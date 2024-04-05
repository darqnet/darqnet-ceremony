<script setup>
import { onMounted } from "vue";
import { store } from "../store";
let openBtn;
let closeBtn;
let teardrop;
let flames;
onMounted(() => {
  teardrop = document.querySelector(".teardrop");
  flames = Array.from(document.querySelectorAll(".flame"));
});

function openFlamesMouseOver() {
  flames.map((e) => {
    e.style.background = "var(--open-circle)";
    e.style.filter = "drop-shadow(0 0 0.8em var(--open-circle))";
  });
  teardrop.style.background = "var(--open-circle)";
  teardrop.style.filter = "drop-shadow(0 0 0.8em var(--open-circle))";
  teardrop.style.transform = "rotate(15deg)";
}

function openFlamesMouseOut() {
  flames.map((e) => {
    e.style.background = "var(--flame-color)";
    e.style.filter = "drop-shadow(0 0 0.8em #6c85f9)";
  });
  teardrop.style.background = "#fff";
  teardrop.style.filter = "drop-shadow(0 0 0.5em #fff)";
  teardrop.style.transform = "rotate(0deg)";
}

function closeFlamesMouseOver() {
  flames.map((e) => {
    e.style.background = "var(--close-circle)";
    e.style.filter = "drop-shadow(0 0 0.8em var(--close-circle))";
  });
  teardrop.style.background = "var(--close-circle)";
  teardrop.style.filter = "drop-shadow(0 0 0.8em var(--close-circle))";
  teardrop.style.transform = "rotate(-15deg)";
}

function closeFlamesMouseOut() {
  flames.map((e) => {
    e.style.background = "var(--flame-color)";
    e.style.filter = "drop-shadow(0 0 0.8em #6c85f9)";
  });
  teardrop.style.background = "#fff";
  teardrop.style.filter = "drop-shadow(0 0 0.5em #fff";
  teardrop.style.transform = "rotate(0deg)";
}
</script>

<template>
  <div class="container">
    <div class="teardrop-wrap">
      <div class="teardrop"></div>
    </div>
    <div class="row selection-options">
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
    <div class="selection-buttons">
      <button
        v-bind="openBtn"
        @mouseover="openFlamesMouseOver"
        @mouseout="openFlamesMouseOut"
        @click="store.createOpeningCeremony()"
        class="btn btn-open"
      >
        opening ceremony
      </button>
      <button
        v-bind="closeBtn"
        @mouseover="closeFlamesMouseOver"
        @mouseout="closeFlamesMouseOut"
        @click="store.createClosingCeremony()"
        class="btn btn-close"
      >
        closing ceremony
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  margin: 0 auto;
  width: 100%;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.selection-options {
  opacity: 0;
  animation: fadeIn 0.2s 0.6s ease-in forwards;
  gap: 0rem;
  margin-top: 2rem;
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
  background: var(--flame-color);
  filter: drop-shadow(0 0 0.8em #6c85f9);
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

.selection-buttons {
  display: flex;
  gap: 6.5rem;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  margin: 0 auto;
  margin-top: 8.5rem;
}

.btn {
  opacity: 0;
  animation: fadeIn 0.4s 2.2s ease-in forwards;
  color: #fff;
  font: inherit;
  font-family: "IM Fell Double Pica SC", serif;
  text-align: center;
  font-size: 2.2rem;
  font-weight: 700;
  font-variant: small-caps;
  display: block;
  transition: 0.4s all;
  backdrop-filter: drop-shadow(0 0 0.5em var(--flame-color));
  text-shadow: 0 0 0.7em var(--flame-color);
  border: solid 1px #1942f931;
  padding: 0.15em 0.4em;
  border-radius: 15px;
  background-color: #05062ba2;
}

.btn:hover,
.btn:focus {
  cursor: pointer;
  color: #999999;
  outline: transparent;
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
  animation: fadeIn 0.4s 1.8s ease-in forwards;
  position: relative;
  margin: 0 auto;
  min-height: 2rem;
  width: 2rem;
  border-radius: 95% 15% 100% 0% / 100% 15% 95% 0%;
  border: solid 1px transparent;
  background: #fff;
  rotate: -45deg;
  filter: drop-shadow(0 0 0.5em #fff);
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

@keyframes fadeIn {
  100% {
    opacity: 1;
  }
}

@media screen and (-webkit-min-device-pixel-ratio: 0) {
  /* Safari and Chrome */
  .btn {
    font-size: 2.5rem;
  }
}

@-moz-document url-prefix() {
  /* Firefox */
  .btn {
    font-size: 2.2rem;
  }
}
</style>
