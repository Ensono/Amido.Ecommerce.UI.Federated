import {render, screen, waitFor} from '@testing-library/react'

import App from './App'

describe('footer container app', () => {
  it('renders', async () => {
    render(<App />)
    const footerText = screen.getByText(`I AM THE FOOTER`)
    await waitFor(() => {
      expect(footerText).toBeInTheDocument()
    })
  })
})
