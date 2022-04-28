export const combineInitialState = (initalState: any, state: any) => {
  const allstates: any = {}

  const keys = Object.keys(initalState)
  allstates[keys[0]] = initalState[keys[0]]

  const combinedStates = Array.from(state).reduce((p: any, c: any) => {
    if (c.dataset.state) {
      const text = c.innerText.replaceAll('&quot;', '"')
      if (text !== 'NO STATE') {
        const obj = JSON.parse(text)
        const keys = Object.keys(obj)
        allstates[keys[0]] = obj[keys[0]]
        p.push(text)
      }
    }
    return p
  }, [])

  return allstates
}
