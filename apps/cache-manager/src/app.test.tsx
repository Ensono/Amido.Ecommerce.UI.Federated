import request from 'supertest'

import app from './app'
import {CONNECTION_STRING, TABLE_NAME} from './globals'
import * as utils from './utils'

const mockTableResponse = {
  expiryDate: 123,
  partitionKey: 'test',
  rowKey: 'test',
  etag: 'test',
  value: '<IAMFOOTER>',
}

const mockRequestBody = {data: 'data'}

const mockDeleteResponse = {}

let mockConnectTableClient: any
let mockGetTableItem: any
let mockDeleteTableItem: any
let mockCacheExpired: any
let mockGetComponent: any
let mockInsertNewItem: any

beforeEach(() => {
  mockConnectTableClient = jest
    .spyOn(utils.AzureTableStorage, 'connectTableClient')
    .mockImplementation(() => Promise.resolve({}))
  mockGetTableItem = jest
    .spyOn(utils.AzureTableStorage, 'getTableItem')
    .mockImplementation(() => Promise.resolve(mockTableResponse))
  mockDeleteTableItem = jest
    .spyOn(utils.AzureTableStorage, 'deleteTableItem')
    .mockImplementation(() => Promise.resolve(mockDeleteResponse))
  mockCacheExpired = jest.spyOn(utils, 'cacheExpired').mockImplementation(() => false)
  mockGetComponent = jest.spyOn(utils, 'getComponent').mockImplementation(() => Promise.resolve({data: '<IAMFOOTER>'}))
  mockInsertNewItem = jest.spyOn(utils, 'insertNewItem').mockImplementation(() => Promise.resolve({}))
})

describe('prerender cache manager', () => {
  const base64Body = Buffer.from(JSON.stringify(mockRequestBody)).toString('base64')

  it('creates client and requests the item from the cache table', async () => {
    await request(app).post('/3003/prerender').send(mockRequestBody).set('remote-name', 'testRemote')
    expect(mockConnectTableClient).toBeCalledWith(CONNECTION_STRING, TABLE_NAME)
    expect(mockGetTableItem).toBeCalledWith({}, 'testRemote', base64Body)
  })
  it('responds with the component if it is found in the cache tables', async () => {
    const response = await request(app).post('/3003/prerender').send(mockRequestBody).set('remote-name', 'testRemote')
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe(mockTableResponse.value)
  })
  it('calls api, saves component to cache and responds with the component if it is not found in the cache tables', async () => {
    mockGetTableItem.mockImplementation(() => Promise.resolve(undefined))
    const response = await request(app).post('/3003/prerender').send(mockRequestBody).set('remote-name', 'testRemote')
    expect(mockGetComponent).toBeCalledWith(mockRequestBody, '3003')
    expect(mockInsertNewItem).toBeCalledWith('testRemote', base64Body, mockTableResponse.value, {})
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe(mockTableResponse.value)
  })
  it('recalls api, removes old component, saves new component to cache and responds with the component if cache has surpassed expiry', async () => {
    mockCacheExpired.mockImplementation(() => true)
    const response = await request(app).post('/3003/prerender').send(mockRequestBody).set('remote-name', 'testRemote')
    expect(mockDeleteTableItem).toBeCalledWith({}, 'test', 'test')
    expect(mockGetComponent).toBeCalledWith(mockRequestBody, '3003')
    expect(mockInsertNewItem).toBeCalledWith('testRemote', base64Body, mockTableResponse.value, {})
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe(mockTableResponse.value)
  })
})
