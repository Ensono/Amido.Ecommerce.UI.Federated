import {render, waitFor} from '@testing-library/react'

import Header from './Header'

describe('Header', () => {
  it('renders as expected', async () => {
    const {container} = render(<Header>foo bar</Header>)
    await waitFor(() => {
      expect(container).toMatchSnapshot()
    })
  })
})
