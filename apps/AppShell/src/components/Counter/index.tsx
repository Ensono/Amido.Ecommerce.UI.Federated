import connect from './connect'

interface CounterProps {
  count: number
  increment: () => void
  reset: () => void
}

export const Counter = ({count, increment, reset}: CounterProps) => {
  return (
    <div>
      <h2 data-testid="count">Count: {count}</h2>
      <button data-testid="increment-button" onClick={increment}>
        Make number go up plz
      </button>
      <button data-testid="reset-button" onClick={reset}>
        Reset
      </button>
    </div>
  )
}
export default connect(Counter)
