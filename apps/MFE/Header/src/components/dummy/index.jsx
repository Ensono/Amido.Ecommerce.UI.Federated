import {env} from 'process'

import React from 'react'

import styles from './dummy.module.css'

// eslint-disable-next-line valid-typeof
const port = typeof window !== undefined ? env?.PORT : ''
const Dummy = ({children}) => {
  console.log('I am the header rendered on ', port)

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <header onClick={() => alert('ciao mamma')} className={styles.header}>
      {children}
    </header>
  )
}

export default Dummy
