import {StrictMode} from 'react'
import ReactDOM from 'react-dom'
// import {hydrateRoot} from 'react-dom'

import App from '../App'
import reportWebVitals from '../reportWebVitals'

// const links: any = document.body.getElementsByTagName('link')
// for (const link of links) {
//   document.head.appendChild(link)
// }
// console.log('yayy')
// hydrateRoot(
//   document,
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

// const root = createRoot(document, { hydrate: true });

// root.render(<App />);

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
