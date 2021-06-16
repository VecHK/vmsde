import React, { useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

const MountComponent = () => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = setTimeout(() => {
      setShow(true)
    }, 1000)

    return () => {
      clearTimeout(handler)
    }
  }, [])

  return <React.StrictMode>{show ? <App /> : null}</React.StrictMode>
}

ReactDOM.render(<MountComponent />, document.getElementById('root'))

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
