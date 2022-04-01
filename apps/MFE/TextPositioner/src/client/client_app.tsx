import {Component} from 'react'

import 'custom-event-polyfill'
// eslint-disable-next-line import/no-extraneous-dependencies
import {Logger} from '@batman/core-logger'

// eslint-disable-next-line import/no-named-as-default
import App, {ReduxProvider} from '../App'
// import {BASELINECSS_MATERIALUI, JSS_SERVERSIDE, BASELINECSS_CUSTOM} from '../config/constants'

// const removeJssServerSide = (elementId: string) => {
//   const element = document.getElementById(elementId)
//   if (element) {
//     element.parentNode!.removeChild(element)Î
//   }
// }

// eslint-disable-next-line react/prefer-stateless-function
export class ClientApp extends Component<any, {hasError: boolean}> {
  // eslint-disable-next-line react/static-property-placement
  static displayName = 'C_App_Component'

  constructor(props: any) {
    super(props)
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      hasError: false,
    }
  }

  //   componentDidMount() {
  //     removeJssServerSide(`${JSS_SERVERSIDE}${BASELINECSS_MATERIALUI}`)
  //     removeJssServerSide(`${JSS_SERVERSIDE}${BASELINECSS_CUSTOM}`)
  //   }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: any, errorInfo: any) {
    Logger.error(`${error}, ${errorInfo}`, document.cookie)
  }

  render() {
    if (this.state.hasError) {
      return <div data-testid="client-error" className="x-next-plat-mod" />
    }
    return (
      <ReduxProvider value={{}}>
        <App {...this.props} />
      </ReduxProvider>
    )
  }
}

export default ClientApp
