import {Component} from 'react'

import {Logger} from '@batman/core-logger'

import App from '../App'

export class ClientApp extends Component<any, {hasError: boolean}> {
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
      return <div>ERROR</div>
    }
    return <App {...this.props} />
  }
}

export default ClientApp
