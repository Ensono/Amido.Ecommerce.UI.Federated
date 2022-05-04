import {render, waitFor} from '@testing-library/react'

import {HeaderCounter} from '.'

describe('headerCounter', () => {
  it('matches the snapshot', async () => {
    const {container} = render(<HeaderCounter count={0} increment={jest.fn()} decrement={jest.fn()} />)
    await waitFor(() => {
      expect(container).toMatchSnapshot()
    })
  })
})
