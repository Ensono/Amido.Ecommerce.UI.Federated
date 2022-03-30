/* eslint-disable @typescript-eslint/naming-convention */
import {createContext, lazy} from 'react'

import {Modules, ModulesContainer, RemotesContext} from './types'

declare global {
  function __webpack_init_sharing__(shareScope: string): Promise<void>
  const __webpack_share_scopes__: any
}

/**
 * ModuleFederationPlugin loading code (loaded through \<script\> tags from imported components)
 * cached globally as ctx[remote][module]
 *
 * @remarks
 * Read more {@link https://webpack.js.org/concepts/module-federation/}
 *
 * @param ctx - global object for caching resolved components
 * @param remote - scope for caching
 * @param module - exported module name
 * @param shareScope - webpack configured shareScope
 * @returns React Component
 */
export const getClientComponent = (ctx: RemotesContext, remote: string, module: string, shareScope: string) => {
  ctx[remote] = ctx[remote] || createContext({})
  const modules = ctx[remote] as Modules

  let Component = modules[module]
  if (!Component) {
    Component = lazy(async () => {
      const modulesContainer = (window as {[key: string]: any})[remote] as ModulesContainer
      await __webpack_init_sharing__(shareScope)
      if (!modulesContainer) {
        throw new Error(
          `Federated component ${module} from ${remote} not loaded, the app ${remote} might be down or the remote-entry.js relative to this remote is not available`,
        )
      }
      await modulesContainer.init(__webpack_share_scopes__.default)
      const factory = await modulesContainer.get(module)
      return factory()
    })
    modules[module] = Component
  }
  return Component
}
