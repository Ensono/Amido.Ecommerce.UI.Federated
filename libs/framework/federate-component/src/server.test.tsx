import {Suspense} from 'react'
import '@testing-library/jest-dom'

import {Logger} from '@next/core-logger'
import {act, render, screen, waitFor} from '@testing-library/react'
import axios from 'axios'

import {getServerComponent} from './server'

import {ErrorBoundary} from '.'

const mockData = `["http://localhost:3001/remote-entry.js","http://localhost:3001/remote-entry.css"]--||||--<footer data-testid="moodule-federated-footer">THIS IS THE FOOTER<!-- --><!--$--><div><p data-testid="paragraph-in-header">I am the HEADERRRRR&#x27;&quot;</p>‌children‌<!-- --></div><!--/$--></footer>`

jest.mock('axios')
jest.mock('@next/core-logger')
const mockLoggerError = jest.fn()
Logger.error = mockLoggerError

function renderComponent() {
  // calling this in a before() hook causes React to spew specious warnings about wrapping tests in act()
  const Component = getServerComponent({}, 'coolRemote', 'coolModule', {}, 'coolRemoteUrl')
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
  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('if the component is not in the supplied context', () => {
    it.todo('does a POST request to the remote to get it')
    it.todo('adds it into the cache')
  })

  describe('if the component is in the supplied context', () => {
    it.todo('returns the component from the context')
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

  describe('if the prerender endpoint is unavailable', () => {
    const oldError = console.error

    beforeAll(() => {
      console.error = jest.fn()
    })

    afterAll(() => {
      console.error = oldError
    })

    it('logs an error', async () => {
      const err = new Error('oh no')
      ;(axios as any).mockImplementation(() => Promise.reject(err))
      act(() => {
        renderComponent()
      })
      await waitFor(() => {
        expect(mockLoggerError).toHaveBeenCalledWith(err)
      })
    })
  })
})
