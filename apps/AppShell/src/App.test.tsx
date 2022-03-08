import {render, screen} from '@testing-library/react'

import App from './App'

test('renders external components', () => {
  render(<App />)
  const sharedTextComponent = screen.getByText(/Shared text/i)

  expect(sharedTextComponent).toBeInTheDocument()
})
