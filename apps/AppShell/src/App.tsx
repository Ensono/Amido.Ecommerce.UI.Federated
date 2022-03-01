/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {FC, StrictMode, Suspense, createContext} from 'react'

import {Text} from '@next-ui-components/Text'
// eslint-disable-next-line import/no-extraneous-dependencies
import {version} from '@next/constants'
// eslint-disable-next-line import/no-extraneous-dependencies
import {context, federateComponent} from '@next/federate-component'

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

// const Header = federateComponent('mfe_header', './header', REMOTE_URLS().mfe_header)
const REMOTES = JSON.parse(process.env.REMOTE_URLS)
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
        {/* <Suspense fallback={<div>Fallback header</div>}>
          <Header>
            <h1>Header</h1>
            <p>Federated from a webpack build</p>
          </Header>
        </Suspense> */}
        <div className="App">
          <section className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p onClick={() => console.log('lallero')}>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <Text />
            <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
              {version.version}
            </a>
          </section>
        </div>
        <Suspense fallback={<div>Fallback footer</div>}>
          <Footer><div>THIS IS THE FOOTER YAYYY</div></Footer>
        </Suspense>
      </ThemeProvider>
    </StrictMode>
  )
}

export default App
