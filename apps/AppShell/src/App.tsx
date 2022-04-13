/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {FC, StrictMode, createContext} from 'react'
import {Link, Route, Routes} from 'react-router-dom'

import {Text} from '@batman-ui-components/text'
import {context, federateComponent} from '@batman/federate-component'
import {getRemoteUrls} from '@batman/remote-urls'

import logo from './logo.svg'
import './App.css'

// TODO: what is this?
export {context}

const ThemeContext = createContext(null)
const ReduxContext = createContext(null)

export const ThemeProvider = ({children, data}: any) => {
  return <ThemeContext.Provider value={data}>{children}</ThemeContext.Provider>
}

export const ReduxProvider = ({children, data}: any) => {
  return <ReduxContext.Provider value={data}>{children}</ReduxContext.Provider>
}

const remotesUrls = getRemoteUrls()

const Header = federateComponent('mfe_header', './header', remotesUrls.mfe_header)
const Footer = federateComponent('mfe_footer', './footer', remotesUrls.mfe_footer)
const ProductListing = federateComponent('mfe_product_listing', './product-listing', remotesUrls.mfe_product_listing)
const ProductDetails = federateComponent('mfe_product_details', './product-details', remotesUrls.mfe_product_details)

/**
 * Host app that consumes micro-front-ends and renders them together
 * @remarks
 *
 */
const App: FC = () => {
  return (
    <StrictMode>
      <ThemeProvider value={{}}>
        <Header loadingFallback={<div>Loading header...</div>} errorFallback={<div>Error loading header</div>}>
          SSR header!
          <Link to="/app">Home</Link>
          <Link to="/app/productListing">Product Listing</Link>
        </Header>
        <Routes>
          <Route
            path="/app"
            element={
              <div className="App">
                <section className="App-header">
                  <img src={logo} className="App-logo" alt="logo" />
                  {/* eslint-disable-next-line no-console */}
                  <p onClick={() => console.log('lallero')}>Page 1</p>
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
