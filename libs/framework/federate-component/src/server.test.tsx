import {Suspense} from 'react'
import '@testing-library/jest-dom'

import {Logger} from '@batman/core-logger'
import {act, render, screen, waitFor} from '@testing-library/react'
import axios from 'axios'

import {getServerComponent} from './server'

import {ErrorBoundary} from '.'

const mockData = `["http://localhost:3001/remote-entry.js","http://localhost:3001/remote-entry.css"]--||||--<footer data-testid="moodule-federated-footer">THIS IS THE FOOTER<!-- --><!--$--><div><p data-testid="paragraph-in-header">I am the HEADERRRRR&#x27;&quot;</p>‌children‌<!-- --></div><!--/$--></footer>`
const mockBadData = `help something went wrong this isn't JSON--||||--<footer data-testid="moodule-federated-footer">THIS IS THE FOOTER<!-- --><!--$--><div><p data-testid="paragraph-in-header">I am the HEADERRRRR&#x27;&quot;</p>‌children‌<!-- --></div><!--/$--></footer>`

jest.mock('axios')
jest.mock('@batman/core-logger')
const mockLoggerError = jest.fn()
Logger.error = mockLoggerError

function renderComponent(context = {}) {
  const Component = getServerComponent(context, 'coolRemote', 'coolModule', {}, 'http://coolRemoteUrl:3000')
  const {container} = render(
    <Suspense fallback="loading">
      <ErrorBoundary>
        <Component />
      </ErrorBoundary>
    </Suspense>,
  )
  return container
}

describe('getServerComponent', () => {
  let mockGet: any
  beforeEach(() => {
    mockGet = jest.fn(() => Promise.resolve({data: mockData}))
    ;(axios as any).mockImplementation(mockGet)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('if the component is not in the supplied context', () => {
    it("does a POST request to the remote's prerender endpoint", async () => {
      renderComponent()

      await waitFor(() => {
        expect(mockGet).toHaveBeenCalledWith('http://coolRemoteUrl:9000/3000/prerender', {
          data: {module: 'coolModule', props: {}},
          headers: {'content-type': 'application/json', 'remote-name': 'coolRemote'},
          method: 'POST',
        })

        // useless assertion stops the test from completing before the render has finished
        // silences a warning about asserting on suspended data
        expect(screen.getByTestId('moodule-federated-footer')).toBeInTheDocument()
      })
    })

    it('adds it into the cache', async () => {
      const context: any = {}
      renderComponent(context)

      await waitFor(() => {
        expect(context['{"module":"coolModule","props":{},"remote":"coolRemote"}']).toBeTruthy()
        // useless assertion stops the test from completing before the render has finished
        expect(screen.getByTestId('moodule-federated-footer')).toBeInTheDocument()
      })
    })
  })

  describe('if the component is in the supplied context', () => {
    it('returns the component from the context', () => {
      const mockComponent = jest.fn()
      const context: any = {'{"module":"coolModule","props":{},"remote":"coolRemote"}': mockComponent}
      const Component = getServerComponent(context, 'coolRemote', 'coolModule', {}, 'coolRemoteUrl')
      expect(Component).toEqual(mockComponent)
    })
  })

  describe('returns a component that can be rendered', () => {
    beforeEach(() => {
      ;(axios as any).mockImplementation(() => Promise.resolve({data: mockData}))
    })

    it('with CSS chunks as link tags', async () => {
      // eslint-disable-next-line testing-library/render-result-naming-convention
      const container = renderComponent()
      await waitFor(() => {
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const link = container.querySelector('link')
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', 'http://localhost:3001/remote-entry.css')
      })
    })

    // This doesn't get rendered by the test renderer, does it get rendered by the real renderer?
    it.todo('with JS chunks as script tags')

    it('with the markup from nested components', async () => {
      renderComponent()
      await waitFor(() => {
        const footer = screen.getByTestId('moodule-federated-footer')
        expect(footer).toBeInTheDocument()
        expect(footer).toHaveTextContent('THIS IS THE FOOTER')

        const paragraph = screen.getByTestId('paragraph-in-header')
        expect(paragraph).toBeInTheDocument()
        expect(paragraph).toHaveTextContent(`I am the HEADERRRRR'"`)
      })
    })
  })

  describe("if the chunks aren't valid json", () => {
    beforeEach(() => {
      ;(axios as any).mockImplementation(() => Promise.resolve({data: mockBadData}))
    })

    it('still renders the markup', async () => {
      renderComponent()
      await waitFor(() => {
        const footer = screen.getByTestId('moodule-federated-footer')
        expect(footer).toBeInTheDocument()
        expect(footer).toHaveTextContent('THIS IS THE FOOTER')

        const paragraph = screen.getByTestId('paragraph-in-header')
        expect(paragraph).toBeInTheDocument()
        expect(paragraph).toHaveTextContent(`I am the HEADERRRRR'"`)
      })
    })

    it('without the chunks', async () => {
      // eslint-disable-next-line testing-library/render-result-naming-convention
      const container = renderComponent()
      await waitFor(() => {
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const link = container.querySelector('link')
        expect(link).not.toBeInTheDocument()
        expect(screen.getByTestId('moodule-federated-footer')).toBeInTheDocument()
      })
    })
  })

  describe('if the prerender endpoint is unavailable', () => {
    /* eslint-disable no-console */
    const oldError = console.error

    beforeAll(() => {
      console.error = jest.fn()
    })

    afterAll(() => {
      console.error = oldError
    })
    /* eslint-enable no-console */

    it('throws and logs an error', async () => {
      const err = new Error('oh no')
      ;(axios as any).mockImplementation(() => Promise.reject(err))
      act(() => {
        renderComponent()
      })
      await waitFor(() => {
        expect(mockLoggerError).toHaveBeenCalledWith('oh no')
      })
    })
  })
})
