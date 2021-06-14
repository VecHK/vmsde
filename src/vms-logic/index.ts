// 邻近的雷数目
type NeighborNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export type Cell = {
  id: number
  isBomb: boolean

  // 'NONE': 无
  // 'FLAG': 设旗
  // 'BOMB': 设雷
  icon: 'NONE' | 'FLAG' | 'BOMB'

  // 邻近的雷数目 0~8
  neighborNumber: NeighborNumber

  // 是否点开
  isOpen: boolean
}

export type MapSize = { width: number; height: number }
export type VMSMap = MapSize & {
  matrix: Cell[]
}

const createEmptyArray = (len: number) => Array.from(Array(len))

const createPlainCell = (id: number): Cell => ({
  id,
  isBomb: false,
  icon: 'NONE',
  neighborNumber: 0,
  isOpen: false,
})

const updateCell = (map: VMSMap, pos: number, newCell: Cell): VMSMap => ({
  ...map,
  matrix: map.matrix.map((cell, idx) => {
    return idx === pos ? newCell : cell
  }),
})

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
  } else if (cell.icon !== 'NONE') {
    return []
  } else if (cell.isOpen) {
    return []
  } else {
    const posList = getNeighborPos(startPos, width)
    posList.forEach((pos) => diffusion(pos, width, matrix))

    return matrix
  }
}

export function openCell(
  openPos: number,
  { width, matrix, ...resetMap }: VMSMap
) {
  matrix = [...matrix]
  const { isBomb } = matrix[openPos]
  if (isBomb) {
    throw Error('isBomb')
  }

  diffusion(openPos, width, matrix)

  return {
    ...resetMap,
    width,
    matrix,
  }
}

function setBomb(bombNumber: number, map: VMSMap): VMSMap {
  let { matrix } = map
  matrix = [...matrix]

  if (bombNumber <= 0) {
    throw Error('random: bombNumber 不能小于0')
  } else if (bombNumber > matrix.length - 1) {
    throw Error('random: bombNumber 不能超过 VMSMap 的格子数量 - 1')
  }

  const bombPositionList = new Set<number>() // 利用 Set 去重

  while (bombPositionList.size < bombNumber) {
    const pos = Math.floor(Math.random() * (matrix.length - 1))
    bombPositionList.add(pos)
  }

  bombPositionList.forEach((pos) => {
    matrix[pos] = { ...matrix[pos], isBomb: true }
  })

  return {
    ...map,
    matrix,
  }
}

/**
 * 返回某个格子的左边和右边的位置的pos
 * 因为格子有可能在最左边和最右边，这时候获取最左边/最右边计算就会越界了
 * 所以这地方需要判断
 */
function getCanCheckPos(pos: number, width: number): number[] {
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

function getNeighborPos(pos: number, width: number) {
  return [
    ...getCanCheckPos(pos, width),

    pos - width, // 上边的格子
    ...getCanCheckPos(pos - width, width), // 左上的格子、右上的格子

    pos + width, // 下边的格子
    ...getCanCheckPos(pos + width, width), // 左下的格子、右下的格子
  ]
}

function setNeighborNumber(map: VMSMap): VMSMap {
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

export function GenerateMap({
  width,
  height,
  bombNumber,
}: MapSize & { bombNumber: number }): VMSMap {
  let map = {
    width,
    height,
    matrix: createEmptyArray(width * height).map((_, id) => {
      return createPlainCell(id)
    }),
  }

  map = setNeighborNumber(setBomb(bombNumber, map))

  return map
}

export function CreateVMS({
  width,
  height,
  bombNumber,
}: MapSize & { bombNumber: number }) {
  return {
    width,
    height,
    bombNumber,

    // BOMB: GenerateBombMap({ width, height, bombNumber }),
    map: GenerateMap({ width, height, bombNumber }),
  } as const
}
