import React, { useCallback, useEffect, useMemo, useState } from 'react'
import './index.css'

import CreateVMS, { Cell, countBomb, countMark } from 'src/vms-logic'

import { Dashboard } from './components/Dashboard'
import GameMap from './components/GameMap'
import GameCell from './components/GameCell'

const WIDTH = 16
const HEIGHT = 16
const BOMB_NUM = Math.floor(WIDTH * HEIGHT * 0.15)

export default () => {
  const [vms, setVMS] = useState(
    CreateVMS({ width: WIDTH, height: HEIGHT, bombNumber: BOMB_NUM })
  )

  const { width, height, map } = vms
  const { matrix } = map

  return (
    <article>
      <Dashboard vms={vms} />
      <GameMap vms={vms} setVMS={setVMS} />

      <button
        onClick={() => {
          setVMS(
            CreateVMS({ width: WIDTH, height: HEIGHT, bombNumber: BOMB_NUM })
          )
        }}
      >
        Replay
      </button>
      <button
        onClick={() => {
          const { matrix } = map

          const flagMatrix = matrix
            .map((cell) => Number(cell.mark === 'FLAG'))
            .join('')
          console.log('flagMatrix', flagMatrix)
        }}
      >
        exportflagMatrix
      </button>

      <div className="row">
        {([0, 1, 2, 3, 4, 5, 6, 7, 8] as Cell['neighborNumber'][]).map((n) => {
          return (
            <GameCell
              key={n}
              cell={{
                id: 9,
                isBomb: false,
                mark: 'NONE',
                neighborNumber: n,
                isOpen: true,
              }}
            />
          )
        })}
      </div>
    </article>
  )
}
