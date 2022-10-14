# Cache Manager

This app is designed to hold all uilities for the Cache Manager.

<br>

## `Azure Table Storage`

Run from within the `cache-manager` app directory:

```
npm run azurite:install
```

This will begin executing a series of scripts that will install:

- Azurite local emulator
- Microsoft Azure Storage Explorer
- .env file

These are used for local development to test out CRUD operations against Azure Table Storage.

<br>

Alternatively follow the individual installations linked below.

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

<br>

### Navigating Files

`utils` - Contains AzureTableStorage class with methods for CRUD operations

`app` - Exports node server config for running the cache manager

`server` - Runs node server against app config

`scripts` - Contains azurite and storage explorer setup script

<br>

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
