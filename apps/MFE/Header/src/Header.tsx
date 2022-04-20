import React from 'react'
import {useSelector} from 'react-redux'

import {federateComponent} from '@batman/federate-component'
import {getRemoteUrls} from '@batman/remote-urls'

const REMOTES = getRemoteUrls()

const TextPositioner = federateComponent('mfe_text_positioner', './text-positioner', REMOTES.mfe_text_positioner)

const Header: React.FC = ({children}) => {
  const count = useSelector(state => (state as any).counter.value)
  return (
    <div>
      <div>
        <p>Count: {count}</p>
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
