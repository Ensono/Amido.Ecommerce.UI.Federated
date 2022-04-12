/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {useEffect, useState} from 'react'

import {useThemeState} from '@batman/contexts'
import {federateComponent} from '@batman/federate-component'
import {getRemoteUrls} from '@batman/remote-urls'

const REMOTES = getRemoteUrls()

const TextPositioner = federateComponent('mfe_text_positioner', './text-positioner', REMOTES.mfe_text_positioner)

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

const Header: React.FC = ({children}) => {
  const themeState = useThemeState()
  const [counter, setCounter] = useState(0)
  const isBottom = usePageBottom()

  /*
   * Test use effect works on component mount.
   */
  useEffect(() => {
    console.log('Header useEffect onComponentDidMount')
  }, [])

  /*
   * Test React Context. The Provider is coming from AppShell when federated.
   */
  useEffect(() => {
    console.log('ThemeState from Header', themeState)
  }, [themeState])

  /*
   * Test custom hook.
   */
  useEffect(() => {
    console.log('Custom Hook, page scrolled down to bottom', isBottom)
  }, [isBottom])

  return (
    <div>
      <div>
        <p data-testid="paragraph-in-header">I am the HEADERRRRR'"</p>
        <div>
          <p>Counter: {counter}</p>
          <button onClick={() => setCounter(counter + 1)}>Increment</button>
        </div>
      </div>
      <TextPositioner
        loadingFallback={<div>loading text positioner...</div>}
        errorFallback={<div>error loading text positioner!</div>}
        position="bottom"
      >
        {children}
      </TextPositioner>
    </div>
  )
}

export default Header
