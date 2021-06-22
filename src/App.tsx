import { ReactNode, useState } from 'react'
import { HashRouter as Router, Redirect, useLocation } from 'react-router-dom'

import './i18n'

import './App.css'

import LayoutToggle from './components/LayoutToggle'

import NAV_ITEMS from './components/NavBar/NAV_ITEMS'
const DEFAULT_NAV = NAV_ITEMS[0]

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default () => (
  <Router>
    <App />
  </Router>
)

const App = () => {
  console.log('App render')

  const [layout, setLayout] = useState<{
    t: null | string
    transformOrigin?: string
    direction: -1 | 1
    element: ReactNode
    hideNavBar?: boolean
  }>({
    t: null,
    direction: 1,
    element: null,
  })

  const t = useQuery().get('t')
  if (!t) {
    return <Redirect to={`/?t=${DEFAULT_NAV.title}`} />
  } else if (layout.t !== t) {
    const result = NAV_ITEMS.find((nav) => nav.title === t)

    if (result) {
      const { Component } = result
      setLayout({
        t,
        direction: 1,
        element: <Component />,
        hideNavBar: result.hideNavBar,
      })
    } else {
      // not found
      return <Redirect to={`/?t=NotFound`} />
    }
  }

  if (!layout.element) {
    return null
  } else {
    return (
      <LayoutToggle
        element={<section>{layout.element}</section>}
        transformOrigin={layout.transformOrigin}
      />
    )
  }
}
