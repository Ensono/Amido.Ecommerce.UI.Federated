import React from 'react'

import {context, federateComponent} from '@batman/federate-component'

import './index.css'

export {context}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const REMOTES = JSON.parse(process.env.REMOTE_URLS!)

const Header = federateComponent('mfe_header', './header', REMOTES.mfe_header)

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
