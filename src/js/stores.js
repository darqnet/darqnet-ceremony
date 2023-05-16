"use strict";

import CP from "./components.js";
import { choose_cer__cmpt } from "../app.js";

// Shared State
let participants;
let threshold;
const dreams = [];
const conjurations = [];
const essence = [];

// Helper functions for app.js
// *
// *
// Loads the initial fade-in welcome message
const loadWelcome = new Promise((resolve) => {
  setTimeout(() => {
    CP.ripple.style.opacity = "1";
  }, 3000);
  setTimeout(() => {
    CP.welcome.replaceWith(choose_cer__cmpt);
    resolve(true);
    console.log("Welcome to Darqnet 🔮");
  }, 6000);
});
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
  participants,
  threshold,
  dreams,
  conjurations,
  essence,
  loadWelcome,
  replaceComponent,
  dreamPrompt,
  conjurationPrompt,
  essencePrompt,
};
