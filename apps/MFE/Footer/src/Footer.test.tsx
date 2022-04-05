import {render, waitFor} from '@testing-library/react'

import Footer from './Footer'

describe('Footer', () => {
  it('renders as expected', async () => {
    const {container} = render(<Footer>foo bar</Footer>)
    await waitFor(() => {
      expect(container).toMatchSnapshot()
    })
  })
})
