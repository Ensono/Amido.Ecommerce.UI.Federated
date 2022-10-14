import {FC, StrictMode, createContext} from 'react'
import {Route, Routes} from 'react-router-dom'

import {Text} from '@batman-ui-components/text'
import {federateComponent} from '@batman/federate-component'
import {getRemoteUrls} from '@batman/remote-urls'

import Counter from './components/Counter'

import './App.css'

const ThemeContext = createContext(null)

export const ThemeProvider = ({children, data}: any) => {
  return <ThemeContext.Provider value={data}>{children}</ThemeContext.Provider>
}

const remotesUrls = getRemoteUrls()

const Header = federateComponent({
  remote: 'mfe_header',
  module: './header',
  remoteUrl: remotesUrls.mfe_header,
  cacheUrl: process.env.CACHE_MANAGER_URL,
})
const Footer = federateComponent({
  remote: 'mfe_footer',
  module: './footer',
  remoteUrl: remotesUrls.mfe_footer,
  cacheUrl: process.env.CACHE_MANAGER_URL,
})
const ProductListing = federateComponent({
  remote: 'mfe_product_listing',
  module: './product-listing',
  remoteUrl: remotesUrls.mfe_product_listing,
  cacheUrl: process.env.CACHE_MANAGER_URL,
})
const ProductDetails = federateComponent({
  remote: 'mfe_product_details',
  module: './product-details',
  remoteUrl: remotesUrls.mfe_product_details,
  cacheUrl: process.env.CACHE_MANAGER_URL,
  forwardRoute: true,
})

/**
 * Host app that consumes micro-front-ends and renders them together
 * @remarks
 *
 */
// TODO: Add error page for invalid route
const App: FC = () => {
  return (
    <StrictMode>
      <ThemeProvider value={{}}>
        <Header loadingFallback={<div>Loading header...</div>} errorFallback={<div>Error loading header</div>}>
          SSR header!
        </Header>
        <Routes>
          <Route
            path="/app"
            element={
              <div className="App">
                <section className="App-header">
                  <p>Page 1</p>
                  <Counter />
                  <Text />
                </section>
              </div>
            }
          />
          <Route
            path="/app/productListing"
            element={
              <ProductListing
                loadingFallback={<div>Loading product listing...</div>}
                errorFallback={<div>Error loading product listing</div>}
              />
            }
          />
          <Route
            path="/app/productDetails/:id"
            element={
              <ProductDetails
                loadingFallback={<div>Loading product details...</div>}
                errorFallback={<div>Error loading product details</div>}
              />
            }
          />
        </Routes>
        <Footer loadingFallback={<div>Loading footer...</div>} errorFallback={<div>Error loading footer</div>}>
          SSR footer!
        </Footer>
      </ThemeProvider>
    </StrictMode>
  )
}

export default App
