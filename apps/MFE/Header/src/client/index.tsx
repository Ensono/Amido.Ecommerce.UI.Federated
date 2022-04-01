// required for shared modules to be loaded correctly
// https://webpack.js.org/concepts/module-federation/#uncaught-error-shared-module-is-not-available-for-eager-consumption
import('./bootstrap')
export default {}
