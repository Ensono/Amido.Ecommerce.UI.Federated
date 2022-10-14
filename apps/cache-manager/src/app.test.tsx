import request from 'supertest'

import app from './app'
import * as utils from './utils'

const mockTableResponse = {
  expiryDate: 123,
  partitionKey: 'test',
  rowKey: 'test',
  etag: 'test',
  value: '<IAMCACHEDMFE>',
}
const mockRequestBody = {data: 'data'}
const mockApiResponse = {data: '<IAMREQUESTEDMFE>'}
const mockDeleteResponse = {}
const connectionString = process.env.CONNECTION_STRING || ''
const tableName = process.env.TABLE_NAME || ''

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
  mockGetComponent = jest.spyOn(utils, 'getComponent').mockImplementation(() => Promise.resolve(mockApiResponse))
  mockInsertNewItem = jest.spyOn(utils, 'insertNewItem').mockImplementation(() => Promise.resolve({}))
})

describe('prerender cache manager', () => {
  const base64Body = Buffer.from(
    JSON.stringify({
      ...mockRequestBody,
      headers: {'x-language': 'en', 'x-territory': 'GB', 'remote-name': 'testRemote'},
    }),
  ).toString('base64')

  it('creates client and requests the item from the cache table', async () => {
    await request(app)
      .post('/3003/prerender')
      .send(mockRequestBody)
      .set('remote-name', 'testRemote')
      .set('x-language', 'en')
      .set('x-territory', 'GB')

    expect(mockConnectTableClient).toBeCalledWith(connectionString, tableName)
    expect(mockGetTableItem).toBeCalledWith({}, 'testRemote', base64Body)
  })
  it('responds with the component if it is found in the cache tables', async () => {
    const response = await request(app)
      .post('/3003/prerender')
      .send(mockRequestBody)
      .set('remote-name', 'testRemote')
      .set('x-language', 'en')
      .set('x-territory', 'GB')
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe(mockTableResponse.value)
  })
  it('calls api, saves component to cache and responds with the component if it is not found in the cache tables', async () => {
    mockGetTableItem.mockImplementation(() => Promise.resolve(undefined))
    const response = await request(app)
      .post('/3003/prerender')
      .send(mockRequestBody)
      .set('remote-name', 'testRemote')
      .set('x-language', 'en')
      .set('x-territory', 'GB')

    expect(mockGetComponent).toBeCalledWith(mockRequestBody, '3003')
    expect(mockInsertNewItem).toBeCalledWith('testRemote', base64Body, mockApiResponse.data, {})
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe(mockApiResponse.data)
  })
  it('recalls api, removes old component, saves new component to cache and responds with the component if cache has surpassed expiry', async () => {
    mockCacheExpired.mockImplementation(() => true)
    const response = await request(app)
      .post('/3003/prerender')
      .send(mockRequestBody)
      .set('remote-name', 'testRemote')
      .set('x-language', 'en')
      .set('x-territory', 'GB')
    expect(mockDeleteTableItem).toBeCalledWith({}, 'test', 'test')
    expect(mockGetComponent).toBeCalledWith(mockRequestBody, '3003')
    expect(mockInsertNewItem).toBeCalledWith('testRemote', base64Body, mockApiResponse.data, {})
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe(mockApiResponse.data)
  })
  it('calls api and responds with the component if error is thrown in connecting to cache tables', async () => {
    mockConnectTableClient.mockImplementation(() => {
      throw new Error('test error')
    })
    const response = await request(app)
      .post('/3003/prerender')
      .send(mockRequestBody)
      .set('remote-name', 'testRemote')
      .set('x-language', 'en')
      .set('x-territory', 'GB')
    expect(response.statusCode).toBe(200)
    expect(response.text).toBe(mockApiResponse.data)
  })
  it('returns a 500 error if component api request fails', async () => {
    mockGetTableItem.mockImplementation(() => Promise.resolve(undefined))
    mockGetComponent.mockImplementation(() => {
      throw new Error('test error')
    })
    const response = await request(app)
      .post('/3003/prerender')
      .send(mockRequestBody)
      .set('remote-name', 'testRemote')
      .set('x-language', 'en')
      .set('x-territory', 'GB')
    expect(response.statusCode).toBe(500)
  })
  it('returns default value for language and territory headers', async () => {
    const response = await request(app).post('/3003/prerender').send(mockRequestBody).set('remote-name', 'testRemote')

    expect(response.headers['x-language']).toBe('en')
    expect(response.headers['x-territory']).toBe('GB')
  })

  it('returns set value for language and territory headers', async () => {
    const response = await request(app)
      .post('/3003/prerender')
      .send(mockRequestBody)
      .set('remote-name', 'testRemote')
      .set('x-language', 'de')
      .set('x-territory', 'DE')

    expect(response.headers['x-language']).toBe('de')
    expect(response.headers['x-territory']).toBe('DE')
  })
})
