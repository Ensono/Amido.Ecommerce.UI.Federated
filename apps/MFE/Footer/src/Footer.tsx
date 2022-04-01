/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'

// eslint-disable-next-line import/no-extraneous-dependencies
import {context, federateComponent} from '@batman/federate-component'
// eslint-disable-next-line import/no-extraneous-dependencies
import {getRemoteUrls} from '@batman/remote-urls'

import './index.css'

export {context}

const remotesUrls = getRemoteUrls()

const TextPositioner = federateComponent('mfe_text_positioner', './text-positioner', remotesUrls.mfe_text_positioner)

const Footer: React.FC = ({children}) => {
  return (
    <footer data-testid="moodule-federated-footer" onClick={() => alert('ciao mamma footer')}>
      <strong>I AM THE FOOTER</strong>
      <TextPositioner>{children}</TextPositioner>
    </footer>
  )
}

export default Footer
