import {useDispatch, useSelector} from 'react-redux'

import {RootState, headerCounterActions} from '../../store'

const {increment, decrement} = headerCounterActions

const HeaderCounter = () => {
  const count = useSelector((state: RootState) => state?.headerCounter?.value)
  const dispatch = useDispatch()

  return (
    <div>
      <h2>Header Count: {count}</h2>
      <button onClick={() => dispatch(increment())}>Make number go up plz</button>
      <button onClick={() => dispatch(decrement())}>Make number go down pretty plz</button>
    </div>
  )
}
export default HeaderCounter
