import React, { useCallback, useEffect, useMemo, useState } from 'react'
import './index.css'

import CreateVMS, { Cell, countBomb, countMark } from 'src/vms-logic'

import GameCell from './components/GameCell'
import GameMap from './components/GameMap'

const WIDTH = 12
const HEIGHT = 32
const BOMB_NUM = Math.floor(WIDTH * HEIGHT * 0.15)

export default () => {
  const [vms, setVMS] = useState(
    CreateVMS({ width: WIDTH, height: HEIGHT, bombNumber: BOMB_NUM })
  )

  const { width, height, map } = vms
  const { matrix } = map

  return (
    <article>
      <GameMap vms={vms} setVMS={setVMS} />

      <div>safe cell: {map.remainingUnOpen}</div>
      <div>bomb cell: {countBomb(map.matrix)}</div>
      <div>my flags: {countBomb(map.matrix) - countMark(matrix, 'FLAG')}</div>
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
