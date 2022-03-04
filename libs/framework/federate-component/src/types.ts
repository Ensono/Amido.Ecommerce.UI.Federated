export type Module = React.LazyExoticComponent<any>

export interface Modules {
  [module: string]: Module
}

export interface RemotesContext {
  [remote: string]: Module | Modules
}

export type ModuleFactory = () => {default: Module}

export interface ModulesContainer {
  init(shareScope: string): Promise<void>
  get(module: string): Promise<ModuleFactory>
}

export interface PrerenderedModule {
  chunks: string[]
  html: string
}
