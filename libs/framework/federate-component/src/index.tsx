import React, {Suspense} from 'react'

import {Logger} from '@next/core-logger'

import {getClientComponent} from './client'
import {getServerComponent} from './server'
import {RemotesContext} from './types'

export const context: RemotesContext = {}

class ErrorBoundary extends React.Component<any, {hasError: boolean}> {
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

export const federateComponent = (remote: string, module: string, remoteUrl: string, shareScope = 'default') => {
  const FederatedComponent: React.FC<{loadingFallback?: JSX.Element; errorFallback?: JSX.Element}> = ({
    children,
    loadingFallback = <> </>,
    errorFallback = <> </>,
    ...props
  }) => {
    let Component: React.FC

    if (typeof window !== 'undefined') {
      Component = getClientComponent(context, remote, module, shareScope)
    } else if (typeof window === 'undefined') {
      Component = getServerComponent(context, remote, module, props, remoteUrl)
    } else {
      return null
    }

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
