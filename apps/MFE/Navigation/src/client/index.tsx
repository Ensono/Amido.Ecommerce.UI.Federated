/**
 * This import structure is required so Webpack splits chunks correctly, so shared
 * modules are loaded when running the micro-frontend on its own.
 * See {@link https://webpack.js.org/concepts/module-federation/#uncaught-error-shared-module-is-not-available-for-eager-consumption}
 */

import('./bootstrap')
export default {}
