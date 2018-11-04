#!/usr/bin/env node

const MuPort = require('muport-core')
const Box = require('3box')
const seedsplit = require('seedsplit')
const bip39 = require('bip39')


async function all () {
  const mnemonic = bip39.generateMnemonic()
  const myq = await MuPort.newIdentity({ name: 'darqnet' }, null, {
    mnemonic
  })

  const c = 'Feel into what the darqnet is and condense it into a sentence.\n'
  let C = []
  const a = 'Express your intuition about the future of darqnet?\n'
  let A = []
  const b = 'What is your intention to bring forth into darqnet?\n'
  let B = []

  const numQnetians = 7
  //const numQnetians = 1
  for (let i = 0; i < numQnetians; i++) {
    console.log('\033[2J');
    C.push(await prompt(c))
    A.push(await prompt(a))
    B.push(await prompt(b))
  }

  console.log('\033[2J');
  const box = new Box(myq)

  await box._load()
  await box.private.set('intentianalIntuisions', { A, B, C })

  writeAddress(box._rootStore.address.toString())

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
    stdout.write(question)

    stdin.on('data', data => resolve(data.toString().trim()))
    stdin.on('error', err => reject(err))
  })
}

function writeAddress (address) {
  var fs = require('fs');
  fs.writeFile('darqnet-root', address, function(err) {
    if(err) {
      return console.log(err);
    }
  })
}
