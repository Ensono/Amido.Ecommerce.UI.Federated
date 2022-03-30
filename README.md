# Next.Ecommerce.UI.Federated

Federated Modules Production Grade boilerplate

## Installation

### Prerequisites

To run this project the following package versions are required:

- NPM v8.x.x
- Node v16.14.1 (configured via .nvmrc)

### Installing dependencies

1. Run `npm i` at the root of the Monorepo to install the required node modules
2. Run `npm run build-all` to build all of the applications and libraries

## Running the project

### Development

To run the fully intergrated application in development mode you need to run the App Shell along with the required
applications:

```
// Terminal 1
npm run app-shell:dev

// Terminal 2
npm run footer:dev

// Terminal 3
npm run header:dev
```

Once the servers have successfully compiled visit `http://localhost:3000/app` to access the application.

### Production

To run the application in production mode replace the `dev` command with `watch`:

```
// Terminal 1
npm run app-shell:watch
```

## Testing

Testing can be done from the root via commands like `npm run host:test`

## Linting

Testing can be done from the root via commands like `npm run host:eslint`

## Docs

Build tsdocs with `npm run docs` and serve docs locally with `npm run docs:serve`
