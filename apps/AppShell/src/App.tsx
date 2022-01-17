import React from 'react'

// eslint-disable-next-line import/no-extraneous-dependencies
import test from '@next/constants'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Text } from '@next/ui-components'

import logo from './logo.svg'
import './App.css'

/**
 * What is the app single responsibility?
 * @remarks
 *
 * * This is an example from CRA typescript
 *
 * @example
 * ```typescript
 *    ReactDOM.render(
 *      <React.StrictMode>
 *        <App />
 *      </React.StrictMode>,
 *      document.getElementById('root')
 *    );
 * ```
 *
 * @alpha
 */
const App: React.FC = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <Text />
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        {test}
      </a>
    </header>
  </div>
)

export default App
