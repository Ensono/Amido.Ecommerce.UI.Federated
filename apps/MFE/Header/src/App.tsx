import {StrictMode, createContext} from 'react'

import {Text} from '@batman-ui-components/text'

import Header from './Header'
import './App.css'

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
        <Header>
          This is the header children with a text component
          <Text />
        </Header>
      </ThemeProvider>
    </StrictMode>
  )
}

export default App
