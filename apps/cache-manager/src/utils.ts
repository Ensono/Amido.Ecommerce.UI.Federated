import {TableClient, TableServiceClient} from '@azure/data-tables'

import {UpsertTableItem} from './types'

// const tableServiceClient = new TableServiceClient(`https://127.0.0.1:10002/${account}/cacheManager`, credential)
// console.log(tableServiceClient.listTables())
// const sharedKeyCredential = new AzureNamedKeyCredential(account, accountKey)

export class AzureTableStorage {
  // CONNECT - Method to connect to Azure table instance
  static connectTableClient = async (connectionString: string, tableName: string) => {
    let client
    try {
      client = TableClient.fromConnectionString(connectionString, tableName)
    } catch (error) {
      console.log(`${error} Error connecting to table client`)
    }

    return client
  }

  // CREATE - Method to create new table and sample entries with provided tableName
  static createTable = async (connectionString: string, tableName: string) => {
    let result
    try {
      const tableServiceClient = await TableServiceClient.fromConnectionString(connectionString)
      await tableServiceClient.createTable(tableName)

      const task = {
        partitionKey: 'federation',
        rowKey: 'header',
        description: 'Header module',
        value: '--[]--header--[]--',
      }

      const tableClient = await this.connectTableClient(connectionString, tableName)

      result = await tableClient?.createEntity(task)
    } catch (error) {
      console.log(`[createTable] The following error occurred: ${error}`)
    }
    return result
  }

  // DELETE - Method to delete existing table with provided tableName
  static deleteTable = async (connectionString: string, tableName: string) => {
    let result
    try {
      const tableClient = await this.connectTableClient(connectionString, tableName)

      result = await tableClient?.deleteTable()
    } catch (error) {
      console.log(`[deleteTable] The following error occurred: ${error}`)
    }
    return result
  }

  // GET - Method to get existing item with provided partitionKey & sortKey
  static getTableItem = async (client: TableClient | undefined, partitionKey: string, rowKey: string) => {
    let tableItem
    try {
      tableItem = await client?.getEntity(partitionKey, rowKey)
    } catch (error) {
      console.log(`[getTableItem] The following error occurred: ${error}`)
    }

    return tableItem
  }

  // SET - Method to insert new item or update existing item with provided key value pairs
  static upsertTableItem = async (client: TableClient | undefined, item: UpsertTableItem) => {
    let tableItem
    try {
      tableItem = await client?.upsertEntity(item)
    } catch (error) {
      console.log(`[upsertTableItem] The following error occurred: ${error}`)
    }

    return tableItem
  }

  // DELETE - Method to delete existing item in table with provided partitionKey & sortKey
  static deleteTableItem = async (client: TableClient | undefined, partitionKey: string, rowKey: string) => {
    let tableItem
    try {
      tableItem = await client?.deleteEntity(partitionKey, rowKey)
    } catch (error) {
      console.log(`[deleteTableItem] The following error occurred: ${error}`)
    }

    return tableItem
  }
}
