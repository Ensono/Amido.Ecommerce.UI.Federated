import {StrictMode, createContext} from 'react'

import {ThemeProvider} from '@batman/contexts'

import Footer from './Footer'

const ReduxContext = createContext(null)

export const ReduxProvider = ({children, data}: any) => {
  return <ReduxContext.Provider value={data}>{children}</ReduxContext.Provider>
}

/**
 * Renders the Footer MFE as a standalone app.
 * Not used by consumers of the Footer as a federated module.
 */
const App: React.FC = () => {
  return (
    <StrictMode>
      <ThemeProvider>
        <Footer />
      </ThemeProvider>
    </StrictMode>
  )
}

export default App
