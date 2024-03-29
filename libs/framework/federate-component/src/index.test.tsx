import {BrowserRouter} from 'react-router-dom'

import {render} from '@testing-library/react'
import {renderToString} from 'react-dom/server'
import {StaticRouter} from 'react-router-dom/server'

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
      const Component = federateComponent({remote: 'remote', module: 'module', remoteUrl: 'remoteUrl'})
      render(<Component {...props} />, {wrapper: BrowserRouter})
      expect(getClientComponent).toBeCalledTimes(1)
      expect(getServerComponent).not.toBeCalled()
    })

    it('returns a component that renders correctly', () => {
      const Component = federateComponent({remote: 'remote', module: 'module', remoteUrl: 'remoteUrl'})
      const clientProps = {...props, env: 'client'}
      const {container} = render(<Component {...clientProps} />, {wrapper: BrowserRouter})
      expect(container).toMatchSnapshot()
    })
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
      const Component = federateComponent({remote: 'remote', module: 'module', remoteUrl: 'remoteUrl'})
      renderToString(
        <StaticRouter location="/">
          <Component />
        </StaticRouter>,
      )

      expect(getServerComponent).toBeCalledTimes(1)
      expect(getClientComponent).not.toBeCalled()
    })

    it('returns a component that renders correctly', () => {
      const Component = federateComponent({remote: 'remote', module: 'module', remoteUrl: 'remoteUrl'})
      const serverProps = {...props, env: 'server'}
      // eslint-disable-next-line testing-library/render-result-naming-convention
      const result = renderToString(
        <StaticRouter location="/">
          <Component {...serverProps} />
        </StaticRouter>,
      )
      expect(result).toMatchSnapshot()
    })
  })
})
