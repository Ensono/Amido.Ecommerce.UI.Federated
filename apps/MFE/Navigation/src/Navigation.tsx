/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import {Link} from 'react-router-dom'

const Navigation: React.FC<{position: 'top' | 'bottom'}> = ({position = 'top'}) => {
  return (
    <div
      onClick={() => console.log(position)}
      style={{
        display: 'flex',
        height: '200px',
        flexDirection: 'column',
        justifyContent: position === 'top' ? 'flex-start' : 'flex-end',
      }}
    >
      <Link to="/app">Home</Link>
      <Link to="/app/productListing">Products</Link>
    </div>
  )
}

export default Navigation
