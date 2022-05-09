import React from 'react'

import {federateComponent} from '@batman/federate-component'
import {getRemoteUrls} from '@batman/remote-urls'

import HeaderCounter from './components/headerCounter'

const REMOTES = getRemoteUrls()

const Navigation = federateComponent('mfe_navigation', './navigation', REMOTES.mfe_navigation)

const Header: React.FC = ({children}) => {
  return (
    <div>
      <div>
        <p data-testid="paragraph-in-header">I am the HEADERRRRR'"</p>
      </div>
      <Navigation
        loadingFallback={<div>loading navigation...</div>}
        errorFallback={<div>error loading navigation!</div>}
        position="bottom"
      />
      <HeaderCounter />
      <div>{children}</div>
    </div>
  )
}

export default Header
