import React from 'react'

import {context} from '@batman/federate-component'

export {context}

const Footer: React.FC = ({children}) => {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <footer data-testid="moodule-federated-footer" onClick={() => console.log('ciao mamma footer')}>
      <strong>I AM THE FOOTER</strong>
      {children}
    </footer>
  )
}

export default Footer
