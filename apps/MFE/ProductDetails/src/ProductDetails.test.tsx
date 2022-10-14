import React from 'react'
import {MemoryRouter, Route, Routes} from 'react-router-dom'

import {render, waitFor} from '@testing-library/react'

import ProductDetails from './ProductDetails'

describe('ProductDetails', () => {
  it('displays a product when provided the correct id', async () => {
    const {container} = render(<ProductDetails />, {
      wrapper: ({children}: React.PropsWithChildren) => (
        <MemoryRouter initialEntries={['/2']}>
          <Routes>
            <Route path="/:id" element={children} />
          </Routes>
        </MemoryRouter>
      ),
    })

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
