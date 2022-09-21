import connect from './connect'

export const HeaderCounter = ({count, increment, decrement}) => {
  return (
    <div className="header_counter">
      <h2>
        Header Count: <span>{count}</span>
      </h2>
      <button onClick={increment}>Make number go up plz</button>
      <button onClick={decrement}>Make number go down pretty plz</button>
    </div>
  )
}
export default connect(HeaderCounter)
