import React, { useCallback, useMemo, useState } from 'react'

import './index.css'

import CreateVMS, { getVMSStatus, VMS } from 'src/vms-logic'

import { Dashboard } from './components/Dashboard'
import GameMap from './components/GameMap'
import { GameStatus } from './components/GameStatus'
import GameTimer from './components/GameTimer'
import Cell from 'src/components/Cell'

const WIDTH = 10
const HEIGHT = 10
const BOMB_NUM = Math.floor(WIDTH * HEIGHT * 0.15)

export default () => {
  const [vms, setVMS] = useState(
    CreateVMS({ width: WIDTH, height: HEIGHT, bombNumber: BOMB_NUM })
  )
  const [startTime, setStartTime] = useState<number | null>(null)

  const status = useMemo(() => getVMSStatus(vms.map.matrix), [vms.map.matrix])

  const handleSetVMS = useCallback<React.Dispatch<React.SetStateAction<VMS>>>(
    (newVMS) => {
      setVMS(newVMS)
      if (startTime === null) {
        setStartTime(Date.now())
      }
    },
    [startTime]
  )

  return (
    <div className="home">
      <div className="game-frame">
        <Dashboard vms={vms} />

        <GameMap status={status} vms={vms} setVMS={handleSetVMS} />

        <GameTimer
          className="gamer-timer-area"
          vms={vms}
          startTime={startTime}
        />

        <GameStatus
          status={status}
          vms={vms}
          setVMS={setVMS}
          cfg={{ WIDTH, HEIGHT, BOMB_NUM }}
          onClickReplay={() => {
            setStartTime(Date.now())
            setVMS(
              CreateVMS({ width: WIDTH, height: HEIGHT, bombNumber: BOMB_NUM })
            )
          }}
        />
      </div>
      <div className="setting-enter">
        <Cell
          innerType="solid"
          innerContent="≡"
          cursor="pointer"
          onClick={() => {
            location.replace('#?t=Setting')
          }}
        />
      </div>
    </div>
  )
}
