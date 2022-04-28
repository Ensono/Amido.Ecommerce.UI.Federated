import {increment, set} from '../../ducks/counter'
import {mapStateToProps, mergeProps} from './connect'

const mockState = {counter: {value: 0}}
const mockDispatch = jest.fn()

describe('counter - connect', () => {
  describe('mapStateToProps', () => {
    it('returns the counter value', () => {
      const result = mapStateToProps(mockState, {})
      expect(result).toEqual({count: 0})
    })
  })

  describe('mergeProps', () => {
    let mergedProps: any

    beforeAll(() => {
      mergedProps = mergeProps(mockState, {dispatch: mockDispatch}, {})
    })

    it('creates increment and reset functions', () => {
      expect(mergedProps.increment).toBeInstanceOf(Function)
      expect(mergedProps.reset).toBeInstanceOf(Function)
    })

    it('the functions call dispatch', () => {
      mergedProps.increment()
      expect(mockDispatch).toHaveBeenCalledWith(increment())
      mergedProps.reset()
      expect(mockDispatch).toHaveBeenCalledWith(set(0))
    })
  })
})
