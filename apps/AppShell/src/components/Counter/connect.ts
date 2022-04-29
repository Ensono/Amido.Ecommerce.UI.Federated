import {connect} from 'react-redux'

import {increment, set} from '../../ducks/counter'
import {RootState} from '../../store'

export const mapStateToProps = (state: RootState, ownProps: any) => {
  return {
    count: state.counter.value,
    ...ownProps,
  }
}

export const mergeProps = (state: RootState, {dispatch}: any, ownProps: any) => {
  return {
    ...state,
    ...ownProps,
    increment: () => dispatch(increment()),
    reset: () => dispatch(set(0)),
  }
}

export default connect(mapStateToProps, null as any, mergeProps)
