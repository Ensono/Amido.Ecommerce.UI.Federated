import {render, screen, waitFor} from '@testing-library/react'

import App from './App'

test.skip('renders external components', async () => {
  render(<App />)
  await waitFor(() => {
    const sharedTextComponent = screen.getByText(/Error retreving your product/)
    expect(sharedTextComponent).toBeInTheDocument()
  })
})
