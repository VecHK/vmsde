import { useEffect, useState } from 'react'

import s from './index.module.css'
const FADEIN_ANIMATE_TIMING = 618

export type LayoutInfo = {
  element: React.ReactNode
  transformOrigin?: string
}

let GLOBAL_KEY = 0
const INIT_TIMEOUT_VALUE = setTimeout(() => undefined, 0)

const Layout = ({ element, transformOrigin = '' }: LayoutInfo) => (
  <div className={`${s.Layout}`} style={{ transformOrigin }}>
    {element}
  </div>
)

export default function LayoutToggle({ element, transformOrigin }: LayoutInfo) {
  const setTimeoutValue = useState<NodeJS.Timeout>(INIT_TIMEOUT_VALUE)[1]

  const [layoutNodes, setLayoutNodes] = useState<JSX.Element[]>([])

  useEffect(() => {
    setLayoutNodes((nodes) => {
      setTimeoutValue((currentTimer) => {
        clearTimeout(currentTimer)
        return setTimeout(() => {
          setLayoutNodes((ns) => [ns[ns.length - 1]])
        }, FADEIN_ANIMATE_TIMING)
      })

      return [
        ...nodes,
        <Layout
          key={GLOBAL_KEY++}
          element={element}
          transformOrigin={transformOrigin}
        />,
      ]
    })
    // direction 不需要加入到 deps 中，只需要判断 element 的变动即可
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element])

  return <div className={s.CurrentLayout}>{layoutNodes}</div>
}
