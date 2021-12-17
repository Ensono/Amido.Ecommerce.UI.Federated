const { exec } = require('child_process')
const chalk = require('chalk')

const runNext = async (data) => {
  exec(`npm run test ${data} --if-present`, (err, stdout, stderr) => {
    if (err) {
      //some err occurred
      console.error(chalk.hex('##E28989')(err))
    } else {
      if (stderr) {
        console.log(`stderr: ${chalk.hex('##E28989')(stderr)}`)
      }
      console.log(chalk.hex('#00FF00')(stdout))
    }
  })
}
const run = async () => {
  exec('git diff --name-only HEAD | grep src', (err, stdout, stderr) => {
    if (!stdout) {
      console.log(chalk.hex('#A0E399')('No changes recorded to any workspace'))
      process.exit(0)
    }
    if (err) {
      //some err occurred
      console.error(err)
    } else {
      const arr = stdout.split('\n')
      const obj = {}
      const printableObj = {}
      const temporaryCommands = arr
        .map((path) => `-w ./${path.split('/src')[0]}`)
        .slice(0, -1)
      temporaryCommands.forEach((command) => {
        obj[command] = true
      })
      const temporaryPrintable = arr
        .map((path) => `${path.split('/src')[0]}`)
        .slice(0, -1)
      temporaryPrintable.forEach((printable) => {
        printableObj[printable] = true
      })
      const commands = Object.keys(obj).join(' ')
      const printable = Object.keys(printableObj).join(', ')
      console.log(`workspaces changed: ${chalk.hex('#A0E399')(printable)}`)
      runNext(commands)
      if (stderr) {
        console.log(`stderr: ${stderr}`)
      }
    }
  })
}

process.on('stdout', (buffer) => process.write(buffer))

run()
