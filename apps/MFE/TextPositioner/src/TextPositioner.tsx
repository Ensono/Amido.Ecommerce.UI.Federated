/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'

const TextPositioner: React.FC<{position: 'top' | 'bottom'}> = ({position = 'top', children}) => {
  return (
    <div
      onClick={() => alert(position)}
      style={{
        display: 'flex',
        height: '200px',
        flexDirection: 'column',
        justifyContent: position === 'top' ? 'flex-start' : 'flex-end',
      }}
    >
      <p style={{display: 'inline', margin: 0}}>positioned by TextPositioner: "{children}"</p>
    </div>
  )
}

export default TextPositioner
