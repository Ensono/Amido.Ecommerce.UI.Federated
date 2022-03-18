/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {StrictMode, createContext} from 'react'

import {Text} from '@next-ui-components/text'
// import {federateComponent} from '@next/federate-component'

import logo from './logo.svg'
import './App.css'

const ThemeContext = createContext(null)
const ReduxContext = createContext(null)

export const ThemeProvider = ({children, data}: any) => {
  return <ThemeContext.Provider value={data}>{children}</ThemeContext.Provider>
}

export const ReduxProvider = ({children, data}: any) => {
  return <ReduxContext.Provider value={data}>{children}</ReduxContext.Provider>
}

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
const App: React.FC = () => {
  return (
    <StrictMode>
      <ThemeProvider value={{}}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p onClick={() => console.log('lallero')}>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <Text />
          </header>
        </div>
      </ThemeProvider>
    </StrictMode>
  )
}

export default App
