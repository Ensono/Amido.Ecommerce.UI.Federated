import {FC, StrictMode, createContext} from 'react'

import {Text} from '@batman-ui-components/text'
import {federateComponent} from '@batman/federate-component'
import {getRemoteUrls} from '@batman/remote-urls'

import Counter from './components/Counter'

import './App.css'

const ThemeContext = createContext(null)

export const ThemeProvider = ({children, data}: any) => {
  return <ThemeContext.Provider value={data}>{children}</ThemeContext.Provider>
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
  return (
    <StrictMode>
      <ThemeProvider value={{}}>
        <Header loadingFallback={<div>Loading header...</div>} errorFallback={<div>Error loading header</div>}>
          SSR header!
        </Header>
        <div className="App">
          <section className="App-header">
            <Counter />
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
