"use strict";

// Shared State
const state = {
  participants: undefined,
  threshold: undefined,
  thresholdClose: undefined,
  clearText: undefined,
  dreams: [],
  conjurations: [],
  essence: [],
  shards: [],
};

// Smoothly transitions between components
function replaceComponent(current, replacement) {
  current.style.opacity = 0;
  current.style.transitionDuration = "1s";
  setTimeout(() => {
    current.replaceWith(replacement);
  }, 1000);
}

// Prompt Text for Closing Ceremony Reconstruction
const dreamPrompt = "What is your biggest dream for the new year?";
const conjurationPrompt = "What will you conjure by the summer solstice?";
const essencePrompt = "Feel into the moment and capture its essence!";

export default {
  ...state,
  replaceComponent,
  dreamPrompt,
  conjurationPrompt,
  essencePrompt,
};
