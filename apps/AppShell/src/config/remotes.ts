export const REMOTE_URLS = () => {
  try {
    return JSON.parse(process.env.REMOTE_URLS)
  } catch {
    return {}
  }
}
