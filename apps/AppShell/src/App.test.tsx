import {Provider} from 'react-redux'
import {MemoryRouter} from 'react-router-dom'

import {render} from '@testing-library/react'

import App from './App'
import {store} from './store'

jest.mock('@batman/federate-component', () => {
  return {
    __esModule: true,
    federateComponent: ({remote}: any) =>
      function mockComponent() {
        return <section>{remote}</section>
      },
  }
})

describe('App', () => {
  describe('Routes', () => {
    const routes = ['/app', '/app/productListing', '/app/productDetails/1', '/app/error-example']
    it.each(routes)('should naviagate successfully to the %s page', route => {
      const {container} = render(
        <Provider store={store}>
          <MemoryRouter initialEntries={[route]}>
            <App />
          </MemoryRouter>
        </Provider>,
      )
      expect(container).toMatchSnapshot()
    })
  })
})
