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
OC.declareComponents();
CC.declareComponents();
export const ChooseCeremony = new OC.ChooseCeremony();
let GetParticipants;
let GetThreshold;
let EncryptionMessage;

// Start Ceremony
async function startCeremony() {
  await $.loadWelcome;
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

  // The commented-out code below is for implementing a transition effect at the end when developing so there isn't an api call every time I want to test
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
  console.log($.shards);
  const DecryptionMessage = new CC.DecryptionMessage();
  $.replaceComponent(GetShards, DecryptionMessage);

  // Decryption + API call
  const mnemonic = await seedsplit.combine($.shards);
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
  // console.log("cleartext:", $.clearText);
  // console.log(cleartext.dp);
  // printAnswers(cleartext.d);
  // console.log(cleartext.cp);
  // printAnswers(cleartext.c);
  // console.log(cleartext.ep);
  // printAnswers(cleartext.e);

  await DecryptionMessage.transition;
  $.replaceComponent(DecryptionMessage, new CC.RevealIntentions());
}

function printAnswers(answers) {
  for (const answer of answers) {
    console.log(`\n${answer}\n`);
  }
}
