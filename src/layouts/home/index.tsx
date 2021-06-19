import React, { useCallback, useMemo, useState } from 'react'

import './index.css'

import CreateVMS, { getVMSStatus, VMS } from 'src/vms-logic'

import { Dashboard } from './components/Dashboard'
import GameMap from './components/GameMap'
import { GameStatus } from './components/GameStatus'
import GameTimer from './components/GameTimer'
import Cell from 'src/components/Cell'
import { loadConfig } from 'src/config'

// const WIDTH = 10
// const HEIGHT = 10
// const BOMB_NUM = Math.floor(WIDTH * HEIGHT * 0.15)

export default () => {
  const cfg = loadConfig()

  const [vms, setVMS] = useState(
    CreateVMS({
      width: cfg.width,
      height: cfg.height,
      bombNumber: cfg.bomb_number,
    })
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
          cfg={{
            WIDTH: cfg.width,
            HEIGHT: cfg.height,
            BOMB_NUM: cfg.bomb_number,
          }}
          onClickReplay={() => {
            setStartTime(null)
            setVMS(
              CreateVMS({
                width: cfg.width,
                height: cfg.height,
                bombNumber: cfg.bomb_number,
              })
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
