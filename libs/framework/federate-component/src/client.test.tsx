import {Suspense} from 'react'

import {render, waitFor} from '@testing-library/react'

import {getClientComponent} from './client'
import {ModulesContainer} from './types'

const mockFactory = jest.fn().mockImplementation(() => ({default: () => {}}))
const mockGet = jest.fn().mockImplementation(async () => mockFactory)
const mockInit = jest.fn().mockImplementation(async () => {})

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

;(window as any).coolRemote = coolRemote

describe('getClientComponent', () => {
  afterEach(() => jest.resetAllMocks())

  describe('if the remote is not in the context', () => {
    it('gets and inits the module from the ModulesContainer', async () => {
      const Component = getClientComponent({}, 'coolRemote', 'coolModule', 'default')

      render(
        <Suspense fallback="loading">
          <Component />
        </Suspense>,
      )

      await waitFor(() => {
        expect(mockGet).toBeCalledTimes(1)
        expect(mockInit).toBeCalledTimes(1)
      })
    })

    it.todo("throws an error if it can't find the module container")
  })

  describe('if the remote is already in the context', () => {
    it.todo('returns the module from the context')
  })
})
