import {MemoryRouter} from 'react-router-dom'

import {render, waitFor} from '@testing-library/react'

import App from './App'

test('renders external components', async () => {
  const {container} = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  )
  await waitFor(() => {
    expect(container).toMatchSnapshot()
  })
})
