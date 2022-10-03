import express from 'express'

import {CONNECTION_STRING, TABLE_NAME} from './globals'
import {AzureTableStorage, cacheExpired, getComponent, insertNewItem} from './utils'

const app = express()
app.use(express.json())

app.post('/:port/prerender', async (req, res) => {
  try {
    let component

    const remoteName = req.get('remote-name') || 'batman'

    const client = await AzureTableStorage.connectTableClient(CONNECTION_STRING, TABLE_NAME)

    const base64Body = Buffer.from(JSON.stringify(req.body)).toString('base64')

    const tableRes: any = await AzureTableStorage.getTableItem(client, remoteName, base64Body)

    if (tableRes === undefined) {
      const response = await getComponent(req.body, req.params.port)
      component = response.data
      await insertNewItem(remoteName, base64Body, response.data, client)
    } else if (cacheExpired(tableRes.expiryDate)) {
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
