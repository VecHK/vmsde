import { setNeighborNumber } from '.'
import { Cell } from './cell'
import { VMSMap } from './map'
import { countRemainingUnOpen, Matrix } from './matrix'

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
