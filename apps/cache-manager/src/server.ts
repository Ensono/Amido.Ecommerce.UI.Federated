import axios from 'axios'
import express from 'express'

import {CONNECTION_STRING, TABLE_NAME} from './globals'
import {AzureTableStorage} from './utils'

async function getComponent(data: object, port: string) {
  const res = await axios(`http://localhost:${port}/prerender`, {
    method: 'POST',
    data,
    headers: {
      'content-type': 'application/json',
    },
  })
  return res
}

const app = express()
app.use(express.json())

app.post('/:port/prerender', async (req, res) => {
  try {
    const remoteName = req.get('remote-name') || ''
    const client = await AzureTableStorage.connectTableClient(CONNECTION_STRING, TABLE_NAME)
    let component
    const base64Body = Buffer.from(JSON.stringify(req.body)).toString('base64')
    const tableRes = await AzureTableStorage.getTableItem(client, remoteName, base64Body)
    if (tableRes === undefined) {
      const response = await getComponent(req.body, req.params.port)
      component = response.data
      const tableItem = {
        partitionKey: remoteName,
        rowKey: base64Body,
        value: response.data,
      }
      const set = await AzureTableStorage.upsertTableItem(client, tableItem)
      if (set === undefined) {
        console.log('cache failed to store')
      }
    } else {
      component = tableRes.value
    }
    res.status(200).send(component)
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

const port = 9000
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
