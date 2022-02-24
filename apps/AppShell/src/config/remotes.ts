import {env} from 'process'

export const REMOTE_URLS = () => {
  try {
    return JSON.parse(env.REMOTE_URLS)
  } catch {
    return {}
  }
}
