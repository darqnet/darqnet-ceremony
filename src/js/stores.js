"use strict";

import OC from "./lib/openingComponents.js";
import { choose_cer__cmpt } from "../app.js";

// Shared State
let participants;
let threshold;
let thresholdClose;
let clearText;
const dreams = [];
const conjurations = [];
const essence = [];
const shards = [];

// Helper functions for app.js
// *
// *
// Loads the initial fade-in welcome message
const loadWelcome = new Promise((resolve) => {
  setTimeout(() => {
    OC.welcome.replaceWith(choose_cer__cmpt);
    resolve(true);
    console.clear();
    console.log("Welcome to Darqnet 🔮");
  }, 7500);
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
  thresholdClose,
  clearText,
  dreams,
  conjurations,
  essence,
  shards,
  loadWelcome,
  replaceComponent,
  dreamPrompt,
  conjurationPrompt,
  essencePrompt,
};
