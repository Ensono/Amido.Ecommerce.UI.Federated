import {helmetGuard} from './helmet'

describe('Helmet Middleware', () => {
  it('Should return a function', () => {
    expect(helmetGuard).toBeInstanceOf(Function)
  })
})
