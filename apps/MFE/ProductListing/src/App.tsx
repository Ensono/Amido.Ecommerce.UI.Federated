import {StrictMode, createContext} from 'react'

import ProductListing from './ProductListing'

const ThemeContext = createContext(null)
const ReduxContext = createContext(null)

export const ThemeProvider = ({children, data}: any) => {
  return <ThemeContext.Provider value={data}>{children}</ThemeContext.Provider>
}

export const ReduxProvider = ({children, data}: any) => {
  return <ReduxContext.Provider value={data}>{children}</ReduxContext.Provider>
}

/**
 * Renders the ProductListing MFE in a standalone page.
 * Not used by consumers of the ProductListing federated module.
 */
const App: React.FC = () => {
  return (
    <StrictMode>
      <ThemeProvider value={{}}>
        <ProductListing />
      </ThemeProvider>
    </StrictMode>
  )
}

export default App
