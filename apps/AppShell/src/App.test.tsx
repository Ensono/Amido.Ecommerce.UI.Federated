import {Provider} from 'react-redux'

import {render, screen, waitFor} from '@testing-library/react'

import App from './App'
import {store} from './store'

test('renders external components', async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  )

  await waitFor(() => {
    const sharedTextComponent = screen.getByText(/Shared text/i)

    expect(sharedTextComponent).toBeInTheDocument()
  })
})
