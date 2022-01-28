#!/usr/bin/env node

const { DID } = require('dids')
const { CeramicClient } = require('@ceramicnetwork/http-client')
const { TileDocument } = require('@ceramicnetwork/stream-tile')
const { Ed25519Provider } = require('key-did-provider-ed25519')
const KeyResolver = require('key-did-resolver')
const seedsplit = require('seedsplit')
const bip39 = require('bip39')

const API_URL = 'https://ceramic-private.3boxlabs.com'

async function openCircle () {
  const mnemonic = bip39.generateMnemonic()
  const seed = new Uint8Array(bip39.mnemonicToSeedSync(mnemonic).slice(0, 32))
  const provider = new Ed25519Provider(seed)
  const did = new DID({ provider, resolver: KeyResolver.getResolver() })
  await did.authenticate()
  const participants = parseInt(await prompt('How many has gathered?\n'))
  if (isNaN(participants)) return
  const threshold = parseInt(await prompt('How large shall your threshold be?\n'))
  if (isNaN(threshold)) return
  const shards = await seedsplit.split(mnemonic, participants, threshold)


  const c = 'Feel into the uniqueness of our team and condense it into a sentence.\n'
  let C = []
  const a = 'What about yourself do you want to change durind this ceremonial cycle?\n'
  let A = []
  const b = 'What big event will drive Ceramic adoption this ceremonial cycle?\n'
  let B = []

  for (let i = 0; i < participants; i++) {
    console.log('\033[2J');
    console.log('Welcome to Darqnet...\n')
    C.push(await prompt(c))
    A.push(await prompt(a))
    B.push(await prompt(b))
    await prompt('\n ~~~ Press enter when you are ready to copy your seed ~~~')
    console.log(shards[i])
    await prompt('\n ~~~ Press enter when you are done copying your seed ~~~')
    console.log('\033[2J');
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
  console.log(JSON.stringify(jwe))
  await doc.update(jwe)

  writeStreamId(doc.id.toString())
}

async function closeCircle () {
  const shards = []
  const threshold = parseInt(await prompt('What was the threshold of your opening ceremony?\n'))
  if (isNaN(threshold)) return
  for (let i = 0; i < threshold; i++) {
    console.log('\033[2J');
    shards.push(await prompt(`Enter your shard (${i}):\n`))
  }
  const mnemonic = await seedsplit.combine(shards)
  const seed = new Uint8Array(bip39.mnemonicToSeedSync(mnemonic).slice(0, 32))
  const provider = new Ed25519Provider(seed)
  const did = new DID({ provider, resolver: KeyResolver.getResolver() })
  await did.authenticate()
  console.log('did', did.id)

  const jwe = JSON.parse(await prompt('Enter JWE:\n'))
  // TODO - get JWE from Ceramic
  //const doc = await TileDocument.create(ceramic, null, { deterministic: true }, { anchor: false, publish: false })
  //const jwe = doc.content

  const cleartext = await did.decryptDagJWE(jwe)
  console.log('\033[2J');
  console.log(cleartext.a)
  printAnswers(cleartext.A)
  console.log(cleartext.b)
  printAnswers(cleartext.B)
  console.log(cleartext.c)
  printAnswers(cleartext.C)
}

function printAnswers (answers) {
  for (const answer of answers) {
    console.log(`\n${answer}\n`)
  }
}

async function startCeremony () {
  console.log('\033[2J');
  console.log('Welcome to Darqnet...\n')
  const ceremonyType = await prompt('Is this an [o]pening or [c]losing ceremony?\n')
  if (ceremonyType === 'o') {
    await openCircle()
  } else if (ceremonyType === 'c') {
    await closeCircle()
  }
  console.log('Ceremonial sequence end')
}


startCeremony()

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
  fs.writeFile(`sermons/${new Date().toISOString()}.darqnet`, address, function(err) {
    if(err) {
      return console.log(err);
    }
  })
}
