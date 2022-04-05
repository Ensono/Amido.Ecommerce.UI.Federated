/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {FC, StrictMode, createContext} from 'react'

import {Text} from '@batman-ui-components/text'
import {context, federateComponent} from '@batman/federate-component'
import {getRemoteUrls} from '@batman/remote-urls'

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

const remotesUrls = getRemoteUrls()

const Header = federateComponent('mfe_header', './header', remotesUrls.mfe_header)
const Footer = federateComponent('mfe_footer', './footer', remotesUrls.mfe_footer)

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
        <Header loadingFallback={<div>Loading header...</div>} errorFallback={<div>Error loading header</div>}>
          SSR header!
        </Header>
        <div className="App">
          <section className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p onClick={() => console.log('lallero')}>Page 1</p>
            <Text />
          </section>
        </div>
        <Footer loadingFallback={<div>Loading footer...</div>} errorFallback={<div>Error loading footer</div>}>
          SSR footer!
        </Footer>
      </ThemeProvider>
    </StrictMode>
  )
}

export default App
