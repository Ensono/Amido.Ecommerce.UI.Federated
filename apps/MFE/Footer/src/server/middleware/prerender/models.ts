export interface ExposedModule {
  chunks: Array<string>
  sharedModules: Array<SharedModule>
}

export interface SharedModule {
  chunks: Array<string>
  provides: Array<SharedDependency>
}

export interface SharedDependency {
  shareScope: string
  shareKey: string
  requiredVersion: string
  strictVersion: boolean
  singleton: boolean
  eager: boolean
}
