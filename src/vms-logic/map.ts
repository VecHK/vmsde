import { Cell, createPlainCell, NeighborNumber } from './cell'
import {
  countRemainingUnOpen,
  getNeighborPos,
  isEglePos,
  Matrix,
} from './matrix'

export type MapSize = { width: number; height: number }
export type VMSMap = MapSize & {
  egleBomb: boolean
  remainingUnOpen: number
  matrix: Matrix
}

export const updateCell = (
  pos: number,
  map: VMSMap,
  updateValues: { [P in keyof Cell]?: Cell[P] }
): VMSMap => ({
  ...map,
  matrix: map.matrix.map((cell, idx) => {
    return idx === pos ? { ...cell, ...updateValues } : cell
  }),
})

export function setMark(setPos: number, map: VMSMap): VMSMap {
  const { mark } = map.matrix[setPos]
  if (mark === 'FLAG') {
    return updateCell(setPos, map, { mark: 'DOUBT' })
  } else if (mark === 'DOUBT') {
    return updateCell(setPos, map, { mark: 'NONE' })
  } else {
    return updateCell(setPos, map, { mark: 'FLAG' })
  }
}

function setBomb(bombNumber: number, map: VMSMap): VMSMap {
  const { egleBomb, width, height } = map
  const matrix = [...map.matrix]

  if (bombNumber <= 0) {
    throw Error('setBomb: bombNumber 不能低于0')
  } else if (bombNumber > matrix.length - 1) {
    throw Error('setBomb: bombNumber 不能超过 VMSMap 的格子数量 - 1')
  }

  const bombPositionList = new Set<number>() // 利用 Set 去重

  while (bombPositionList.size < bombNumber) {
    const pos = Math.floor(Math.random() * matrix.length)

    const canAdd = !(egleBomb && isEglePos(pos, width, height))

    canAdd && bombPositionList.add(pos)
  }

  bombPositionList.forEach((pos) => {
    matrix[pos] = { ...matrix[pos], isBomb: true }
  })

  return {
    ...map,
    egleBomb,
    matrix,
  }
}

export function setNeighborNumber(map: VMSMap): VMSMap {
  const { matrix, width } = map

  return {
    ...map,
    matrix: matrix.map((cell, pos) => {
      return {
        ...cell,
        neighborNumber: getNeighborPos(pos, width).filter(
          (p) => matrix[p]?.isBomb
        ).length as NeighborNumber,
      }
    }),
  }
}

const createEmptyArray = (len: number) => Array.from(Array(len))
function createPlainMatrix(width: number, height: number) {
  return createEmptyArray(width * height).map((_, id) => {
    return createPlainCell(id)
  })
}

export function createMap({
  width,
  height,
  bombNumber,
  egleBomb,
}: MapSize & { bombNumber: number; egleBomb: boolean }): VMSMap {
  const bombMap = setBomb(bombNumber, {
    width,
    height,
    remainingUnOpen: 0,
    matrix: createPlainMatrix(width, height),
    egleBomb,
  })
  const newMap = setNeighborNumber(bombMap)

  return {
    ...newMap,
    remainingUnOpen: countRemainingUnOpen(newMap.matrix),
  }
}
