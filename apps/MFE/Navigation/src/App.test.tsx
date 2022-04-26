import {MemoryRouter} from 'react-router-dom'

import {render, screen} from '@testing-library/react'

import App from './App'

test('renders external components', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  )
  const sharedTextComponent = screen.getByText(/Shared text/i)

  expect(sharedTextComponent).toBeInTheDocument()
})
