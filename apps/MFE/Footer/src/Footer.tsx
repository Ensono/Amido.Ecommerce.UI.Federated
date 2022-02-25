import React from 'react'

const Footer: React.FC = ({children}) => {
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
  return <footer onClick={() => alert('ciao mamma footer')}>{children}</footer>
}

export default Footer
