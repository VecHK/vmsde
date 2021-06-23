import { createMap, VMSMap } from './map'
import {
  countBomb,
  countIsOpenBomb,
  countRemainingUnOpen,
  getNeighborPos,
} from './matrix'

export function diffusion(
  startPos: number,
  width: number,
  matrix: VMSMap['matrix']
) {
  const cell = matrix[startPos]
  if (!cell) {
    return []
  }

  matrix[startPos] = { ...cell, isOpen: true }

  if (cell.neighborNumber) {
    return []
  } else if (cell.isBomb) {
    return []
  } else if (cell.mark !== 'NONE') {
    return []
  } else if (cell.isOpen) {
    return []
  } else {
    const posList = getNeighborPos(startPos, width)
    posList.forEach((pos) => diffusion(pos, width, matrix))

    return matrix
  }
}

type OpenResultMap<S extends string> = { status: S; map: VMSMap }
type OpenResult =
  | OpenResultMap<'OK'>
  | OpenResultMap<'BOMB'>
  | OpenResultMap<'CLEAR'>
  | { status: 'FLAG' }
  | { status: 'GAME_OVER' }

export function openCell(openPos: number, map: VMSMap): OpenResult {
  const { width } = map
  const matrix = [...map.matrix]

  const { mark } = matrix[openPos]
  if (mark === 'FLAG') {
    return { status: 'FLAG' }
  }

  const isFirst = matrix.filter((cell) => !cell.isOpen).length === matrix.length
  if (isFirst) {
    // 首次点击不会踩雷的机能
    // 首次点击必定触发扩散
    if (matrix[openPos].isBomb || matrix[openPos].neighborNumber !== 0) {
      const newMap: VMSMap = createMap({
        ...map,
        bombNumber: countBomb(matrix),
      })
      return openCell(openPos, newMap)
    }
  }

  const hasIsOpenBomb = countIsOpenBomb(matrix)
  if (hasIsOpenBomb) {
    return { status: 'GAME_OVER' }
  }

  const { isBomb } = matrix[openPos]
  if (isBomb) {
    matrix[openPos] = {
      ...matrix[openPos],
      isOpen: true,
    }

    return {
      status: 'BOMB',
      map: {
        ...map,
        width,
        matrix,
        remainingUnOpen: countRemainingUnOpen(matrix),
      },
    }
  }

  diffusion(openPos, width, matrix)

  // 判断是否胜利
  const remainingUnOpen = countRemainingUnOpen(matrix)

  return {
    status: remainingUnOpen ? 'OK' : 'CLEAR',
    map: {
      ...map,
      width,
      matrix,
      remainingUnOpen,
    },
  }
}

type OpenNeighborResult =
  | OpenResultMap<'OK'>
  | OpenResultMap<'BOMB'>
  | OpenResultMap<'CLEAR'>
  | { status: 'NOT_ENOUGH' }
  | { status: 'FLAG' }
  | { status: 'GAME_OVER' }
export function openCellNeighbor(
  centerPos: number,
  map: VMSMap
): OpenNeighborResult {
  const centerCell = map.matrix[centerPos]

  if (centerCell.neighborNumber === 0) {
    return { status: 'NOT_ENOUGH' }
  }
  if (!centerCell.isOpen) {
    return { status: 'NOT_ENOUGH' }
  }

  const neighborPosList = getNeighborPos(centerPos, map.width).filter((pos) => {
    // 滤掉无法访问的 cell
    return map.matrix[pos]
  })

  const neighborFlagsPosList = neighborPosList.filter((pos) => {
    const currentCell = map.matrix[pos]
    return !currentCell.isOpen && currentCell.mark === 'FLAG'
  })

  const neighborFlagsCount = neighborFlagsPosList.length

  if (neighborFlagsCount >= centerCell.neighborNumber) {
    for (const pos of neighborPosList) {
      const oepnResult = openCell(pos, map)
      switch (oepnResult.status) {
        case 'FLAG':
          break
        case 'GAME_OVER':
          return { status: 'GAME_OVER' }
        case 'OK':
          map = oepnResult.map
          break
        case 'BOMB':
          map = oepnResult.map
          return { status: 'BOMB', map }
        case 'CLEAR':
          map = oepnResult.map
          return { status: 'CLEAR', map }
      }
    }

    return { status: 'OK', map }
  }

  // 如果周边设定的旗的数量小于 neighborNumber 则不会进行操作
  return { status: 'NOT_ENOUGH' }
}
