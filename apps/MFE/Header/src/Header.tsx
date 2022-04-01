/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'

// eslint-disable-next-line import/no-extraneous-dependencies
import {federateComponent} from '@batman/federate-component'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const REMOTES = JSON.parse(process.env.REMOTE_URLS!)

const TextPositioner = federateComponent('mfe_text_positioner', './text-positioner', REMOTES.mfe_text_positioner)

const Header: React.FC = ({children}) => {
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
