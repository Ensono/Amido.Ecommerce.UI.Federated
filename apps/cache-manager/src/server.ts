import {TableClient} from '@azure/data-tables'
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

const cacheExpired = (expiryDate: string, creationTimestamp: Date) => {
  // Check cache expiry date based on args
  const cacheExpiryDate = Number(expiryDate) // '31536000' - (1 year in seconds)
  const timestamp = Math.floor(new Date(creationTimestamp).getTime() / 1000) // in seconds
  const todaysDate = Math.floor(new Date().getTime() / 1000) // '1664445833' - in seconds

  return timestamp + cacheExpiryDate <= todaysDate
}

const insertNewItem = async (
  partitionKey: string,
  rowKey: string,
  value: string,
  client: TableClient | undefined,
  expiryDate = 12345,
) => {
  const tableItem = {
    partitionKey,
    rowKey,
    value,
    expiryDate,
  }
  const upsert = await AzureTableStorage.upsertTableItem(client, tableItem)

  if (upsert === undefined) {
    console.log('cache failed to store')
  } else {
    return upsert
  }
}

const app = express()
app.use(express.json())

app.post('/:port/prerender', async (req, res) => {
  try {
    let component

    const remoteName = req.get('remote-name') || 'batman'

    const client = await AzureTableStorage.connectTableClient(CONNECTION_STRING, TABLE_NAME)

    const base64Body = Buffer.from(JSON.stringify(req.body)).toString('base64')

    const tableRes = await AzureTableStorage.getTableItem(client, remoteName, base64Body)

    if (tableRes === undefined) {
      const response = await getComponent(req.body, req.params.port)
      component = response.data
      await insertNewItem(remoteName, base64Body, response.data, client)
    } else if (cacheExpired(tableRes.expiryDate, tableRes.timestamp)) {
      await AzureTableStorage.deleteTableItem(client, tableRes.partitionKey, tableRes.rowKey)
      const response = await getComponent(req.body, req.params.port)
      await insertNewItem(remoteName, base64Body, response.data, client)
      component = response.data
    } else {
      component = tableRes.value
    }

    res.status(200).send(component)
  } catch (err) {
    console.log('error try catch')
    // console.log(err)
    res.sendStatus(500)
  }
})

const port = 9000
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
