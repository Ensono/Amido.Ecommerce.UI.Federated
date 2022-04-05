import {StrictMode, createContext} from 'react'

import Footer from './Footer'

const ThemeContext = createContext(null)
const ReduxContext = createContext(null)

export const ThemeProvider = ({children, data}: any) => {
  return <ThemeContext.Provider value={data}>{children}</ThemeContext.Provider>
}

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
      <ThemeProvider value={{}}>
        <Footer />
      </ThemeProvider>
    </StrictMode>
  )
}

export default App
