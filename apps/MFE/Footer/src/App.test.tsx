import {render, screen, waitFor} from '@testing-library/react'

import App from './App'

test('renders', async () => {
  render(<App />)
  const footerText = screen.getByText(`THIS IS THE FOOTER`)
  await waitFor(() => {
    expect(footerText).toBeInTheDocument()
  })
})
