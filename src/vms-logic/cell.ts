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

export const createPlainCell = (id: number): Cell => ({
  id,
  isBomb: false,
  mark: 'NONE',
  neighborNumber: 0,
  isOpen: false,
})

type OptionalCell = { [k in keyof Cell]?: Cell[k] }

export const createCell = (newData: OptionalCell = {}): Cell => ({
  ...createPlainCell(0),
  ...newData,
})
