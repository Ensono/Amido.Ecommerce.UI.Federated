import {spawnSync} from 'child_process'

import chalk from 'chalk'

const commands = [
  ['npm i -g azurite', 'Install Azurite Emulator'],
  [
    'cd ~/Downloads && curl https://download.microsoft.com/download/A/E/3/AE32C485-B62B-4437-92F7-8B6B2C48CB40/StorageExplorer_signed.zip -LO',
    'Download Azure Storage Explorer',
  ],
  ['unzip ~/Downloads/StorageExplorer_signed.zip -d ~/Downloads', 'Unzip Azure Storage Explorer'],
  [
    `mv "$HOME/Downloads/Microsoft Azure Storage Explorer.app" "/Applications"`,
    'Move Azure Storage Explorer App to Applications',
  ],
  [
    `echo "STORAGE_ACCOUNT=devstoreaccount1\nCONNECTION_STRING=DefaultEndpointsProtocol=http;UseDevelopmentStorage=true;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;\nTABLE_NAME=cacheManager" >> .env`,
    'Create .env',
  ],
  [`open "/Applications/Microsoft Azure Storage Explorer.app/"`, 'Open Azure Storage Explorer'],
  ['npm run azurite:start', 'Run Azurite Emulator'],
]

const runCommand = (cmd: string, message: string) => {
  console.log('\n')
  console.log(chalk.bgMagenta.bold(`${message}`))
  console.log('\n')

  const spawn = spawnSync(`${cmd}`, {shell: true, encoding: 'utf-8', stdio: ['ignore', process.stdout, process.stderr]})

  if (spawn.status === 1) {
    console.log('\n')
    console.log(chalk.bgRed.bold(`Error: ${message}`))
    console.log('\n')
    return false
  }
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
