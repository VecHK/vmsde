import { Cell } from './cell'

export type Matrix = Cell[]

export const updateCell = (
  matrix: Matrix,
  updatePos: number,
  updateValues: { [P in keyof Cell]?: Cell[P] }
): Matrix =>
  matrix.map((cell, p) => {
    return p === updatePos ? { ...cell, ...updateValues } : cell
  })

export function countMark(matrix: Matrix, findMark: Cell['mark']) {
  return matrix
    .filter(({ mark }) => mark === findMark)
    .filter((cell) => !cell.isOpen).length
}

export function countRemainingUnOpen(matrix: Matrix) {
  return matrix.filter((cell) => !cell.isBomb).filter((cell) => !cell.isOpen)
    .length
}

export function countBomb(matrix: Matrix) {
  return matrix.filter((cell) => cell.isBomb).length
}

export function countIsOpenBomb(matrix: Matrix) {
  return matrix.filter((cell) => cell.isBomb).filter((cell) => cell.isOpen)
    .length
}

export function isEglePos(pos: number, width: number, height: number): boolean {
  if (pos % width === 0) {
    return true
  }
  if (pos - width < 0) {
    return true
  }

  if (pos >= width * height - width) {
    return true
  }

  if (pos % width === width - 1) {
    return true
  }

  return false
}

/**
 * 返回某个格子的左边和右边的位置的pos
 * 因为格子有可能在最左边和最右边，这时候获取最左边/最右边计算就会越界了
 * 所以这地方需要判断
 */
export function getCanCheckPos(pos: number, width: number): number[] {
  if (pos < 0) {
    return []
  }

  const x = pos % width

  const canCheckPos: number[] = []

  if (x !== 0) {
    // 不在最左边
    canCheckPos.push(pos - 1)
  }
  if (x < width - 1) {
    // 不在最右边
    canCheckPos.push(pos + 1)
  }

  return canCheckPos
}

export function getNeighborPos(pos: number, width: number) {
  return [
    ...getCanCheckPos(pos, width),

    pos - width, // 上边的格子
    ...getCanCheckPos(pos - width, width), // 左上的格子、右上的格子

    pos + width, // 下边的格子
    ...getCanCheckPos(pos + width, width), // 左下的格子、右下的格子
  ]
}
