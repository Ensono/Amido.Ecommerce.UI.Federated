import React, {useEffect, useState} from 'react'

import {federateComponent} from '@batman/federate-component'
import {getRemoteUrls} from '@batman/remote-urls'

import HeaderCounter from './components/headerCounter'

const REMOTES = getRemoteUrls()

const Navigation = federateComponent({
  remote: 'mfe_navigation',
  module: './navigation',
  remoteUrl: REMOTES.mfe_navigation,
})

/**
 * Example custom hook.
 * @returns boolean
 */
const usePageBottom = () => {
  const [bottom, setBottom] = useState(false)

  useEffect(() => {
    function handleScroll() {
      const isBottom = window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight
      setBottom(isBottom)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return bottom
}

const Header: React.FC<{children: React.ReactNode}> = ({children}) => {
  // const themeState = useThemeState()
  const [counter, setCounter] = useState(0)
  const isBottom = usePageBottom()

  /*
   * Test use effect works on component mount.
   */
  useEffect(() => {
    console.log('Header useEffect onComponentDidMount')
  }, [])

  /*
   * Test custom hook.
   */
  useEffect(() => {
    console.log('Custom Hook, page scrolled down to bottom', isBottom)
  }, [isBottom])

  return (
    <header data-testid="module-federated-header">
      <div className="local_state_counter">
        <div>
          Local State Counter: <span>{counter}</span>
        </div>
        <button onClick={() => setCounter(counter + 1)}>Increase local state counter</button>
      </div>
      <Navigation
        loadingFallback={<div>loading navigation...</div>}
        errorFallback={<div>error loading navigation!</div>}
        position="bottom"
      />
      <HeaderCounter />
      <div>{children}</div>
    </header>
  )
}

export default Header
