import {StrictMode, createContext} from 'react'

import {Text} from '@batman-ui-components/text'
import {ThemeProvider} from '@batman/contexts'

import TextPositioner from './TextPositioner'

const ReduxContext = createContext(null)

export const ReduxProvider = ({children, data}: any) => {
  return <ReduxContext.Provider value={data}>{children}</ReduxContext.Provider>
}

/**
 * Renders the TextPositioner MFE as a standalone app.
 * Not used by consumers of the TextPositioner federated module.
 */
const App: React.FC = () => {
  return (
    <StrictMode>
      <ThemeProvider>
        <TextPositioner position="top">Positioned top by text positioner</TextPositioner>
        <Text />
        <TextPositioner position="bottom">Positioned bottom by text positioner</TextPositioner>
      </ThemeProvider>
    </StrictMode>
  )
}

export default App
