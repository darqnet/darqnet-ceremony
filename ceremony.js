#!/usr/bin/env node

const { DID } = require('dids')
const { CeramicClient } = require('@ceramicnetwork/http-client')
const { TileDocument } = require('@ceramicnetwork/stream-tile')
const { Ed25519Provider } = require('key-did-provider-ed25519')
const KeyResolver = require('key-did-resolver')
const seedsplit = require('seedsplit')
const bip39 = require('bip39')

const API_URL = 'https://ceramic-private.3boxlabs.com'

async function all () {
  const mnemonic = bip39.generateMnemonic()
  const seed = new Uint8Array(bip39.mnemonicToSeedSync(mnemonic).slice(0, 32))
  const provider = new Ed25519Provider(seed)
  const did = new DID({ provider, resolver: KeyResolver.getResolver() })
  await did.authenticate()


  const c = 'Feel into what the darqnet is and condense it into a sentence.\n'
  let C = []
  const a = 'Express your intuition about the future of darqnet?\n'
  let A = []
  const b = 'What is your intention to bring forth into darqnet?\n'
  let B = []

  const numQnetians = 2
  //const numQnetians = 1
  for (let i = 0; i < numQnetians; i++) {
    console.log('\033[2J');
    C.push(await prompt(c))
    A.push(await prompt(a))
    B.push(await prompt(b))
  }

  console.log('\033[2J');

  const ceramic = new CeramicClient(API_URL)
  ceramic.did = did
  const doc = await TileDocument.create(ceramic, null, { deterministic: true }, { anchor: false, publish: false })

  await doc.update({
    a, b, c,
    A, B, C
  })

  writeStreamId(doc.id.toString())

  const shards = await seedsplit.split(mnemonic, 4, 3)

  for (const shard of shards) {
    await prompt('\n ~~~ Press enter when you are ready to copy the seed ~~~')
    console.log('\033[2J');
    console.log(shard)
    await prompt('\n ~~~ Press enter when you are done copying the seed ~~~')
    console.log('\033[2J');
  }
  console.log('\033[2J')
  console.log('Ceremonial sequence end')
}

all()

function prompt(question) {
  return new Promise((resolve, reject) => {
    const { stdin, stdout } = process

    stdin.resume()
    stdout.write('\n' + question)

    stdin.on('data', data => resolve(data.toString().trim()))
    stdin.on('error', err => reject(err))
  })
}

function writeStreamId (address) {
  var fs = require('fs');
  fs.writeFile('darqnet-root', address, function(err) {
    if(err) {
      return console.log(err);
    }
  })
}
