import {StrictMode, createContext} from 'react'

import {Text} from '@batman-ui-components/text'
import {ThemeProvider} from '@batman/contexts'

import Header from './Header'

const ReduxContext = createContext(null)

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
      <ThemeProvider>
        <Header>
          This is the header children with a text component
          <Text />
        </Header>
      </ThemeProvider>
    </StrictMode>
  )
}

export default App
