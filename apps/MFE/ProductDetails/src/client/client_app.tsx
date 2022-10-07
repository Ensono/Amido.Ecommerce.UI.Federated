import {Component} from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'

import {Logger} from '@batman/core-logger'

import App, {ReduxProvider} from '../App'

export class ClientApp extends Component<any, {hasError: boolean}> {
  // eslint-disable-next-line react/static-property-placement
  static displayName = 'C_App_Component'

  constructor(props: any) {
    super(props)
    this.state = {
      hasError: false,
    }
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: any, errorInfo: any) {
    Logger.error(`${error}, ${errorInfo}`)
  }

  render() {
    if (this.state.hasError) {
      return <div data-testid="client-error" />
    }
    return (
      <ReduxProvider value={{}}>
        <BrowserRouter>
          <Routes>
            <Route path="/app/productDetails/:id" element={<App {...this.props} />} />
          </Routes>
        </BrowserRouter>
      </ReduxProvider>
    )
  }
}

export default ClientApp
