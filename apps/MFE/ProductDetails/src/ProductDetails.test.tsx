import {MemoryRouter, Route, Routes} from 'react-router-dom'

import {render, waitFor} from '@testing-library/react'

import ProductDetails from './ProductDetails'

describe('ProductDetails', () => {
  it('displays a product when provided the correct path', async () => {
    const {container} = render(
      <MemoryRouter initialEntries={['/app/productDetails/2']}>
        <Routes>
          <Route path="/app/productDetails/:id" element={<ProductDetails />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(container).toMatchSnapshot()
    })
  })
  it('displays an error when no context is provided', async () => {
    const {container} = render(
      <MemoryRouter initialEntries={['/app/productDetails/10']}>
        <Routes>
          <Route path="/app/productDetails/:id" element={<ProductDetails />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(container).toMatchSnapshot()
    })
  })
})
