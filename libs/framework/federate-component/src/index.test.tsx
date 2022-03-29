import {render} from '@testing-library/react'
import {renderToString} from 'react-dom/server'

import {getClientComponent} from './client'
import {getServerComponent} from './server'

import {federateComponent} from '.'

const MockComponent = ({env}: {env: string}) => <p>What's up yo, I'm on the {env}</p>

jest.mock('./server', () => ({
  getServerComponent: jest.fn(() => MockComponent),
}))

jest.mock('./client', () => ({
  getClientComponent: jest.fn(() => MockComponent),
}))

const props = {
  loadingFallback: <p>loading</p>,
  errorFallback: <p>error</p>,
}

describe('federateComponent', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('on the client', () => {
    it('calls getClientComponent', () => {
      federateComponent('remote', 'module', 'remoteUrl')(props)
      expect(getClientComponent).toBeCalledTimes(1)
    })

    it("doesn't call getServerComponent", () => {
      federateComponent('remote', 'module', 'remoteUrl')(props)
      expect(getServerComponent).not.toBeCalled()
    })

    it('returns a component that renders correctly', () => {
      const Component = federateComponent('remote', 'module', 'remoteUrl')
      const clientProps = {...props, env: 'client'}
      const {container} = render(<Component {...clientProps} />)
      expect(container).toMatchSnapshot()
    })

    it.todo('renders the correct error fallback if required')
  })

  describe('on the server', () => {
    const {window} = global

    beforeAll(() => {
      delete (global as any).window
    })

    afterAll(() => {
      global.window = window
    })

    it('calls getServerComponent', () => {
      federateComponent('remote', 'module', 'remoteUrl')({})
      expect(getServerComponent).toBeCalledTimes(1)
    })

    it("doesn't call getClientComponent", () => {
      federateComponent('remote', 'module', 'remoteUrl')({})
      expect(getClientComponent).not.toBeCalled()
    })

    it('returns a component that renders correctly', () => {
      const Component = federateComponent('remote', 'module', 'remoteUrl')
      const serverProps = {...props, env: 'server'}
      // eslint-disable-next-line testing-library/render-result-naming-convention
      const result = renderToString(<Component {...serverProps} />)
      expect(result).toMatchSnapshot()
    })

    it.todo('renders the correct error fallback if required')
  })
})
