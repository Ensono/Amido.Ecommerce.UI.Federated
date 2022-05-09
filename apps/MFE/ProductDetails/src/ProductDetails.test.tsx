import {render, waitFor} from '@testing-library/react'

import ProductDetails from './ProductDetails'

describe('ProductDetails', () => {
  it('displays a product when provided the correct id', async () => {
    const {container} = render(<ProductDetails id="2" />)

    await waitFor(() => {
      expect(container).toMatchSnapshot()
    })
  })
  it('displays an error when no context is provided', async () => {
    const {container} = render(<ProductDetails />)

    await waitFor(() => {
      expect(container).toMatchSnapshot()
    })
  })
})
