import {Provider} from 'react-redux'

import {render, screen, waitFor} from '@testing-library/react'

import App from './App'
import {headerStore} from './store'

test('renders external components', async () => {
  render(
    <Provider store={headerStore}>
      <App />
    </Provider>,
  )
  await waitFor(() => {
    const sharedTextComponent = screen.getByRole('heading')
    expect(sharedTextComponent).toHaveTextContent(/Header Count: 0/)
  })
})
