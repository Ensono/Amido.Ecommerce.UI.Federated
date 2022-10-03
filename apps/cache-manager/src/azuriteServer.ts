// eslint-disable-next-line import/no-self-import
import {CONNECTION_STRING, TABLE_NAME} from './globals'
import {AzureTableStorage} from './utils'

const runServer = async () => {
  const client = await AzureTableStorage.connectTableClient(CONNECTION_STRING, 'TABLE_NAME')

  const task = {
    partitionKey: 'footer',
    rowKey: '{"module":".footer","props":{s},"remote":"mfe_footer"}',
    value:
      '[]--||||--<footer data-testid="module-federated-footer"><strong>I AM THE FOOTER</strong>‌children‌<!-- --></footer>--||||--NO STATE',
    expiryDate: new Date(),
  }

  console.log(client)

  return client

  // const deleteTable = await AzureTableStorage.deleteTableItem(client, 'federation', 'header')
  // console.log(deleteTable)

  // const deleteTable = await AzureTableStorage.deleteTable(CONNECTION_STRING, 'newTable')
  // console.log(deleteTable)

  // const create = await AzureTableStorage.createTable(CONNECTION_STRING, 'newTable')
  // console.log(create)

  // const get = await AzureTableStorage.getTableItem(client, 'footer', 'sss')
  // console.log(get)

  // const set = await AzureTableStorage.upsertTableItem(client, task)
  // console.log(set)
}

runServer()
