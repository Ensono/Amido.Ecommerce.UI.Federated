/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'

import {federateComponent} from '@batman/federate-component'
import {getRemoteUrls} from '@batman/remote-urls'

const REMOTES = getRemoteUrls()

const Navigation = federateComponent('mfe_navigation', './navigation', REMOTES.mfe_navigation)

const Header: React.FC = ({children}) => {
  return (
    <div>
      <div onClick={() => console.log('ciao mamma header')}>
        <p data-testid="paragraph-in-header">I am the HEADERRRRR'"</p>
      </div>
      <Navigation
        loadingFallback={<div>loading navigation...</div>}
        errorFallback={<div>error loading navigation!</div>}
        position="bottom"
      />
      <div>{children}</div>
    </div>
  )
}

export default Header
