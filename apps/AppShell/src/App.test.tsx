import {MemoryRouter} from 'react-router-dom'

import {render, screen, waitFor} from '@testing-library/react'

import App from './App'

test('renders external components', async () => {
  render(
    <MemoryRouter initialEntries={['/app']}>
      <App />
    </MemoryRouter>,
  )

  await waitFor(() => {
    const sharedTextComponent = screen.getByText(/Shared text/i)

    expect(sharedTextComponent).toBeInTheDocument()
  })
})
