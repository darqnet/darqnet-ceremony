"use strict";

import { DID } from "dids";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from "key-did-resolver";
import * as seedsplit from "./js/seedsplit.js";
import * as Bip39 from "bip39";
import OC from "./js/lib/openingComponents.js";
import CC from "./js/lib/closingComponents.js";
import $ from "./js/stores.js";

const API_URL = "https://ceramic-clay.3boxlabs.com";

// Register Components

// opening
customElements.define("choose-ceremony", OC.ChooseCeremony);
customElements.define("participant-input", OC.GetParticipants);
customElements.define("conjuration-input", OC.GetConjurations);
customElements.define("seedphrase-display", OC.SeedphraseDisplay);
customElements.define("encryption-message", OC.EncryptionMessage);

// closing
customElements.define("threshold-input", CC.GetThreshold);
customElements.define("shard-input", CC.GetShards);
customElements.define("reveal-intentions", CC.RevealIntentions);
customElements.define("response-block", CC.ResponseBlock);
customElements.define("decryption-message", CC.DecryptionMessage);

const ChooseCeremony = new OC.ChooseCeremony();
// these next two lines ensure these elements aren't undefined
OC.welcome;
ChooseCeremony;

let GetParticipants;
let GetThreshold;
let EncryptionMessage;

// Loads the initial fade-in welcome message
const loadWelcome = new Promise((resolve) => {
  setTimeout(() => {
    const mask = document.querySelector(".background-mask");
    mask.style.opacity = 1;
    OC.welcome.replaceWith(ChooseCeremony);
    resolve(true);
    console.clear();
    console.log("Welcome to Darqnet 🔮");
  }, 7500);
});

// Start Ceremony
async function startCeremony() {
  await loadWelcome;
  const ceremonyType = await ChooseCeremony.selection;
  if (ceremonyType === "open") {
    console.log("opening ceremony.");
    GetParticipants = new OC.GetParticipants();
    $.replaceComponent(ChooseCeremony, GetParticipants);
    await openCircle();
  } else if (ceremonyType === "close") {
    console.log("closing ceremony.");
    GetThreshold = new CC.GetThreshold();
    $.replaceComponent(ChooseCeremony, GetThreshold);
    await closeCircle();
  }
  console.log("Ceremony Complete.");
}

startCeremony();

async function openCircle() {
  const mnemonic = Bip39.generateMnemonic();
  const seed = new Uint8Array(Bip39.mnemonicToSeedSync(mnemonic).slice(0, 32));
  const provider = new Ed25519Provider(seed);
  const did = new DID({ provider, resolver: KeyResolver.getResolver() });
  await did.authenticate();

  await GetParticipants.acquiredPT;
  console.log("participants:", $.participants, "threshold:", $.threshold);
  const shards = await seedsplit.split(mnemonic, $.participants, $.threshold);

  for (let i = 0; i < $.participants; i++) {
    const userInput = new OC.GetConjurations(i);
    $.replaceComponent(OC.ceremonyContainer.childNodes[1], userInput);
    setTimeout(() => {
      userInput.input.focus();
    }, 3600);
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
    const seedphraseDisplay = new OC.SeedphraseDisplay(shards[i]);
    $.replaceComponent(OC.ceremonyContainer.childNodes[1], seedphraseDisplay);
    await seedphraseDisplay.acceptPhrase;
  }

  EncryptionMessage = new OC.EncryptionMessage();
  $.replaceComponent(OC.ceremonyContainer.childNodes[1], EncryptionMessage);

  const ceramic = new CeramicClient(API_URL);
  ceramic.did = did;
  const doc = await TileDocument.create(
    ceramic,
    null,
    { deterministic: true },
    { anchor: false, publish: false }
  );

  const cp = $.conjurationPrompt;
  const ep = $.essencePrompt;
  const dp = $.dreamPrompt;
  const c = $.conjurations;
  const e = $.essence;
  const d = $.dreams;

  const jwe = await did.createDagJWE(
    {
      cp,
      ep,
      dp,
      c,
      e,
      d,
    },
    [did.id]
  );
  console.log(JSON.stringify(jwe));
  await doc.update(jwe);

  // Tests transition without posting to Ceramic server
  // *
  // *
  // (comment out the api interaction when testing)
  // {
  // const transition = new Promise((resolve) => {
  //   setTimeout(() => {
  //     console.log("transitioning");
  //     resolve("transitioning");
  //   }, 5000);
  // });

  // await transition;
  // }
  EncryptionMessage.encryptionComplete();
}

async function closeCircle() {
  await GetThreshold.acquiredThreshold;
  console.log("threshold:", $.thresholdClose);
  const GetShards = new CC.GetShards();
  $.replaceComponent(GetThreshold, GetShards);
  setTimeout(() => {
    GetShards.input.focus();
  }, 1000);
  await GetShards.collectShards;
  // console.log($.shards);

  // Decryption + API call
  const mnemonic = await seedsplit.combine($.shards);
  const DecryptionMessage = new CC.DecryptionMessage();
  $.replaceComponent(GetShards, DecryptionMessage);
  const seed = new Uint8Array(Bip39.mnemonicToSeedSync(mnemonic).slice(0, 32));
  const provider = new Ed25519Provider(seed);
  const did = new DID({ provider, resolver: KeyResolver.getResolver() });
  await did.authenticate();
  console.log("did", did.id);
  const ceramic = new CeramicClient(API_URL);
  ceramic.did = did;
  const doc = await TileDocument.create(
    ceramic,
    null,
    { deterministic: true },
    { anchor: false, publish: false }
  );
  console.log(doc.content);
  const jwe = doc.content;
  const cleartext = await did.decryptDagJWE(jwe);
  $.clearText = cleartext;

  await DecryptionMessage.transition;
  $.replaceComponent(DecryptionMessage, new CC.RevealIntentions());
}
