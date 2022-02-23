import {getClientComponent} from './client'
import {getServerComponent} from './server'
import {RemoteUrls, RemotesContext} from './types'

export const context: RemotesContext = {}

export const federateComponent = (remote: string, module: string, remoteUrls: RemoteUrls, shareScope = 'default') => {
  const FederatedComponent: React.FC = ({children, ...props}) => {
    let Component: React.FC

    if (typeof window !== 'undefined') {
      Component = getClientComponent(context, remote, module, shareScope)
    } else if (typeof window === 'undefined') {
      Component = getServerComponent(context, remote, module, props, remoteUrls)
    } else {
      return null
    }

    return <Component {...props}>{children}</Component>
  }

  return FederatedComponent
}
