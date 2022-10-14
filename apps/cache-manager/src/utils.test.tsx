import {TableClient} from '@azure/data-tables'

import {AzureTableStorage, cacheExpired, currentDateInSeconds, insertNewItem} from './utils'

// Requires local azurite emulator to be running for local testing

describe('utils', () => {
  const tableName = 'jestTable'
  const connectionString = process.env.CONNECTION_STRING || ''

  let client: TableClient | undefined

  beforeAll(async () => {
    await AzureTableStorage.createTable(connectionString, tableName)
  })
  afterAll(async () => {
    await AzureTableStorage.deleteTable(connectionString, tableName)
  })
  beforeEach(async () => {
    client = await AzureTableStorage.connectTableClient(connectionString, tableName)
  })

  describe('AzureTableStorage', () => {
    it('getTableItem', async () => {
      const process = await AzureTableStorage.getTableItem(client, 'federation', 'header')
      expect(process).not.toBeUndefined()
    })

    it('upsertTableItem', async () => {
      const item = {
        partitionKey: 'abc',
        rowKey: '123',
        value: '--footer--',
        expiryDate: '123456',
      }
      const process = await AzureTableStorage.upsertTableItem(client, item)
      expect(process).not.toBeUndefined()
    })

    it('deleteTableItem', async () => {
      const process = await AzureTableStorage.deleteTableItem(client, 'abc', '123')
      expect(process).not.toBeUndefined()
    })
  })

  describe('currentDateInSeconds', () => {
    it('returns current date in seconds', () => {
      jest.useFakeTimers().setSystemTime(new Date('2022-10-03'))
      expect(currentDateInSeconds()).toBe(1664755200)
    })
  })

  describe('cacheExpired', () => {
    it('returns true', () => {
      jest.mock('./utils', () => ({
        currentDateInSeconds: jest.fn().mockReturnValue(1664841600),
      }))

      expect(cacheExpired(1664755200)).toBe(true)
    })

    it('returns false', () => {
      jest.mock('./utils', () => ({
        currentDateInSeconds: jest.fn().mockReturnValue(1664755200),
      }))

      expect(cacheExpired(1664841600)).toBe(false)
    })
  })

  describe('insertNewItem', () => {
    it('inserts expected input', () => {
      const spy = jest.spyOn(AzureTableStorage, 'upsertTableItem').mockImplementation(() => true)

      insertNewItem('header', '{header}', '--header--', 'client')

      const item = {expiryDate: 1664755212, partitionKey: 'header', rowKey: '{header}', value: '--header--'}

      expect(spy).toBeCalledWith('client', item)
    })
  })
})
