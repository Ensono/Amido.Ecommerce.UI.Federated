import {StrictMode, createContext} from 'react'

import {Text} from '@batman-ui-components/text'

import Header from './Header'

const ThemeContext = createContext(null)
const ReduxContext = createContext(null)

export const ThemeProvider = ({children, data}: any) => {
  return <ThemeContext.Provider value={data}>{children}</ThemeContext.Provider>
}

export const ReduxProvider = ({children, data}: any) => {
  return <ReduxContext.Provider value={data}>{children}</ReduxContext.Provider>
}

/**
 * Renders the Header MFE in a standalone page.
 * Not used by consumers of the Header federated module.
 */
const App: React.FC = () => {
  return (
    <StrictMode>
      <ThemeProvider value={{}}>
        <Header>
          This is the header children with a text component
          <Text />
        </Header>
      </ThemeProvider>
    </StrictMode>
  )
}

export default App
