// 邻近的雷数目
export type NeighborNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export type Cell = {
  id: number
  isBomb: boolean

  // 'NONE': 无
  // 'FLAG': 旗子， 点击无效
  // 'DOUBT': 疑问
  mark: 'NONE' | 'FLAG' | 'DOUBT'

  // 邻近的雷数目 0~8
  neighborNumber: NeighborNumber

  // 是否点开
  isOpen: boolean
}

export type MapSize = { width: number; height: number }
export type Matrix = Cell[]
export type VMSMap = MapSize & {
  egleBomb: boolean
  remainingUnOpen: number
  matrix: Matrix
}

export const createPlainCell = (id: number): Cell => ({
  id,
  isBomb: false,
  mark: 'NONE',
  neighborNumber: 0,
  isOpen: false,
})

const updateCell = (
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
function countIsOpenBomb(matrix: Matrix) {
  return matrix.filter((cell) => cell.isBomb).filter((cell) => cell.isOpen)
    .length
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

/**
 * 返回某个格子的左边和右边的位置的pos
 * 因为格子有可能在最左边和最右边，这时候获取最左边/最右边计算就会越界了
 * 所以这地方需要判断
 */
function getCanCheckPos(pos: number, width: number): number[] {
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

export type VMSStatus = 'WIN' | 'LOSE' | 'PLAYING'
export function getVMSStatus(matrix: Matrix): VMSStatus {
  for (const cell of matrix) {
    if (cell.isBomb && cell.isOpen) {
      return 'LOSE'
    }
  }

  if (countRemainingUnOpen(matrix) === 0) {
    return 'WIN'
  } else {
    return 'PLAYING'
  }
}

export type BombNumber = number
export type CreateVMSProp = MapSize & {
  bombNumber: BombNumber
  egleBomb?: boolean
}

export type VMS = MapSize & {
  bombNumber: BombNumber
  map: VMSMap
  status: VMSStatus
}

export default function CreateVMS({
  width,
  height,
  bombNumber,
  egleBomb = false,
}: CreateVMSProp): VMS {
  const map = createMap({ width, height, bombNumber, egleBomb })
  return {
    width,
    height,
    bombNumber,
    status: getVMSStatus(map.matrix),

    map,
  } as const
}

export function CreateVMSByMData({
  width,
  height,
  mData,
}: MapSize & { mData: string }): VMS {
  const map = mData2Map(mData)
  return {
    width,
    height,
    bombNumber: countBomb(map.matrix),
    status: getVMSStatus(map.matrix),

    map,
  } as const
}

type mDataBit = 'X' | 'x' | '?' | '!' | '#' | '_' | '-'

export function mDataBit2Cell(b: mDataBit): Cell {
  switch (b) {
    case '-':
      return {
        id: 0,
        isBomb: true,
        isOpen: false,
        mark: 'NONE',
        neighborNumber: 0,
      }

    case '_':
      return {
        id: 0,
        isBomb: false,
        isOpen: true,
        mark: 'NONE',
        neighborNumber: 0,
      }
    case '#':
      return {
        id: 0,
        isBomb: false,
        isOpen: false,
        mark: 'NONE',
        neighborNumber: 0,
      }

    case 'X':
      return {
        id: 0,
        isBomb: true,
        isOpen: false,
        mark: 'FLAG',
        neighborNumber: 0,
      }

    case 'x':
      return {
        id: 0,
        isBomb: false,
        isOpen: false,
        mark: 'FLAG',
        neighborNumber: 0,
      }

    case '?':
      return {
        id: 0,
        isBomb: false,
        isOpen: false,
        mark: 'DOUBT',
        neighborNumber: 0,
      }

    case '!':
      return {
        id: 0,
        isBomb: true,
        isOpen: false,
        mark: 'DOUBT',
        neighborNumber: 0,
      }
  }
}

const Transformer: { [k in mDataBit]: (c: Cell) => k | null } = {
  X: (c) => (!c.isOpen && c.isBomb && c.mark === 'FLAG' ? 'X' : null),
  x: (c) => (!c.isOpen && !c.isBomb && c.mark === 'FLAG' ? 'x' : null),
  '?': (c) => (!c.isOpen && !c.isBomb && c.mark === 'DOUBT' ? '?' : null),
  '!': (c) => (!c.isOpen && c.isBomb && c.mark === 'DOUBT' ? '!' : null),
  '-': (c) => (!c.isOpen && c.isBomb ? '-' : null),
  '#': (c) => (!c.isOpen ? '#' : null),
  _: (c) => (c.isOpen ? '_' : null),
}

export function cell2MDataBit(cell: Cell): mDataBit | null {
  for (const m in Transformer) {
    const b = Transformer[m](cell)
    if (!b) {
      return b
    }
  }

  return null
}

export function validMDataBit(b: string): mDataBit | false {
  if (Transformer[b]) {
    return b as mDataBit
  }
  return false
}

export function mData2Map(mapData: string): VMSMap {
  const trimData = mapData.trim()
  const rows = trimData.split('\n')
  const width = rows[0].length
  const height = rows.length

  const TFM: mDataBit[] = []
  rows.forEach((row) => {
    row.split('').forEach((bit, idx) => {
      if (idx > width) {
        throw Error('不对齐')
      }

      const b = validMDataBit(bit)
      if (b) {
        TFM.push(b)
      } else {
        throw Error('mData2Map: invalid mData bit')
      }
    })
  })

  const matrix: Matrix = TFM.map(mDataBit2Cell)
  const newMap = {
    width,
    height,
    egleBomb: false,
    remainingUnOpen: countRemainingUnOpen(matrix),
    matrix,
  }

  return setNeighborNumber(newMap)
}

export function map2mData({ width, height, matrix }: VMSMap): string {
  const mapDataArray: string[] = []
  for (let h = 0; h < height; ++h) {
    const row: mDataBit[] = []

    for (let w = 0; w < width; ++w) {
      const pos = h * width + w
      const cell = matrix[pos]

      const b = cell2MDataBit(cell)

      if (b) {
        row.push(b)
      } else {
        throw Error('map2mData: invalid cell')
      }
    }

    mapDataArray.push(row.join(''))
  }

  return mapDataArray.join('\n')
}
