import {GetTableEntityResponse, TableClient, TableEntityResult, TableServiceClient} from '@azure/data-tables'
import axios from 'axios'

import {UpsertTableItem} from './types'

export class AzureTableStorage {
  static connectTableClient = async (connectionString: string, tableName: string) => {
    let client
    try {
      client = TableClient.fromConnectionString(connectionString, tableName)
    } catch (error) {
      console.log(`[connectTableClient] The following error occurred ${error}`)
    }

    return client
  }

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

  static getTableItem = async (client: TableClient | undefined, partitionKey: string, rowKey: string) => {
    let tableItem: GetTableEntityResponse<TableEntityResult<object>> | undefined

    try {
      tableItem = await client?.getEntity(partitionKey, rowKey)
    } catch (error) {
      console.log(`[getTableItem] The following error occurred: ${error}`)
    }

    return tableItem
  }

  static upsertTableItem = async (client: TableClient | undefined, item: UpsertTableItem) => {
    let tableItem
    try {
      tableItem = await client?.upsertEntity(item)
    } catch (error) {
      console.log(`[upsertTableItem] The following error occurred: ${error}`)
    }

    return tableItem
  }

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

export async function getComponent(data: object, remoteUrl: string) {
  const res = await axios(`http://${remoteUrl}/prerender`, {
    method: 'POST',
    data,
    headers: {
      'content-type': 'application/json',
    },
  })
  return res
}

export const currentDateInSeconds = () => Math.floor(new Date().getTime() / 1000)

export const cacheExpired = (expiryDate: number) => currentDateInSeconds() >= expiryDate

export const insertNewItem = async (
  partitionKey: string,
  rowKey: string,
  value: string,
  client: TableClient | undefined,
  expiryDate = 12,
) => {
  const tableItem = {
    partitionKey,
    rowKey,
    value,
    expiryDate: expiryDate + currentDateInSeconds(),
  }
  const upsert = await AzureTableStorage.upsertTableItem(client, tableItem)

  if (upsert === undefined) {
    console.log('cache failed to store')
  } else {
    return upsert
  }
}
