// eslint-disable-next-line import/no-self-import
import {CONNECTION_STRING, STORAGE_ACCOUNT, TABLE_NAME} from './globals'
import {AzureTableStorage} from './utils'

const runServer = async () => {
  const client = await AzureTableStorage.connectTableClient(CONNECTION_STRING, TABLE_NAME)

  const task = {
    partitionKey: 'joel',
    rowKey: 'headers',
    description: 'fe dev full stack',
    //   dueDate: new Date(2020, 6, 22),
  }

  console.log(123)

  console.log(process.argv[2])

  // const deleteTable = await AzureTableStorage.deleteTableItem(client, 'joel', 'header')
  // console.log(deleteTable)

  // const deleteTable = await AzureTableStorage.deleteTable(CONNECTION_STRING, 'newTable')
  // console.log(deleteTable)

  // const create = await AzureTableStorage.createTable(CONNECTION_STRING, 'newTable')
  // console.log(create)

  // const get = await AzureTableStorage.getTableItem(client, 'federation', 'header')
  // console.log(get)

  // const set = await AzureTableStorage.upsertTableItem(client, task)
  // console.log(set)
}

runServer()
