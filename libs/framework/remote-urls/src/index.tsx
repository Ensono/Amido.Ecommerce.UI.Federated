export const getRemoteUrls = () => {
  try {
    return JSON.parse(process.env.REMOTE_URLS!)
  } catch {
    return {}
  }
}
