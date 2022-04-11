/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {useEffect, useState} from 'react'

import {useThemeState} from '@batman/contexts'
import {federateComponent} from '@batman/federate-component'
import {getRemoteUrls} from '@batman/remote-urls'

const REMOTES = getRemoteUrls()

const TextPositioner = federateComponent('mfe_text_positioner', './text-positioner', REMOTES.mfe_text_positioner)

const Header: React.FC = ({children}) => {
  const themeState = useThemeState()

  /*
   * Test React Context. The Provider is coming from AppShell when federated.
   */
  useEffect(() => {
    console.log('ThemeState from Header', themeState)
  }, [themeState])

  return (
    <div>
      <div onClick={() => alert('ciao mamma header')}>
        <p data-testid="paragraph-in-header">I am the HEADERRRRR'"</p>
      </div>
      <TextPositioner
        loadingFallback={<div>loading text positioner...</div>}
        errorFallback={<div>error loading text positioner!</div>}
        position="bottom"
      >
        {children}
      </TextPositioner>
    </div>
  )
}

export default Header
