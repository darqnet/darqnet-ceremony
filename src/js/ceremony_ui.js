"use strict";

import { DID } from "dids";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from "key-did-resolver";
import * as seedsplit from "./seedsplit.js";
const bip39 = require("bip39");
import CP from "./components.js";

// const API_URL = "https://ceramic-private.3boxlabs.com"; (Original API link used, throws CORS Error if used in browser)
const API_URL = "https://ceramic-clay.3boxlabs.com";

// Register Components
CP.declareComponents();
const choose_cer__cmpt = new CP.chooseCeremony();
const get_participants__cmpt = new CP.getParticipants();

// Global Vars
const ceremonyContainer = document.querySelector(".ceremonyContainer");
let participants;
let threshold;
const dreams = [];
const conjurations = [];
const essence = [];
const dreamPrompt = "What is your biggest dream for the new year?";
const conjurationPrompt = "What will you conjure by the summer solstice?";
const essencePrompt = "Feel into the moment and capture its essence!";

// Loads the initial fade-in welcome message
const loadWelcome = new Promise((resolve, reject) => {
  setTimeout(() => {
    try {
      CP.welcome.replaceWith(choose_cer__cmpt);
      resolve(true);
    } catch (err) {
      reject(err);
    }
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

async function startCeremony() {
  let choose_cer__html;
  const loaded = await loadWelcome;
  if (loaded) {
    choose_cer__html = document.querySelector("choose-ceremony");
  }

  const ceremonyType = await choose_cer__cmpt.selection;
  console.log("selection:", choose_cer__cmpt.selection);
  if (ceremonyType === "open") {
    console.log("open.");
    replaceComponent(choose_cer__html, get_participants__cmpt);
    setTimeout(() => {
      get_participants__cmpt.setPlaceholder("How many have gathered? ");
    }, 1000);
    await openCircle();
  } else if (ceremonyType === "close") {
    console.log("closing.");
    // await closeCircle();
  }
  // console.log("Ceremonial sequence end");
}

startCeremony();

async function openCircle() {
  const mnemonic = bip39.generateMnemonic();
  const seed = new Uint8Array(bip39.mnemonicToSeedSync(mnemonic).slice(0, 32));
  const provider = new Ed25519Provider(seed);
  const did = new DID({ provider, resolver: KeyResolver.getResolver() });
  await did.authenticate();

  await get_participants__cmpt.participantCount;
  participants = parseInt(get_participants__cmpt.input_num);
  console.log("participants:", participants);
  threshold = parseInt(await get_participants__cmpt.thresholdSize);
  console.log("threshold:", threshold);
  const shards = await seedsplit.split(mnemonic, participants, threshold);

  for (let i = 0; i < participants; i++) {
    const userInput = new CP.getConjurations();
    replaceComponent(ceremonyContainer.childNodes[1], userInput);

    setTimeout(() => {
      userInput.setPlaceholder(" What is your biggest dream for the new year?");
    }, 1000);
    await userInput.acquire_entries;
    userInput.input_dream.forEach((i) => dreams.push(i));
    userInput.input_conjuration.forEach((i) => conjurations.push(i));
    userInput.input_essence.forEach((i) => essence.push(i));
    console.log("dreams (UI):", dreams);
    console.log("conjurations (UI):", conjurations);
    console.log("essence (UI):", essence);
    console.log(`Person ${i + 1}:\n${shards[i]}`);
    const seedphraseDisplay = new CP.seedphraseDisplay(shards[i]);
    replaceComponent(ceremonyContainer.childNodes[1], seedphraseDisplay);
    await seedphraseDisplay.acceptPhrase;
  }

  replaceComponent(ceremonyContainer.childNodes[1], new CP.encryptionMessage());

  const ceramic = new CeramicClient(API_URL);
  ceramic.did = did;
  const doc = await TileDocument.create(
    ceramic,
    null,
    { deterministic: true },
    { anchor: false, publish: false }
  );

  // Error thrown here: 'ceramic.pin is undefined'
  // encryption doesn't go through until this is resolved
  await ceramic.pin.add(doc.id);

  const jwe = await did.createDagJWE(
    {
      conjurationPrompt,
      essencePrompt,
      dreamPrompt,
      conjurations,
      essence,
      dreams,
    },
    [did.id]
  );
  console.log(JSON.stringify(jwe));
  await doc.update(jwe);
}
// async function openCircle() {
//   const mnemonic = bip39.generateMnemonic();
//   const seed = new Uint8Array(bip39.mnemonicToSeedSync(mnemonic).slice(0, 32));
//   const provider = new Ed25519Provider(seed);
//   const did = new DID({ provider, resolver: KeyResolver.getResolver() });
//   await did.authenticate();
//   const participants = parseInt(await prompt("How many has gathered?\n"));
//   if (isNaN(participants)) return;
//   const threshold = parseInt(
//     await prompt("How large shall your threshold be?\n")
//   );
//   if (isNaN(threshold)) return;
//   const shards = await seedsplit.split(mnemonic, participants, threshold);

//   const c = "> What is your biggest dream for the new year?\n";
//   let C = [];
//   const a = "> What will you conjure by the summer solstice?\n";
//   let A = [];
//   const b = "> Feel into the this moment and caputre its essence!\n";
//   let B = [];

//   for (let i = 0; i < participants; i++) {
//     console.clear();
//     console.log("Welcome to Darqnet...\n");
//     C.push(await prompt(c));
//     A.push(await prompt(a));
//     B.push(await prompt(b));
//     await prompt("\n ~~~ Press enter when you are ready to copy your seed ~~~");
//     console.log(shards[i]);
//     await prompt("\n ~~~ Press enter when you are done copying your seed ~~~");
//     console.clear();
//   }

//   console.clear();
//   console.log("Encrypting intentions...");

//   const ceramic = new CeramicClient(API_URL);
//   ceramic.did = did;
//   const doc = await TileDocument.create(
//     ceramic,
//     null,
//     { deterministic: true },
//     { anchor: false, publish: false }
//   );
//   await ceramic.pin.add(doc.id);

//   const jwe = await did.createDagJWE(
//     {
//       a,
//       b,
//       c,
//       A,
//       B,
//       C,
//     },
//     [did.id]
//   );
//   console.log(JSON.stringify(jwe));
//   await doc.update(jwe);

//   writeStreamId(doc.id.toString());
// }

// async function closeCircle() {
//   const shards = [];
//   const threshold = parseInt(
//     await prompt("What was the threshold of your opening ceremony?\n")
//   );
//   if (isNaN(threshold)) return;
//   for (let i = 0; i < threshold; i++) {
//     console.clear();
//     shards.push(await prompt(`Enter your shard (${i}):\n`));
//   }
//   const mnemonic = await seedsplit.combine(shards);
//   const seed = new Uint8Array(bip39.mnemonicToSeedSync(mnemonic).slice(0, 32));
//   const provider = new Ed25519Provider(seed);
//   const did = new DID({ provider, resolver: KeyResolver.getResolver() });
//   await did.authenticate();
//   console.log("did", did.id);

//   const ceramic = new CeramicClient(API_URL);
//   ceramic.did = did;
//   // const streamid = await prompt('Enter streamid:\n')
//   // const doc = await TileDocument.load(ceramic, streamid)
//   const doc = await TileDocument.create(
//     ceramic,
//     null,
//     { deterministic: true },
//     { anchor: false, publish: false }
//   );
//   console.log(doc.content);
//   const jwe = doc.content;

//   const cleartext = await did.decryptDagJWE(jwe);
//   console.clear();
//   console.log(cleartext.a);
//   printAnswers(cleartext.A);
//   console.log(cleartext.b);
//   printAnswers(cleartext.B);
//   console.log(cleartext.c);
//   printAnswers(cleartext.C);
// }

// function printAnswers(answers) {
//   for (const answer of answers) {
//     console.log(`\n${answer}\n`);
//   }
// }

// function prompt(question) {
//   return new Promise((resolve, reject) => {
//     const { stdin, stdout } = process;

//     stdin.resume();
//     stdout.write("\n" + question);

//     const stdinHandler = (data) => {
//       stdin.off("data", stdinHandler);
//       stdin.off("error", errorHandler);
//       resolve(data.toString().trim());
//     };
//     const errorHandler = (err) => {
//       stdin.off("data", stdinHandler);
//       stdin.off("error", errorHandler);
//       reject(err);
//     };

//     stdin.on("data", stdinHandler);
//     stdin.on("error", errorHandler);
//   });
// }
