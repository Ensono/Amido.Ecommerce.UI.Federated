import React from 'react'

// import {federateComponent} from '@batman/federate-component'
// import {getRemoteUrls} from '@batman/remote-urls'

import HeaderCounter from './components/headerCounter'

// const REMOTES = getRemoteUrls()

// const TextPositioner = federateComponent('mfe_text_positioner', './text-positioner', REMOTES.mfe_text_positioner)

const Header: React.FC = ({children}) => {
  return (
    <div>
      <HeaderCounter />
    </div>
  )
}

export default Header
