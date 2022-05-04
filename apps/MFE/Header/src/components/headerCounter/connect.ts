import {connect} from 'react-redux'

import {decrement, increment} from '../../ducks/headerCounter'
import {RootState} from '../../store'

export const mapStateToProps = (state: RootState, ownProps: any) => {
  return {
    count: state.headerCounter.value,
    ...ownProps,
  }
}

export const mergeProps = (state: RootState, {dispatch}, ownProps: any) => {
  return {
    ...state,
    ...ownProps,
    increment: () => dispatch(increment()),
    decrement: () => dispatch(decrement()),
  }
}

export default connect(mapStateToProps, null as any, mergeProps)
