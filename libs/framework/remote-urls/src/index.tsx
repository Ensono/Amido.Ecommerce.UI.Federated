import {Logger} from '@batman/core-logger'

export const getRemoteUrls = () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const remotes = JSON.parse(process.env.REMOTE_URLS!)
    Object.keys(remotes).forEach(remote => {
      if (remotes[remote].includes('@')) {
        remotes[remote] = remotes[remote].split('@')[1]
      }
    })
    return remotes
  } catch (err: any) {
    Logger.error(err)
    return {}
  }
}
