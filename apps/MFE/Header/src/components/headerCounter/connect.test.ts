import {decrement, increment} from '../../ducks/headerCounter'
import {mapStateToProps, mergeProps} from './connect'

const mockState = {headerCounter: {value: 0}}
const mockDispatch = jest.fn()

describe('headerCounter - connect', () => {
  describe('mapStateToProps', () => {
    it('returns the headerCounter value', () => {
      const result = mapStateToProps(mockState, {})
      expect(result).toEqual({count: 0})
    })
  })

  describe('mergeProps', () => {
    let mergedProps

    beforeAll(() => {
      mergedProps = mergeProps(mockState, {dispatch: mockDispatch}, {})
    })

    it('creates increment and decrement functions', () => {
      expect(mergedProps.increment).toBeInstanceOf(Function)
      expect(mergedProps.decrement).toBeInstanceOf(Function)
    })

    it('the functions call dispatch', () => {
      mergedProps.increment()
      expect(mockDispatch).toHaveBeenCalledWith(increment())
      mergedProps.decrement()
      expect(mockDispatch).toHaveBeenCalledWith(decrement())
    })
  })
})
