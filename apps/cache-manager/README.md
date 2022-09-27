# Cache Manager

This app is designed to hold all uilities for the Cache Manager.

### Available Scripts

#### `npm run dev`

---

<br>

## `Azure Table Storage`

### Install [Azurite Local Emulator](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azurite?tabs=visual-studio)

This is used to enable local development for the Azure cloud. Provides a local DB to run the standard SDK commands.

Run in terminal:

    azurite --location ./azurite --debug ./azurite/debug.log

---

### Install [Microsoft Azure Storage Explorer](https://azure.microsoft.com/en-us/products/storage/storage-explorer/#overview)

A GUI for managing Azure resources from your desktop. Used here along with Azurite emulator to ease development process
when testing operations.

---

<br>

## `Misc`

### Navigating Files

`utils` - Contains AzureTableStorage class with methods for CRUD operations

`globals` - Contains unique constants used in utils

---

### Database Column Naming Conventions

`partitionKey` - Name of the given Federated Module

`rowKey` - Stringified object of the server component (slashes are not suppored so either we encode/decode or pass just
the module name without `./`)

```js
partitionKey: 'footer',
rowKey: '{"module":"./header","props":{},"remote":"mfe_header"}'
```
