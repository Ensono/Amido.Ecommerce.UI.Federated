import logo from './logo.svg'
import './App.css'

/**
 * What is the app single responsibility?
 * alessio
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
const App1 = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App1
