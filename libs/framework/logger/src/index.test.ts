/* eslint-disable @typescript-eslint/unbound-method */
import {Logger} from '.'

describe('logger', () => {
  it('Should return a function', () => {
    expect(Logger).toBeInstanceOf(Object)
  })

  it('Should have all methods implmented', () => {
    expect(Logger.info).toBeInstanceOf(Function)
    expect(Logger.error).toBeInstanceOf(Function)
    expect(Logger.debug).toBeInstanceOf(Function)
    expect(Logger.warn).toBeInstanceOf(Function)
    // expect(Logger.out).toBeInstanceOf(Function)
  })
})
