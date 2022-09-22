/* eslint-disable @typescript-eslint/no-var-requires */
const {TableServiceClient, TableClient, AzureNamedKeyCredential} = require('@azure/data-tables')
const {DefaultAzureCredential, StorageSharedKeyCredential, Uri} = require('@azure/identity')

// http://127.0.0.1:10002/devstoreaccount1/cacheManager

// const myRequest = require('request').defaults({strictSSL: false})
// require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create()
//add the root certificate in your HTTP angent
// const rootCas = require('ssl-root-cas').create()
// rootCas.addFile('mkcert metecanaydin@ENS-H99W5H491L (Metecan Aydin).pem')
// require('https').globalAgent.options.ca = rootCas

const account = 'devstoreaccount1'
const accountKey = 'Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw=='
const credential = new DefaultAzureCredential()

// const tableServiceClient = new TableServiceClient(`https://127.0.0.1:10002/${account}/cacheManager`, credential)

// console.log(tableServiceClient.listTables())

const sharedKeyCredential = new AzureNamedKeyCredential(account, accountKey)

// const client = new TableClient(`https://127.0.0.1:10002/${account}/`, 'cacheManager', sharedKeyCredential)
const cString =
  'DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;'
const client = new TableClient.fromConnectionString(cString, 'cacheManager')

const task = {
  PartitionKey: 'hometasks',
  RowKey: '1',
  //   description: 'take out the trash',
  //   dueDate: new Date(2015, 6, 20),
}

let result = client.createEntity(task)
// console.log(result)

// Entity create
