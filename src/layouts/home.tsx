import React, { DOMAttributes, useCallback, useMemo, useState } from 'react'
import './home.css'

import CreateVMS, {
  Cell,
  openCell,
  setMark,
  countBomb,
  countMark,
  openCellNeighbor,
} from 'src/vms-logic'

const createEmptyArray = (len: number) => Array.from(Array(len))

const WIDTH = 12
const HEIGHT = 32
const BOMB_NUM = Math.floor(WIDTH * HEIGHT * 0.15)

function detectingClickType(
  e: React.MouseEvent<HTMLDivElement, MouseEvent>
): 'LEFT' | 'MIDDLE' | 'RIGHT' | 'UNKNOWN' {
  e.stopPropagation()
  e.preventDefault()

  const btnNum = e.button

  switch (btnNum) {
    case 2:
      return 'RIGHT'
    case 0:
      return 'LEFT'
    case 1:
      return 'MIDDLE'
    default:
      return 'UNKNOWN'
  }
}

export default () => {
  // const [vms, setVMS] = useState(CreateVMSWithCustomBombMap())
  const [vms, setVMS] = useState(
    CreateVMS({ width: WIDTH, height: HEIGHT, bombNumber: BOMB_NUM })
  )

  const { width, height, map } = vms
  const { matrix } = map

  const matrix2D = createEmptyArray(height).map(() => createEmptyArray(width))

  const handleOpenCell = useCallback(
    (pos: number) => {
      const res = openCell(pos, map)
      console.log('open result status', res.status)

      if (res.status === 'FLAG') {
        // 标记为旗子的不会有任何操作
        return
      }

      if (res.status === 'GAME_OVER') {
        return
      }

      if (res.status === 'BOMB') {
        // alert('你输了，游戏结束')
      }

      setVMS({
        ...vms,
        map: res.map,
      })
    },
    [map, vms]
  )

  const handleOpenCellNeighbor = useCallback(
    (pos: number) => {
      const res = openCellNeighbor(pos, map)
      console.log('open result status', res.status)

      if (res.status === 'FLAG') {
        // 标记为旗子的不会有任何操作
        return
      }

      if (res.status === 'GAME_OVER') {
        return
      }

      if (res.status === 'NOT_ENOUGH') {
        return
      }

      if (res.status === 'BOMB') {
        // alert('你输了，游戏结束')
      }

      setVMS({
        ...vms,
        map: res.map,
      })
    },
    [map, vms]
  )

  const handleSetMark = useCallback(
    (pos: number) => {
      setVMS({
        ...vms,
        map: setMark(pos, map),
      })
    },
    [map, vms]
  )

  const onClickCellRoute = useCallback(
    (pos, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      switch (detectingClickType(e)) {
        case 'LEFT':
          handleOpenCell(pos)
          break
        case 'MIDDLE':
          handleOpenCellNeighbor(pos)
          break
        case 'RIGHT':
          handleSetMark(pos)
          break
      }
    },
    [handleOpenCell, handleOpenCellNeighbor, handleSetMark]
  )

  return (
    <div
      onContextMenu={(e) => {
        e.stopPropagation()
        e.preventDefault()
      }}
    >
      {matrix2D.map((row, h) => {
        return (
          <div className="row" key={h}>
            {row.map((col, w) => {
              const pos = h * width + w
              // console.log(`matrix[${pos}]`, matrix[pos])
              return (
                <GameCell
                  key={pos}
                  cell={matrix[pos]}
                  onClick={(e) => onClickCellRoute(pos, e)}
                />
              )
            })}
          </div>
        )
      })}

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
              cell={{
                id: 9,
                isBomb: false,
                mark: 'NONE',
                neighborNumber: n,
                isOpen: true,
              }}
              onClick={() => console.log('')}
            />
          )
        })}
      </div>
    </div>
  )
}

function IsOpenInnerContent(cell: Cell) {
  if (cell.isBomb) {
    return <div className="inner-is-open is-bomb">💥</div>
  }

  return (
    <div className={`inner-is-open n-${cell.neighborNumber}`}>
      {cell.neighborNumber ? cell.neighborNumber : ''}
    </div>
  )
}

function UnOpenInnerContent(cell: Cell) {
  if (cell.mark === 'FLAG') {
    return <div className="inner-un-open mark-flag">🚩</div>
  } else if (cell.mark === 'DOUBT') {
    return <div className="inner-un-open mark-doubt">❓</div>
  } else {
    return <div className="inner-un-open"></div>
  }
}

function GameCell({
  cell,
  onClick,
}: {
  cell: Cell
  onClick: React.HTMLAttributes<HTMLDivElement>['onClick']
}) {
  const classNames = ['cell', `id-${cell.id}`]

  const innerContent = useMemo(() => {
    if (cell.isOpen) {
      return <IsOpenInnerContent {...cell} />
    } else {
      return <UnOpenInnerContent {...cell} />
    }
  }, [cell])

  return (
    <div className={classNames.join(' ')} onMouseUp={onClick}>
      {innerContent}
    </div>
  )
}
