# Amido.Ecommerce.UI.Federated

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

Once the servers have successfully compiled visit [`http://localhost:3000/app`](http://localhost:3000/app) to access the
App Shell.

Each federated micro-frontend exposes a `/prerender` endpoint for parent components to consume, and is available
standalone at `/app`, e.g. the footer can be viewed (along with any micro-frontends it consumes) at
[`http://localhost:3003/app`](http://localhost:3003/app).

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

## Working with npm 8 workspaces

[npm 8 workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces) have a number of features which make working with
large monorepo projects simpler. Workspaces are defined in the root package's `package.json`, e.g.

```
  "workspaces": [
    "./cool-package-1",
    "./cool-package-2",
  ],
```

We can then run scripts from those packages without having to change directory, e.g.

```
$ npm run build -w cool-package-1
```

or run the same script in all workspaces

```
$ npm run build --ws
```

Note the `-w` argument refers to the name defined in the workspace's `package.json`, not the path used above.

### Shared dependencies

When installing dependencies, by default they will be installed into the root package's `node_modules` and symlinked
into the child packages. This speeds up installation and reduces the amount of disk space required when using the same
dependency across different packages.

### Local libraries

Functionality can be shared across packages without the overhead of publishing to a registry like npm, e.g.

```
// cool-package-1/index.js
import coolFunction from 'cool-package-2'
```
