import { reactive } from "vue";
import * as Bip39 from "bip39";
import { DID } from "dids";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from "key-did-resolver";
import * as seedsplit from "../js/seedsplit";
const API_URL = "https://ceramic-clay.3boxlabs.com";

export const store = reactive({
  // ceremony details
  ceremonyType: "",
  ceremonyChosen: false,
  createOpeningCeremony() {
    this.ceremonyChosen = true;
    console.log("Opening Ceremony chosen.");
    setTimeout(() => {
      this.ceremonyType = "open";
    }, 500);
  },
  createClosingCeremony() {
    this.ceremonyChosen = true;
    console.log("Closing Ceremony chosen.");
    setTimeout(() => {
      this.ceremonyType = "close";
    }, 500);
  },

  // participant and threshold
  participants: 0,
  participantLabel: 1,
  threshold: 0,
  acquiredPT: false,
  fadeOutPT() {
    this.acquiredPT = true;
    console.log(
      "participants:",
      this.participants,
      "threshold:",
      this.threshold
    );
    setTimeout(() => {
      this.beginIntentions = true;
    }, 500);
  },

  // shards
  saveShards(shards) {
    this.shards = shards;
    // console.log("Shards:", this.shards);
    // console.log("DID:", this.did);
  },

  // DID
  did: null,

  // intentions submission
  beginIntentions: false,
  acquiredIntentions: false,
  intentions: {
    dreams: [],
    conjurations: [],
    essence: [],
  },

  saveIntentions(d, c, e) {
    this.intentions.dreams.push(d);
    this.intentions.conjurations.push(c);
    this.intentions.essence.push(e);
    if (this.participantLabel < this.participants) {
      this.participantLabel++;
      this.rerender = !this.rerender; // trigger rerender of component
    } else if (this.participantLabel === this.participants) {
      this.acquiredIntentions = true;
      encryptShards(API_URL);
    }
    // if (this.intentions.dreams.length === this.participants) {
    //   console.log("Intentions:", this.intentions);
    // }
  },

  // trigger rerender of GetIntentions
  rerender: false,

  //*** Closing Ceremony ***
  acquiredThreshold: false,
  collectingShards: false,
  acquiredClosingShards: false,
  decryptionError: false,
  decryptionVisible: false,
  shardNumber: 1,

  saveThreshold(t) {
    this.threshold = t;
    this.acquiredThreshold = true;
    console.log("threshold:", this.threshold);
    setTimeout(() => {
      this.collectingShards = true;
    }, 600);
  },

  saveClosingShards(shard) {
    if (this.shards === undefined) {
      this.shards = [];
      this.shards.push(shard);
    } else {
      this.shards.push(shard);
    }
    if (this.shardNumber < this.threshold) {
      this.shardNumber++;
      this.rerender = !this.rerender;
    } else if (this.shardNumber === this.threshold) {
      this.acquiredClosingShards = true;
      this.collectingShards = false;
      decryptShards(API_URL);
    }
  },

  recollectShards() {
    // called if shard combination is incorrect to reset shard
    // collection state and UI
    setTimeout(() => {
      this.collectingShards = true;
      this.shards = undefined;
      this.shardNumber = 1;
      this.acquiredClosingShards = false;
      this.decryptionError = !this.decryptionError;
    }, 5500);
  },

  saveRetrievedIntentions(ct) {
    this.cleartext = ct;
    this.decryptionVisible = true;
    // console.log("Retrieved intentions:", this.cleartext);
    setTimeout(() => {
      this.decryptionVisible = false;
    }, 11500);
    setTimeout(() => {
      this.intentionsVisible = true;
    }, 12500);
  },

  showErrorMessage() {
    this.decryptionError = true;
  },
});

async function encryptShards(API_URL) {
  const ceramic = new CeramicClient(API_URL);
  ceramic.did = store.did;
  const doc = await TileDocument.create(
    ceramic,
    null,
    { deterministic: true },
    { anchor: false, publish: false }
  );

  const cp = "what will you conjure by the summer solstice?";
  const ep = "feel into the moment and capture its essence.";
  const dp = "what is your biggest dream for the new year?";
  const c = store.intentions.conjurations;
  const e = store.intentions.essence;
  const d = store.intentions.dreams;

  const jwe = await store.did.createDagJWE(
    {
      cp,
      ep,
      dp,
      c,
      e,
      d,
    },
    [store.did.id]
  );
  console.log(JSON.stringify(jwe));
  await doc.update(jwe);
}

async function decryptShards(API_URL) {
  const mnemonic = await seedsplit.combine(store.shards);
  const seed = new Uint8Array(Bip39.mnemonicToSeedSync(mnemonic).slice(0, 32));
  const provider = new Ed25519Provider(seed);
  const did = new DID({ provider, resolver: KeyResolver.getResolver() });
  await did.authenticate();
  const ceramic = new CeramicClient(API_URL);
  ceramic.did = did;
  const doc = await TileDocument.create(
    ceramic,
    null,
    { deterministic: true },
    { anchor: false, publish: false }
  );
  const jwe = doc.content;
  try {
    const cleartext = await did.decryptDagJWE(jwe);
    store.saveRetrievedIntentions(cleartext);
  } catch (err) {
    console.error("Incorrect shard combination.");
    store.showErrorMessage();
  }
}
