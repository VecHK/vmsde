import { createPlainCell } from './cell'
import { mData2Map } from './m-data'
import { createMap } from './map'
import {
  Matrix,
  updateCell,
  countMark,
  countRemainingUnOpen,
  countBomb,
  countIsOpenBomb,
  isEglePos,
  getCanCheckPos,
  getNeighborPos,
} from './matrix'

test('updateCell', () => {
  const createPlainMatrix = () => [
    createPlainCell(0),
    createPlainCell(0),
    createPlainCell(0),
    createPlainCell(0),
  ]

  const matrix: Matrix = createPlainMatrix()

  expect(updateCell(matrix, 0, {})).toEqual(createPlainMatrix())
  expect(updateCell(matrix, -1, {})).toEqual(createPlainMatrix())
  expect(updateCell(matrix, matrix.length + 9, {})).toEqual(createPlainMatrix())

  const [bombCell] = updateCell(matrix, 0, { isBomb: true })
  expect(bombCell.isBomb).toBe(true)
  expect(updateCell(matrix, 0, {})).toEqual(createPlainMatrix())
})

const markData = `
_XX
_?_
___
`
test('countMark', () => {
  const { matrix } = mData2Map(markData)

  expect(countMark(matrix, 'FLAG')).toBe(2)
  expect(countMark(matrix, 'DOUBT')).toBe(1)
  expect(countMark(matrix, 'NONE')).toBe(0)
})

test('countRemainingUnOpen', () => {
  const { matrix } = createMap({
    width: 5,
    height: 10,
    bombNumber: 9,
    egleBomb: false,
  })

  expect(countRemainingUnOpen(matrix)).toBe(5 * 10 - 9)
})

const bombData = `
X__
_X_
__X
`
test('countBomb', () => {
  const { matrix } = mData2Map(bombData)
  expect(countBomb(matrix)).toBe(3)
})

test('countIsOpenBomb', () => {
  const matrix: Matrix = [
    createPlainCell(0),
    createPlainCell(0),
    createPlainCell(0),
    {
      ...createPlainCell(0),
      isBomb: true,
      isOpen: true,
    },
  ]

  expect(countIsOpenBomb(matrix)).toBe(1)
})

test('isEglePos', () => {
  const eMap = Array.from(Array(4 * 4)).map((_, pos) => {
    return isEglePos(pos, 4, 4)
  })

  /* eslint-disable prettier/prettier */
  expect(eMap).toEqual([
    true, true,  true,  true,
    true, false, false, true,
    true, false, false, true,
    true, true,  true,  true
  ])
  /* eslint-enable prettier/prettier */
})

test('getCanCheckPos', () => {
  expect(getCanCheckPos(0, 4)).toEqual([1])

  expect(getCanCheckPos(1, 4)).toEqual([0, 2])

  expect(getCanCheckPos(3, 4)).toEqual([2])

  expect(getCanCheckPos(-1, 4)).toEqual([])
})

test('getNeighborPos', () => {
  expect(getNeighborPos(0, 4)).toEqual([1, -4, 4, 5])

  expect(getNeighborPos(1, 4)).toEqual([0, 2, -3, 5, 4, 6])

  expect(getNeighborPos(3, 4)).toEqual([2, -1, 7, 6])
})
