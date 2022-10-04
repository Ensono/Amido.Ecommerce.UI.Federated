# Cache Manager

This app is designed to hold all uilities for the Cache Manager.

### Available Scripts

#### `npm run dev`
#### `npm run server-dev`

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

### Database Property Names

`partitionKey: string` - Name of the given Federated Module

`rowKey: string` - Object of the server component converted to base64

`timestamp: dateTime` - DateTime value of row data entry

`value: string` - String of module and props

`expiryDate: int` - Set date in seconds for cache expiry

```js
partitionKey: 'footer',

rowKey: 'eyJtb2R1bGUiOiIuL2Zvb3RlciIsInByb3BzIjp7fX0='

timestamp: "2022-10-03T13:34:12.1890000Z"

value: '[]--||||--<footer data-testid="module-federated-footer"><strong>I AM THE FOOTER</strong>‌children‌<!-- --></footer>--||||--NO STATE'

expiryDate: 1664804064
```
