import {FC, StrictMode, createContext} from 'react'
import {Route} from 'react-router-dom'

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

console.log(remotesUrls)

const Header = federateComponent('mfe_header', './header', remotesUrls.mfe_header)
console.log(Header)

const Footer = federateComponent('mfe_footer', './footer', remotesUrls.mfe_footer)
const ProductListing = federateComponent('mfe_product_listing', './product-listing', remotesUrls.mfe_product_listing)
const ProductDetails = federateComponent('mfe_product_details', './product-details', remotesUrls.mfe_product_details)

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
        <Route
          exact
          path="/app"
          render={() => (
            <div className="App">
              <section className="App-header">
                {/* eslint-disable-next-line no-console */}
                <p>Page 1</p>
                <Counter />
                <Text />
              </section>
            </div>
          )}
        />
        <Route
          exact
          path="/app/productListing"
          render={() => (
            <ProductListing
              loadingFallback={<div>Loading product listing...</div>}
              errorFallback={<div>Error loading product listing</div>}
            />
          )}
        />
        <Route
          path="/app/productDetails/:id"
          render={({match}) => {
            return (
              <ProductDetails
                loadingFallback={<div>Loading product details...</div>}
                errorFallback={<div>Error loading product details</div>}
                id={match.params?.id}
              />
            )
          }}
        />
        <Footer loadingFallback={<div>Loading footer...</div>} errorFallback={<div>Error loading footer</div>}>
          SSR footer!
        </Footer>
      </ThemeProvider>
    </StrictMode>
  )
}

export default App
