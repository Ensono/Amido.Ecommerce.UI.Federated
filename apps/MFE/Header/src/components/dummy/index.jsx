import {env} from 'process'

import React from 'react'

import styles from './dummy.module.css'

const port = typeof window !== undefined ? env?.PORT : ''
const Dummy = ({children}) => {
  console.log('I am the header rendered on ', port)

  return (
    <header onClick={() => alert('ciao mamma')} className={styles.header}>
      {children}
    </header>
  )
}

export default Dummy