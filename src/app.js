"use strict";

import { DID } from "dids";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from "key-did-resolver";
import * as seedsplit from "./js/seedsplit.js";
import * as Bip39 from "bip39";
import CP from "./js/components.js";
import $ from "./js/stores.js";

const API_URL = "https://ceramic-clay.3boxlabs.com";

// Register Components
CP.declareComponents();
export const choose_cer__cmpt = new CP.chooseCeremony();
const get_participants__cmpt = new CP.getParticipants();
let encryptionMessage__cmpt;

// Start Ceremony
async function startCeremony() {
  let choose_cer__html;
  const loaded = await $.loadWelcome;
  if (loaded) {
    choose_cer__html = document.querySelector("choose-ceremony");
  }
  const ceremonyType = await choose_cer__cmpt.selection;
  if (ceremonyType === "open") {
    console.log("opening ceremony.");
    $.replaceComponent(choose_cer__html, get_participants__cmpt);
    setTimeout(() => {
      get_participants__cmpt.input.focus();
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
  const mnemonic = Bip39.generateMnemonic();
  const seed = new Uint8Array(Bip39.mnemonicToSeedSync(mnemonic).slice(0, 32));
  const provider = new Ed25519Provider(seed);
  const did = new DID({ provider, resolver: KeyResolver.getResolver() });
  await did.authenticate();

  await get_participants__cmpt.acquiredPT;
  console.log("participants:", $.participants, "threshold:", $.threshold);
  const shards = await seedsplit.split(mnemonic, $.participants, $.threshold);

  for (let i = 0; i < $.participants; i++) {
    const userInput = new CP.getConjurations(i);
    $.replaceComponent(CP.ceremonyContainer.childNodes[1], userInput);
    setTimeout(() => {
      userInput.setPlaceholder(" What is your biggest dream for the new year?");
    }, 1000);
    await userInput.acquire_entries;
    console.log("%cState:", "color: #fe84fe; font-weight: bold;");
    console.log(
      "Dreams",
      $.dreams,
      "Conjurations",
      $.conjurations,
      "Essence",
      $.essence
    );
    console.log(`Participant ${i + 1}:\n${shards[i]}`);
    const seedphraseDisplay = new CP.seedphraseDisplay(shards[i]);
    $.replaceComponent(CP.ceremonyContainer.childNodes[1], seedphraseDisplay);
    await seedphraseDisplay.acceptPhrase;
  }

  encryptionMessage__cmpt = new CP.encryptionMessage();
  $.replaceComponent(
    CP.ceremonyContainer.childNodes[1],
    encryptionMessage__cmpt
  );

  // const ceramic = new CeramicClient(API_URL);
  // ceramic.did = did;
  // const doc = await TileDocument.create(
  //   ceramic,
  //   null,
  //   { deterministic: true },
  //   { anchor: false, publish: false }
  // );

  // const cp = $.conjurationPrompt;
  // const ep = $.essencePrompt;
  // const dp = $.dreamPrompt;
  // const c = $.conjurations;
  // const e = $.essence;
  // const d = $.dreams;

  // const jwe = await did.createDagJWE(
  //   {
  //     cp,
  //     ep,
  //     dp,
  //     c,
  //     e,
  //     d,
  //   },
  //   [did.id]
  // );
  // console.log(JSON.stringify(jwe));
  // await doc.update(jwe);

  // The commented-out code below is for implementing a transition effect at the end when developing so there isn't an api call every time I want to test
  // (comment out the api interaction when testing)
  // {
  const transition = new Promise((resolve) => {
    setTimeout(() => {
      console.log("transitioning");
      resolve("transitioning");
    }, 10500);
  });

  await transition;
  // }
  encryptionMessage__cmpt.encryptionComplete();
}

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
