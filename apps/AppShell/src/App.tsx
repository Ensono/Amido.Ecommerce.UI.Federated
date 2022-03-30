/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {FC, StrictMode, createContext} from 'react'

import {Text} from '@batman-ui-components/text'
// eslint-disable-next-line import/no-extraneous-dependencies
import {context, federateComponent} from '@batman/federate-component'

// import {REMOTE_URLS} from './config/remotes'
import logo from './logo.svg'
import './App.css'

// TODO: what is this?
export {context}

const ThemeContext = createContext(null)
const ReduxContext = createContext(null)

export const ThemeProvider = ({children, data}: any) => {
  return <ThemeContext.Provider value={data}>{children}</ThemeContext.Provider>
}

export const ReduxProvider = ({children, data}: any) => {
  return <ReduxContext.Provider value={data}>{children}</ReduxContext.Provider>
}

const REMOTES = JSON.parse(process.env.REMOTE_URLS)
// const Header = federateComponent('mfe_header', './header', REMOTES.mfe_header)
const Footer = federateComponent('mfe_footer', './footer', REMOTES.mfe_footer)

/**
 * What is the app single responsibility?
 * @remarks
 *
 * * This is an example from CRA typescript
 *
 * @example
 * ```typescript
 *    ReactDOM.render(
 *      <StrictMode>
 *        <App />
 *      </StrictMode>,
 *      document.getElementById('root')
 *    );
 * ```
 *
 * @alpha
 */
const App: FC = () => {
  return (
    <StrictMode>
      <ThemeProvider value={{}}>
        {/* <Header loadingFallback={<div>Loading fallback header</div>} errorFallback={<div>Error fallback header</div>}>
          <h1>Header</h1>
          <p>Federated from a webpack build</p>
        </Header> */}
        <div className="App">
          <section className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p onClick={() => console.log('lallero')}>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <Text />
          </section>
        </div>
        <Footer>
          <h1>Footer</h1>
          <p>Federated from a webpack build</p>
        </Footer>
      </ThemeProvider>
    </StrictMode>
  )
}

export default App
