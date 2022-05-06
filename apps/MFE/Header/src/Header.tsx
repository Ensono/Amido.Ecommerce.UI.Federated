import React, {useEffect, useState} from 'react'

import HeaderCounter from './components/headerCounter'
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

const Header: React.FC = () => {
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
    <div>
      <div>
        <div>Local State Counter: {counter}</div>
        <button onClick={() => setCounter(counter + 1)}>Increase local state counter</button>
      </div>
      <HeaderCounter />
    </div>
  )
}

export default Header
