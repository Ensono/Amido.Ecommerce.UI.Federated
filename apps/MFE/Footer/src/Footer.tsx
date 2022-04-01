import React from 'react'

import {context, federateComponent} from '@batman/federate-component'
// eslint-disable-next-line import/no-extraneous-dependencies
import {getRemoteUrls} from '@batman/remote-urls'

export {context}

const remotesUrls = getRemoteUrls()

const Header = federateComponent('mfe_header', './header', remotesUrls.mfe_header)

const Footer: React.FC = ({children}) => {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <footer data-testid="module-federated-footer" onClick={() => alert('ciao mamma footer')}>
      THIS IS THE FOOTER
      <Header errorFallback={<div>{children}</div>}>{children}</Header>
    </footer>
  )
}

export default Footer
