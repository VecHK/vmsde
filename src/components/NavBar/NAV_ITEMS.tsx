import { Link } from 'react-router-dom'
import Home from 'src/layouts/home'

const NAV_ITEMS: Array<{
  title: string
  url: null | string
  Component: () => JSX.Element | null

  hide?: boolean
  hideNavBar?: boolean
}> = [
  {
    title: 'Home',
    url: null,
    Component: Home,
  },
  {
    hide: true,
    hideNavBar: true,
    title: 'NotFound',
    url: null,
    Component: () => (
      <article>
        <p>抱歉，找不到页面</p>
        <Link className="nav-item" to={`/?t=${NAV_ITEMS[0].title}`}>
          {'> 返回首页'}
        </Link>
      </article>
    ),
  },
]

export default NAV_ITEMS
