import { useMemo, useState } from 'react'
import './index.css'

import CreateVMS, { getVMSStatus } from 'src/vms-logic'

import { Dashboard } from './components/Dashboard'
import GameMap from './components/GameMap'
import { GameStatus } from './components/GameStatus'

const WIDTH = 12
const HEIGHT = 16
const BOMB_NUM = Math.floor(WIDTH * HEIGHT * 0.15)

export default () => {
  const [vms, setVMS] = useState(
    CreateVMS({ width: WIDTH, height: HEIGHT, bombNumber: BOMB_NUM })
  )

  const status = useMemo(() => getVMSStatus(vms.map.matrix), [vms.map.matrix])

  return (
    <article>
      <Dashboard vms={vms} />

      <GameMap status={status} vms={vms} setVMS={setVMS} />

      <GameStatus
        status={status}
        vms={vms}
        setVMS={setVMS}
        cfg={{ WIDTH, HEIGHT, BOMB_NUM }}
      />
    </article>
  )
}
