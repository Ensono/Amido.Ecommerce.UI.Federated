import {httpLogger} from './http-logger'

describe('httpLogger', () => {
  it('Should return a function in dev', () => {
    expect(httpLogger(true)).toBeInstanceOf(Function)
  })
  it('Should return a function in prod', () => {
    expect(httpLogger(false)).toBeInstanceOf(Function)
  })
})
