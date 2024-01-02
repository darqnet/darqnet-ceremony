#!/usr/bin/env node

import { DID } from "dids";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from "key-did-resolver";
import * as seedsplit from "./seedsplit.js";
import bip39 from "bip39";

const API_URL = "https://ceramic-private.3boxlabs.com";

async function openCircle() {
  const mnemonic = bip39.generateMnemonic();
  const seed = new Uint8Array(bip39.mnemonicToSeedSync(mnemonic).slice(0, 32));
  const provider = new Ed25519Provider(seed);
  const did = new DID({ provider, resolver: KeyResolver.getResolver() });
  await did.authenticate();
  const participants = parseInt(await prompt("How many has gathered?\n"));
  if (isNaN(participants)) return;
  const threshold = parseInt(
    await prompt("How large shall your threshold be?\n")
  );
  if (isNaN(threshold)) return;
  const shards = await seedsplit.split(mnemonic, participants, threshold);

  const c = "> What is your biggest dream for the new year?\n";
  let C = [];
  const a = "> What will you conjure by the summer solstice?\n";
  let A = [];
  const b = "> Feel into the this moment and caputre its essence!\n";
  let B = [];

  for (let i = 0; i < participants; i++) {
    console.clear();
    console.log("Welcome to Darqnet...\n");
    C.push(await prompt(c));
    A.push(await prompt(a));
    B.push(await prompt(b));
    await prompt("\n ~~~ Press enter when you are ready to copy your seed ~~~");
    console.log(shards[i]);
    await prompt("\n ~~~ Press enter when you are done copying your seed ~~~");
    console.clear();
  }

  console.clear();
  console.log("Encrypting intentions...");

  const ceramic = new CeramicClient(API_URL);
  ceramic.did = did;
  const doc = await TileDocument.create(
    ceramic,
    null,
    { deterministic: true },
    { anchor: false, publish: false }
  );
  await ceramic.pin.add(doc.id);

  const jwe = await did.createDagJWE(
    {
      a,
      b,
      c,
      A,
      B,
      C,
    },
    [did.id]
  );
  console.log(JSON.stringify(jwe));
  await doc.update(jwe);

  writeStreamId(doc.id.toString());
}

async function closeCircle() {
  const shards = [];
  const threshold = parseInt(
    await prompt("What was the threshold of your opening ceremony?\n")
  );
  if (isNaN(threshold)) return;
  for (let i = 0; i < threshold; i++) {
    console.clear();
    shards.push(await prompt(`Enter your shard (${i}):\n`));
  }
  const mnemonic = await seedsplit.combine(shards);
  const seed = new Uint8Array(bip39.mnemonicToSeedSync(mnemonic).slice(0, 32));
  const provider = new Ed25519Provider(seed);
  const did = new DID({ provider, resolver: KeyResolver.getResolver() });
  await did.authenticate();
  console.log("did", did.id);

  const ceramic = new CeramicClient(API_URL);
  ceramic.did = did;
  // const streamid = await prompt('Enter streamid:\n')
  // const doc = await TileDocument.load(ceramic, streamid)
  const doc = await TileDocument.create(
    ceramic,
    null,
    { deterministic: true },
    { anchor: false, publish: false }
  );
  console.log(doc.content);
  const jwe = doc.content;

  const cleartext = await did.decryptDagJWE(jwe);
  console.clear();
  console.log(cleartext.a);
  printAnswers(cleartext.A);
  console.log(cleartext.b);
  printAnswers(cleartext.B);
  console.log(cleartext.c);
  printAnswers(cleartext.C);
}

function printAnswers(answers) {
  for (const answer of answers) {
    console.log(`\n${answer}\n`);
  }
}

async function startCeremony() {
  console.clear();
  console.log("Welcome to Darqnet...\n");
  const ceremonyType = await prompt(
    "Is this an [o]pening or [c]losing ceremony?\n"
  );
  if (ceremonyType === "o") {
    await openCircle();
  } else if (ceremonyType === "c") {
    await closeCircle();
  }
  console.log("Ceremonial sequence end");
}

startCeremony();

function prompt(question) {
  return new Promise((resolve, reject) => {
    const { stdin, stdout } = process;

    stdin.resume();
    stdout.write("\n" + question);

    const stdinHandler = (data) => {
      stdin.off("data", stdinHandler);
      stdin.off("error", errorHandler);
      resolve(data.toString().trim());
    };
    const errorHandler = (err) => {
      stdin.off("data", stdinHandler);
      stdin.off("error", errorHandler);
      reject(err);
    };

    stdin.on("data", stdinHandler);
    stdin.on("error", errorHandler);
  });
}

function writeStreamId(address) {
  var fs = require("fs");
  fs.writeFile(
    `sermons/${new Date().toISOString()}.darqnet`,
    address,
    function (err) {
      if (err) {
        return console.log(err);
      }
    }
  );
}
