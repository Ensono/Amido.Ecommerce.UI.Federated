// import "react-html-parser": "^2.0.2" in package.json

import {lazy} from 'react'
import ReactHtmlParser from 'react-html-parser'

import axios from 'axios'
import stringify from 'json-stringify-deterministic'

import {Module, PrerenderedModule, RemoteUrls, RemotesContext} from './types'

export const getServerComponent = (
  ctx: RemotesContext,
  remote: string,
  module: string,
  props: {[key: string]: any},
  remoteUrls: RemoteUrls,
) => {
  // We cache based on properties. This allows us to only
  // do one fetch for multiple references of a remote component.
  const id = stringify({remote, module, props})

  let Component = ctx[id] as Module

  if (!Component) {
    Component = lazy(() =>
      // Do the post request to pre-render the federated component
      axios
        .post(`${remoteUrls[remote]}/prerender`, {
          headers: {
            'content-type': 'application/json',
          },
          body: stringify({
            module,
            props,
          }),
        })
        .then((res: any) => {
          const {chunks, html} = res as PrerenderedModule

          return {
            default: () => (
              <>
                {/* Add style chunks and async script tags for the script chunks. */}
                {chunks.map(chunk =>
                  chunk.endsWith('.css') ? (
                    <link key={chunk} rel="stylesheet" href={`${remoteUrls[remote]}/build/${chunk}`} />
                  ) : (
                    <script key={chunk} async src={`${remoteUrls[remote]}/build/${chunk}`} />
                  ),
                )}
                {/* Render the re-constructed react element */}
                {ReactHtmlParser(html)}
              </>
            ),
          }
        }),
    )
    ctx[id] = Component
  }

  return Component
}
