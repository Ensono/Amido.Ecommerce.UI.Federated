import {env} from 'process'

import React from 'react'

const port = typeof window !== undefined ? env?.PORT : ''

const Footer: React.FC = ({children}) => {
  console.log('I am the footer rendered on ', port)

  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
  return <footer onClick={() => alert('ciao mamma footer')}>{children}</footer>
}

export default Footer
