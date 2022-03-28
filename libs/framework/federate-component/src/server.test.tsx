import {Suspense} from 'react'

import '@testing-library/jest-dom'

import {render, screen, waitFor} from '@testing-library/react'
import axios from 'axios'

import {getServerComponent} from './server'

const mockData = `["http://localhost:3001/remote-entry.js","http://localhost:3001/remote-entry.css"]--||||--<footer data-testid="moodule-federated-footer">THIS IS THE FOOTER<!-- --><!--$--><div><p data-testid="paragraph-in-header">I am the HEADERRRRR&#x27;&quot;</p>‌children‌<!-- --></div><!--/$--></footer>`
jest.mock('axios')

function renderComponent() {
  // calling this in a before() hook causes React to spew specious warnings about wrapping tests in act()
  const Component = getServerComponent({}, 'coolRemote', 'coolModule', {}, 'coolRemoteUrl')
  render(
    <Suspense fallback="loading">
      <Component />
    </Suspense>,
  )
  return Component
}

describe('getServerComponent', () => {
  describe('if the component is not in the supplied context', () => {
    it.todo('does a POST request to the remote to get it')
    it.todo('adds it into the cache')
  })

  describe('if the component is in the supplied context', () => {
    it.todo('returns the component from the context')
  })

  describe('returns', () => {
    beforeAll(async () => {
      ;(axios as any).post.mockImplementation(() => Promise.resolve({data: mockData}))
    })

    it.todo('CSS chunks as link tags')

    it.todo('JS chunks as script tags')

    it('the rendered component', async () => {
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
})
