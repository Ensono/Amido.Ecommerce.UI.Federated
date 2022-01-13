import React from 'react'

import { render, screen } from '@testing-library/react'

import App from './App.tsx'

test('renders external components', () => {
  render(<App />)
  const linkElement = screen.getByText(/This comes from UI! 1.0.0/i)
  const sharedTextComponent = screen.getByText(/Shared text/i)

  expect(linkElement).toBeInTheDocument()
  expect(sharedTextComponent).toBeInTheDocument()
})
