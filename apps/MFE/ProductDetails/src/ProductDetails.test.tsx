import {render, waitFor} from '@testing-library/react'

import ProductListing from './ProductDetails'

describe('ProductDetails', () => {
  it('renders as expected', async () => {
    const {container} = render(<ProductListing>foo bar</ProductListing>)
    await waitFor(() => {
      expect(container).toMatchSnapshot()
    })
  })
})
