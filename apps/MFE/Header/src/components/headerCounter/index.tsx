import connect from './connect'

export const HeaderCounter = ({count, increment, decrement}) => {
  return (
    <div>
      <h2>Header Count: {count}</h2>
      <button onClick={increment}>Make number go up plz</button>
      <button onClick={decrement}>Make number go down pretty plz</button>
    </div>
  )
}
export default connect(HeaderCounter)
