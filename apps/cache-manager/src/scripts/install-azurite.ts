import {spawnSync} from 'child_process'

import chalk from 'chalk'

const commands = [
  ['npm i -g azuritesdsds', 'Install Azurite Emulator'],
  [
    'cd ~/Downloads && curl https://download.microsoft.com/download/A/E/3/AE32C485-B62B-4437-92F7-8B6B2C48CB40/StorageExplorer_signed.zip -LO',
    'Download Azure Storage Explorer',
  ],
  ['unzip ~/Downloads/StorageExplorer_signed.zip -d ~/Downloads', 'Unzip Azure Storage Explorer'],
  [
    `mv "$HOME/Downloads/Microsoft Azure Storage Explorer.app" "/Applications"`,
    'Move Azure Storage Explorer App to Desktop',
  ],
  [`open "/Applications/Microsoft Azure Storage Explorer.app/"`, 'Open Azure Storage Explorer'],
  ['npm run azurite:start', 'Run Azurite Emulator'],
]

const runCommand = (cmd: string, message: string) => {
  console.log('\n')
  console.log(chalk.bgMagenta.bold(`Start: ${message}`))
  console.log('\n')

  const spawn = spawnSync(`${cmd}`, {shell: true, encoding: 'utf-8', stdio: ['ignore', process.stdout, process.stderr]})

  if (spawn.status === 1) {
    console.log('\n')
    console.log(chalk.bgRed.bold(`Error: ${message}`))
    console.log('\n')
    return false
  }

  console.log('\n')
  console.log(chalk.bgGreen.bold(`Finish: ${message}`))
  console.log('\n')
}

const executeScript = () => {
  commands.every(cmd => {
    const command = cmd[0]
    const message = cmd[1]
    const commandStatus = runCommand(command, message)

    if (commandStatus === false) {
      return false
    }
    return true
  })
}

executeScript()
