import React, {PropsWithChildren, Suspense, useContext} from 'react'
import {UNSAFE_RouteContext} from 'react-router-dom'

import {Logger} from '@batman/core-logger'

import {getClientComponent} from './client'
import {getServerComponent} from './server'
import {RemotesContext} from './types'

export const context: RemotesContext = {}

export class ErrorBoundary extends React.Component<any, {hasError: boolean}> {
  constructor(props: any) {
    super(props)
    this.state = {hasError: false}
  }

  static getDerivedStateFromError() {
    return {hasError: true}
  }

  componentDidCatch(error: Error) {
    Logger.error(error.message)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return null
    }

    return this.props.children
  }
}

/**
 * Isomorphic federated component generator, used at the top-level
 * scope to define components to be fetched from servers other than
 * the URL requested
 *
 * @remarks
 * client side retrieval logic {@link getClientComponent};
 * server side retrieval logic {@link getServerComponent};
 *
 * @param remote - name of remote address defined by environment
 * @param module - intended export target on remote address
 * @param remoteUrl - URL of remote target
 * @param shareScope - scope key on client's window object
 *
 * @returns Suspended, federated React component with an error boundary
 */
type FederatedComponentFactory = {
  remote: string
  module: string
  remoteUrl: string
  cacheUrl?: string
  shareScope?: string
  forwardRoute?: boolean
}
export const federateComponent = ({
  remote,
  module,
  remoteUrl,
  cacheUrl = '',
  shareScope = 'default',
  forwardRoute = false,
}: FederatedComponentFactory) => {
  const FederatedComponent = ({
    children,
    loadingFallback = <> </>,
    errorFallback = <> </>,
    ...props
  }: PropsWithChildren<{loadingFallback?: JSX.Element; errorFallback?: JSX.Element} | Record<string, any>>) => {
    // As it's not possible to get the active route's path pattern yet
    // We require something like useRouteMatch hook
    // Alternatively we can build a fake path using the params, but things like useLocation wouldn't work

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _ctx: any = {}
    const {matches} = useContext(UNSAFE_RouteContext)
    // Might need to use useLocation for full path & search
    if (forwardRoute && matches.length > 0) {
      const match = matches[matches.length - 1]
      _ctx.pathname = match.pathname
      _ctx.pattern = match.route.path || '*'
    }

    const Component: React.FC<PropsWithChildren<any>> =
      typeof window === 'undefined'
        ? getServerComponent(context, remote, module, {...props, _ctx}, remoteUrl, cacheUrl)
        : getClientComponent(context, remote, module, shareScope)

    return (
      <Suspense fallback={loadingFallback}>
        <ErrorBoundary fallback={errorFallback}>
          <Component {...props}>{children}</Component>
        </ErrorBoundary>
      </Suspense>
    )
  }

  return FederatedComponent
}
