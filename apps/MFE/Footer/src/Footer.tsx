/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'

// eslint-disable-next-line import/no-extraneous-dependencies
import {context, federateComponent} from '@next/federate-component'
// eslint-disable-next-line import/no-extraneous-dependencies
import {getRemoteUrls} from '@next/remote-urls'

import './index.css'

export {context}

const remotesUrls = getRemoteUrls()

const Header = federateComponent('mfe_header', './header', remotesUrls.mfe_header)

const Footer: React.FC = ({children}) => {
  return (
    <footer data-testid="moodule-federated-footer" onClick={() => alert('ciao mamma footer')}>
      THIS IS THE FOOTER
      <Header errorFallback={<div>{children}</div>}>{children}</Header>
    </footer>
  )
}

export default Footer
