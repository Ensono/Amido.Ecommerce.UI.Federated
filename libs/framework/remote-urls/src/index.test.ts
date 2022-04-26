import {getRemoteUrls} from '.'

const remotes = {
  mfe_1: 'http://localhost:3000',
  mfe_2: 'mfe_2@http://localhost:3001',
}

describe('getRemoteURLs', () => {
  it('handles plain urls', () => {
    global.process.env.REMOTE_URLS = JSON.stringify(remotes)
    const result = getRemoteUrls()
    expect(result.mfe_1).toEqual('http://localhost:3000')
  })

  it('handles URLs that specify an MFE', () => {
    global.process.env.REMOTE_URLS = JSON.stringify(remotes)
    const result = getRemoteUrls()
    expect(result.mfe_2).toEqual('http://localhost:3001')
  })

  it('handles an empty object', () => {
    global.process.env.REMOTE_URLS = JSON.stringify({})
    const result = getRemoteUrls()
    expect(result).toEqual({})
  })

  it('handles invalid JSON', () => {
    global.process.env.REMOTE_URLS = 'FOO BAR BIZ BAZ'
    const result = getRemoteUrls()
    expect(result).toEqual({})
  })
})
