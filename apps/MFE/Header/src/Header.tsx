/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'

const Header: React.FC = ({children}) => {
  return (
    <div onClick={() => alert('ciao mamma header')}>
      <p>I am the HEADERRRRR</p>
      {children}
    </div>
  )
}

export default Header
