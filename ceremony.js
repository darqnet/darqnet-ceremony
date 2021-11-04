#!/usr/bin/env node

const { DID } = require('dids')
const { CeramicClient } = require('@ceramicnetwork/http-client')
const { TileDocument } = require('@ceramicnetwork/stream-tile')
const { Ed25519Provider } = require('key-did-provider-ed25519')
const KeyResolver = require('key-did-resolver')
const seedsplit = require('seedsplit')
const bip39 = require('bip39')

const API_URL = 'https://ceramic-private.3boxlabs.com'

const PARTICIPANTS = 4
const THREASHOLD = 3 //Math.floor(PARTICIPANTS / 2) + 1

async function all () {
  const mnemonic = bip39.generateMnemonic()
  const seed = new Uint8Array(bip39.mnemonicToSeedSync(mnemonic).slice(0, 32))
  const provider = new Ed25519Provider(seed)
  const did = new DID({ provider, resolver: KeyResolver.getResolver() })
  await did.authenticate()


  const c = 'Feel into the present moment is and condense it into a sentence.\n'
  let C = []
  const a = 'What is your biggest embarrassment in crypto?\n'
  let A = []
  const b = 'What is the future of the "metaverse"?\n'
  let B = []

  for (let i = 0; i < PARTICIPANTS; i++) {
    console.log('\033[2J');
    console.log('Welcome to Darqnet...\n')
    C.push(await prompt(c))
    A.push(await prompt(a))
    B.push(await prompt(b))
  }

  console.log('\033[2J');
  console.log('Encrypting intentions...')

  const ceramic = new CeramicClient(API_URL)
  ceramic.did = did
  const doc = await TileDocument.create(ceramic, null, { deterministic: true }, { anchor: false, publish: false })
  await ceramic.pin.add(doc.id)

  const jwe = await did.createDagJWE({
    a, b, c,
    A, B, C
  }, [did.id])
  await doc.update(jwe)

  writeStreamId(doc.id.toString())

  const shards = await seedsplit.split(mnemonic, PARTICIPANTS, THREASHOLD)

  for (const shard of shards) {
    await prompt('\n ~~~ Press enter when you are ready to copy your seed ~~~')
    console.log('\033[2J');
    console.log(shard)
    await prompt('\n ~~~ Press enter when you are done copying your seed ~~~')
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
  fs.writeFile('sermons/2021-10-30.darqnet', address, function(err) {
    if(err) {
      return console.log(err);
    }
  })
}
