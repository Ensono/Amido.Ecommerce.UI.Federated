import {Suspense} from 'react'

import {Logger} from '@batman/core-logger'
import {render, waitFor} from '@testing-library/react'

import {getClientComponent} from './client'
import {ModulesContainer} from './types'

import {ErrorBoundary} from '.'

const mockFactory = jest.fn().mockImplementation(() => ({default: () => {}}))
const mockGet = jest.fn().mockImplementation(async () => mockFactory)
const mockInit = jest.fn().mockImplementation(async () => {})
const mockLoggerError = jest.spyOn(Logger, 'error')

global.__webpack_init_sharing__ = jest.fn().mockImplementation(async () => {})
;(global as any).__webpack_share_scopes__ = {default: async () => {}}

const coolRemote: ModulesContainer = {
  get get() {
    return mockGet
  },
  get init() {
    return mockInit
  },
}

describe('getClientComponent', () => {
  afterEach(() => jest.resetAllMocks())

  describe('if the remote is not in the context', () => {
    it('gets and inits the module from the ModulesContainer and puts it in the cache', async () => {
      ;(window as any).coolRemote = coolRemote
      const context = {} as any
      const Component = getClientComponent(context, 'coolRemote', 'coolModule', 'default')

      render(
        <Suspense fallback="loading">
          <Component />
        </Suspense>,
      )

      await waitFor(() => {
        expect(mockGet).toBeCalledTimes(1)
        expect(mockInit).toBeCalledTimes(1)
        expect(context.coolRemote).toBeTruthy()
      })
    })

    describe("if the ModulesContainer doesn't exist", () => {
      const oldError = console.error
      beforeAll(() => {
        // don't log errors we're deliberately causing, that's just noise
        console.error = jest.fn()
      })

      afterAll(() => {
        console.error = oldError
      })

      it('throws an error', async () => {
        ;(window as any).coolRemote = undefined
        const Component = getClientComponent({}, 'coolRemote', 'coolModule', 'default')

        render(
          <Suspense fallback="loading">
            <ErrorBoundary>
              <Component />
            </ErrorBoundary>
          </Suspense>,
        )

        await waitFor(() => {
          expect(mockLoggerError).toBeCalledWith(
            'Federated component coolModule from coolRemote not loaded, the app coolRemote might be down or the remote-entry.js relative to this remote is not available',
          )
        })
      })
    })
  })

  describe('if the remote is already in the context', () => {
    it('returns the module from the context', async () => {
      ;(window as any).coolRemote = coolRemote
      const mockComponent = jest.fn()
      const Component = getClientComponent(
        {coolRemote: {coolModule: mockComponent} as any},
        'coolRemote',
        'coolModule',
        'default',
      )

      render(
        <Suspense fallback="loading">
          <Component />
        </Suspense>,
      )

      await waitFor(() => {
        expect(mockGet).toBeCalledTimes(0)
        expect(mockInit).toBeCalledTimes(0)
        expect(mockComponent).toBeCalledTimes(1)
      })
    })
  })
})
