// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {getClientComponent} from './client'

describe('getClientComponent', () => {
  describe('if the remote is already in the context', () => {
    it.todo('returns the module from the context')
  })

  describe('if the remote is not in the context', () => {
    it.todo('returns the module from the webpack share scope?')
    it.todo("throws an error if it can't find the module container")
  })
})
