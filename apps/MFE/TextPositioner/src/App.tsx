import {StrictMode, createContext} from 'react'

import {Text} from '@batman-ui-components/text'

import TextPositioner from './TextPositioner'

const ThemeContext = createContext(null)
const ReduxContext = createContext(null)

export const ThemeProvider = ({children, data}: any) => {
  return <ThemeContext.Provider value={data}>{children}</ThemeContext.Provider>
}

export const ReduxProvider = ({children, data}: any) => {
  return <ReduxContext.Provider value={data}>{children}</ReduxContext.Provider>
}

/**
 * What is the app single responsibility?
 * @remarks
 *
 * * This is an example from CRA typescript
 *
 * @example
 * ```typescript
 *    ReactDOM.render(
 *      <React.StrictMode>
 *        <App />
 *      </React.StrictMode>,
 *      document.getElementById('root')
 *    );
 * ```
 *
 * @alpha
 */
const App: React.FC = () => {
  return (
    <StrictMode>
      <ThemeProvider value={{}}>
        <TextPositioner position="top">Positioned top by text positioner</TextPositioner>
        <Text />
        <TextPositioner position="bottom">Positioned bottom by text positioner</TextPositioner>
      </ThemeProvider>
    </StrictMode>
  )
}

export default App
