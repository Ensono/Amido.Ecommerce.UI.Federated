/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {FC, StrictMode, createContext, useEffect} from 'react'

import {Text} from '@batman-ui-components/text'
import {ThemeProvider, useThemeState} from '@batman/contexts'
import {context, federateComponent} from '@batman/federate-component'
import {getRemoteUrls} from '@batman/remote-urls'

import logo from './logo.svg'
import './App.css'

// TODO: what is this?
export {context}

const ReduxContext = createContext(null)

export const ReduxProvider = ({children, data}: any) => {
  return <ReduxContext.Provider value={data}>{children}</ReduxContext.Provider>
}

const remotesUrls = getRemoteUrls()

const Header = federateComponent('mfe_header', './header', remotesUrls.mfe_header)
const Footer = federateComponent('mfe_footer', './footer', remotesUrls.mfe_footer)

/**
 * Host app that consumes micro-front-ends and renders them together
 * @remarks
 *
 */
const App: FC = () => {
  const themeState = useThemeState()

  useEffect(() => {
    console.log('themeState from App', themeState)
  }, [themeState])

  return (
    <StrictMode>
      <ThemeProvider>
        <Header loadingFallback={<div>Loading header...</div>} errorFallback={<div>Error loading header</div>}>
          SSR header!
        </Header>
        <div className="App">
          <section className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            {/* eslint-disable-next-line no-console */}
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
