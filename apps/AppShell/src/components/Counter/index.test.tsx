import {render, waitFor} from '@testing-library/react'

import {Counter} from '.'

describe('Counter', () => {
  it('matches the snapshot', async () => {
    const {container} = render(<Counter count={0} increment={jest.fn()} reset={jest.fn()} />)
    await waitFor(() => {
      expect(container).toMatchSnapshot()
    })
  })
})
