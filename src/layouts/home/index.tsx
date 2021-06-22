import React, { useCallback, useMemo, useState } from 'react'

import './index.css'

import CreateVMS, { getVMSStatus, VMS } from 'src/vms-logic'

import { Dashboard } from './components/Dashboard'
import GameMap from './components/GameMap'
import { GameStatus } from './components/GameStatus'
import GameTimer from './components/GameTimer'
import Cell from 'src/components/Cell'
import GameLanguage from './components/GameLanguage'
import { diff2WHB, loadConfig } from 'src/config'

// const WIDTH = 10
// const HEIGHT = 10
// const BOMB_NUM = Math.floor(WIDTH * HEIGHT * 0.15)

function createVMSByConfig() {
  const cfg = loadConfig()
  let { width, height, bomb_number } = cfg

  if (cfg.diffculty !== 'CUSTOM') {
    const whb = diff2WHB(cfg.diffculty)
    width = whb.width
    height = whb.height
    bomb_number = whb.bomb_number
  }

  return CreateVMS({
    width,
    height,
    bombNumber: bomb_number,
    egleBomb: cfg.edge_bomb,
  })
}

export default () => {
  const [vms, setVMS] = useState(createVMSByConfig())
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
          onClickReplay={() => {
            setStartTime(null)
            setVMS(createVMSByConfig())
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
      <div className="language-wrapper">
        <GameLanguage />
      </div>
    </div>
  )
}
