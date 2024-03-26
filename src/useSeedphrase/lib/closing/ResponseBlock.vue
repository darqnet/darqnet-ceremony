<script setup>
const props = defineProps(["participantNumber", "intention"]);
</script>

<template>
  <div class="response-block">
    <p class="participant-label">participant {{ props.participantNumber }}</p>
    <p class="intention-text">{{ props.intention }}</p>
  </div>
</template>

<style scoped>
.response-block {
  text-align: center;
  opacity: 0;
  animation: fadeIn 0.4s 2s ease-in forwards;
  position: relative;
  margin-bottom: 3rem;
  padding-right: 2em;
  padding-left: 2em;
  border-radius: 100px;
  border-right: solid 1px #04eca3ad;
  border-left: solid 1px #04eca3ad;
  transition: 0.3s all;
}

p.participant-label {
  font-size: 1.8rem;
  color: #6486ff;
  filter: drop-shadow(0 0 0.1em #6486ff);
  padding-right: 1.1em;
}

.intention-text {
  font-family: "IM Fell DW Pica", serif;
  font-size: 1.3rem;
  min-width: 100%;
  min-height: 2.5rem;
  padding-bottom: 1.5em;
  position: relative;
  z-index: 1;
}
</style>
