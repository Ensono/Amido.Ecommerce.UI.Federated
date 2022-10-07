import {MemoryRouter} from 'react-router-dom'

import {render, waitFor} from '@testing-library/react'

import ProductListing from './ProductListing'

describe('ProductListing', () => {
  it('renders as expected', async () => {
    const {container} = render(
      <MemoryRouter>
        <ProductListing />
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(container).toMatchSnapshot()
    })
  })
})
