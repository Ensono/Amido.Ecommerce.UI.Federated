import {MemoryRouter} from 'react-router-dom'

import {fireEvent, render, screen} from '@testing-library/react'

import App from './App'

jest.mock('@batman/federate-component', () => {
  return {
    __esModule: true,
    federateComponent: (remote: string) =>
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
        <MemoryRouter initialEntries={[route]}>
          <App />
        </MemoryRouter>,
      )
      expect(container).toMatchSnapshot()
    })
  })

  describe('Page 1', () => {
    it('should display a log in the console when clicked', async () => {
      const consoleLogMock = jest.spyOn(console, 'log').mockImplementation()

      render(
        <MemoryRouter initialEntries={['/app']}>
          <App />
        </MemoryRouter>,
      )

      expect(consoleLogMock).not.toBeCalled()
      fireEvent.click(screen.getByText('Page 1'))
      expect(consoleLogMock).toBeCalled()

      consoleLogMock.mockRestore()
    })
  })
})
