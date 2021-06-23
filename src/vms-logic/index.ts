export * from './cell'

import { MapSize, VMSMap, createMap } from './map'
export * from './map'

import { countBomb, countRemainingUnOpen, Matrix } from './matrix'
export {
  countBomb,
  countIsOpenBomb,
  countRemainingUnOpen,
  countMark,
  getNeighborPos,
} from './matrix'
export type { Matrix } from './matrix'

export { openCell, openCellNeighbor } from './open'

import { mData2Map } from './m-data'

export type VMSStatus = 'WIN' | 'LOSE' | 'PLAYING'
export type BombNumber = number
export type VMS = MapSize & {
  bombNumber: BombNumber
  map: VMSMap
  status: VMSStatus
}

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

export type CreateVMSProp = MapSize & {
  bombNumber: BombNumber
  egleBomb?: boolean
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
