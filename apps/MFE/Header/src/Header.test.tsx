import {Provider} from 'react-redux'

import {render, waitFor} from '@testing-library/react'

import Header from './Header'
import {headerStore} from './store'

describe('Header', () => {
  it('renders as expected', async () => {
    const {container} = render(
      <Provider store={headerStore}>
        <Header>foo bar</Header>
      </Provider>,
    )
    await waitFor(() => {
      expect(container).toMatchSnapshot()
    })
  })
})
