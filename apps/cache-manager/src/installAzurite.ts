import {spawnSync} from 'child_process'

import chalk from 'chalk'

// ======== Setup Commands =======

const cmd1 = ['npm i -g azurite', 'Install Azurite Emulator']
const cmd2 = [
  'cd ~/Downloads && curl https://download.microsoft.com/download/A/E/3/AE32C485-B62B-4437-92F7-8B6B2C48CB40/StorageExplorer_signed.zip -LO',
  'Download Azure Storage Explorer',
]
const cmd3 = ['unzip ~/Downloads/StorageExplorer_signed.zip -d ~/Downloads', 'Unzip Azure Storage Explorer']
const cmd4 = [
  `mv "$HOME/Downloads/Microsoft Azure Storage Explorer.app" "/Applications"`,
  'Move Azure Storage Explorer App to Desktop',
]
const cmd5 = [`open "/Applications/Microsoft Azure Storage Explorer.app/"`, 'Open Azure Storage Explorer']
const cmd6 = ['npm run azurite:start', 'Run Azurite Emulator']

const commands = [cmd1, cmd2, cmd3, cmd4, cmd5, cmd6]

// ======== Setup Commands =======

const runCommand = (cmd: string, message: string) => {
  console.log('\n')
  console.log(chalk.bgMagenta.bold(`Start: ${message}`))
  console.log('\n')

  //   process.stdout.write('Running...')
  spawnSync(`${cmd}`, {shell: true, encoding: 'utf-8', stdio: ['ignore', process.stdout, process.stderr]})

  console.log('\n')
  console.log(chalk.bgGreen.bold(`Finish: ${message}`))
  console.log('\n')
}

// ======= Run Setup Commands =======
const setupLocalDevelopment = () => {
  commands.forEach(cmd => {
    const command = cmd[0]
    const message = cmd[1]
    runCommand(command, message)
  })
}

setupLocalDevelopment()
