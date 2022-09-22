/* eslint-disable @typescript-eslint/no-var-requires */
const {TableServiceClient, TableClient, AzureNamedKeyCredential} = require('@azure/data-tables')
const {DefaultAzureCredential, StorageSharedKeyCredential, Uri} = require('@azure/identity')

const account = 'devstoreaccount1'
const accountKey = 'Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw=='
const credential = new DefaultAzureCredential()
const connectionString =
  'DefaultEndpointsProtocol=http;UseDevelopmentStorage=true;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;'

// const tableServiceClient = new TableServiceClient(`https://127.0.0.1:10002/${account}/cacheManager`, credential)
// console.log(tableServiceClient.listTables())
// const sharedKeyCredential = new AzureNamedKeyCredential(account, accountKey)

const client = TableClient.fromConnectionString(connectionString, 'cacheManager')

const task = {
  PartitionKey: 'hometasks',
  RowKey: '1',
  //   description: 'lorem ipsum',
  //   dueDate: new Date(2020, 6, 22),
}

let result = client.createEntity(task)
// console.log(result)

// Entity create
