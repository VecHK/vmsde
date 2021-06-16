import { useCallback, useEffect, useState } from 'react'
import {
  openCell,
  setMark,
  openCellNeighbor,
  getNeighborPos,
  VMS,
} from 'src/vms-logic'

import GameCell, { CellMouseStatus } from './GameCell'

const createEmptyArray = (len: number) => Array.from(Array(len))

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

export default function GameMap({
  vms,
  setVMS,
}: {
  vms: VMS
  setVMS: React.Dispatch<React.SetStateAction<VMS>>
}) {
  const { width, height, map } = vms
  const { matrix } = map

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
    [map, setVMS, vms]
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
    [map, setVMS, vms]
  )

  const handleSetMark = useCallback(
    (pos: number) => {
      setVMS({
        ...vms,
        map: setMark(pos, map),
      })
    },
    [map, setVMS, vms]
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

  const [enterPos, setEnterPos] = useState(-1)
  const [mouseDownPos, setMouseDownPos] = useState<number>(-1)
  const [mouseDownType, setMouseDownType] = useState<'NORMAL' | 'MIDDLE'>(
    'NORMAL'
  )

  const handleMouseEnter = useCallback(
    (pos: number, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setEnterPos(pos)
    },
    []
  )

  const handleMouseLeave = useCallback(
    (pos: number, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setEnterPos(-1)
    },
    []
  )

  const handleMouseDown = useCallback(
    (pos: number, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      // setMouseDownPos(pos)

      const clickType = detectingClickType(e)
      if (clickType === 'MIDDLE') {
        setMouseDownPos(pos)
        setMouseDownType('MIDDLE')
      } else {
        setMouseDownPos(pos)
        setMouseDownType('NORMAL')
      }
    },
    []
  )

  const handleMouseUp = useCallback(
    (pos: number, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setMouseDownPos(-1)
      onClickCellRoute(pos, e)
    },
    [onClickCellRoute]
  )

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setMouseDownPos(-1)
    }

    document.addEventListener('mouseup', handleGlobalMouseUp)
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [])

  const matrix2D = createEmptyArray(height).map(() => createEmptyArray(width))

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
              const currentCell = matrix[pos]
              // console.log(`matrix[${pos}]`, matrix[pos])

              let mouseStatus: CellMouseStatus = 'default'
              if (mouseDownPos === pos && enterPos === pos) {
                mouseStatus = 'press'
              } else if (enterPos === pos) {
                mouseStatus = 'hover'
              }

              if (mouseDownType === 'MIDDLE' && currentCell.mark !== 'FLAG') {
                // 滤掉无法访问、设旗的 cell
                const neighborPos = getNeighborPos(pos, map.width).filter(
                  (pos) => {
                    return matrix[pos]
                  }
                )
                neighborPos.forEach((n_pos) => {
                  if (mouseDownPos === n_pos && enterPos === n_pos) {
                    mouseStatus = 'press'
                  }
                })
              }

              return (
                <GameCell
                  key={pos}
                  cell={currentCell}
                  mouseStatus={mouseStatus}
                  onMouseEnter={(e) => handleMouseEnter(pos, e)}
                  onMouseLeave={(e) => handleMouseLeave(pos, e)}
                  onMouseUp={(e) => handleMouseUp(pos, e)}
                  onMouseDown={(e) => handleMouseDown(pos, e)}
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
