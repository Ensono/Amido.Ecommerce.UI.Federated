import connect from './connect'

interface CounterProps {
  count: number
  increment: () => void
  reset: () => void
}

export const Counter = ({count, increment, reset}: CounterProps) => {
  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={increment}>Make number go up plz</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
export default connect(Counter)
