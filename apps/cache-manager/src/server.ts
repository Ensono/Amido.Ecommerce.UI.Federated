const express = require('express')
const fetch = require('node-fetch')
const NodeCache = require('node-cache')
const fs = require('fs')
const http = require('http')

const myCache = new NodeCache({stdTTL: 600})

const remoteUrl = 'http://localhost:3001/remote-entry.js'

async function getHeader() {
  const response = await fetch(`http://localhost:3001/remote-entry.js`)

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  console.log('=======================================================')
  console.log('response')
  console.log(response.body)
  console.log('=======================================================')

  return response.json()
}

const app = express()

app.get('/localhost:3001/remote-entry.js', async (req, res) => {
  try {
    const readFile = http.get(remoteUrl)

    console.log('readFile')
    console.log(readFile)
    console.log('readFile')

    res.write(readFile)
    res.end()

    // try to get the posts from the cache
    let header = myCache.get('getHeader')
    console.log('=======================================================')
    console.log('yoyoyoyoy')
    // console.log(req.body)
    console.log('=======================================================')
    // if header does not exist in the cache, retrieve it from the
    // original source and store it in the cache
    if (header == null) {
      header = await getHeader()
      // time-to-live is set to 300 seconds. After this period
      // the entry for `getHeader` will be removed from the cache
      // and the next request will hit the API again
      myCache.set('getHeader', header, 300)
    }

    res.status(200).send(header)
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

const port = 9000
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
