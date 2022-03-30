/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'

// eslint-disable-next-line import/no-extraneous-dependencies
import {context, federateComponent} from '@batman/federate-component'

import './index.css'

export {context}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const REMOTES = JSON.parse(process.env.REMOTE_URLS!)

const Header = federateComponent('mfe_header', './header', REMOTES.mfe_header)

const Footer: React.FC = ({children}) => {
  return (
    <footer data-testid="moodule-federated-footer" onClick={() => alert('ciao mamma footer')}>
      THIS IS THE FOOTER
      <Header errorFallback={<div>{children}</div>}>{children}</Header>
    </footer>
  )
}

export default Footer
