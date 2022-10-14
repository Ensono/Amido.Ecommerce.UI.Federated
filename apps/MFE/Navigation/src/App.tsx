import {StrictMode, createContext} from 'react'

import {Text} from '@batman-ui-components/text'

import Navigation from './Navigation'

const ThemeContext = createContext(null)
const ReduxContext = createContext(null)

export const ThemeProvider = ({children, data}: any) => {
  return <ThemeContext.Provider value={data}>{children}</ThemeContext.Provider>
}

export const ReduxProvider = ({children, data}: any) => {
  return <ReduxContext.Provider value={data}>{children}</ReduxContext.Provider>
}

/**
 * Renders the Navigation MFE as a standalone app.
 * Not used by consumers of the Navigation federated module.
 */
const App: React.FC = () => {
  return (
    <StrictMode>
      <ThemeProvider value={{}}>
        <Navigation position="top" />
        <Text />
        <Navigation position="bottom" />
      </ThemeProvider>
    </StrictMode>
  )
}

export default App
