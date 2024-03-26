<script setup></script>

<template>
  <div class="teardrop-wrap">
    <div class="teardrop"></div>
  </div>
  <h2>darqnet is designed for larger screens.</h2>
</template>

<style scoped>
.teardrop-wrap {
  margin: 0 auto;
  min-height: 2rem;
  width: 2rem;
  filter: blur(0.025rem);
}

.teardrop {
  opacity: 1;
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

h2 {
  text-align: center;
  margin-top: 3.5rem;
}
</style>
