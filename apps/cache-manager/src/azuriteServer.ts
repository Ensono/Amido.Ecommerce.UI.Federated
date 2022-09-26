// eslint-disable-next-line import/no-self-import
const {AzureTableStorage} = require('./utils.ts')
const {CONNECTION_STRING, STORAGE_ACCOUNT, TABLE_NAME} = require('./globals.ts')

const runServer = async () => {
  const client = await AzureTableStorage.connectTableClient(CONNECTION_STRING, TABLE_NAME)

  const task = {
    partitionKey: 'joel',
    rowKey: 'headers',
    description: 'fe dev full stack',
    //   dueDate: new Date(2020, 6, 22),
  }

  console.log(process.argv[2])

  // const deleteTable = await CacheManager.deleteTableItem(client, 'joel', 'header')
  // console.log(deleteTable)

  // const deleteTable = await CacheManager.deleteTable(CONNECTION_STRING, 'newTable')
  // console.log(deleteTable)

  // const create = await CacheManager.createTable(CONNECTION_STRING, 'newTable')
  // console.log(create)

  // const get = await CacheManager.getTableItem(client, 'federation', 'header')
  // console.log(get)

  // const set = await CacheManager.upsertTableItem(client, task)
  // console.log(set)
}

runServer()
