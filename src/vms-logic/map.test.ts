import { createMap, setMark } from './map'
import { isEglePos } from './matrix'

test('createMap', () => {
  createMap({ width: 5, height: 10, bombNumber: 1, egleBomb: false })

  expect(() =>
    createMap({ width: 5, height: 10, bombNumber: -1, egleBomb: false })
  ).toThrow(/bombNumber 不能低于0/)
  expect(() =>
    createMap({ width: 5, height: 10, bombNumber: 999999, egleBomb: false })
  ).toThrow(/bombNumber 不能超过 VMSMap 的格子数量 - 1/)
})

test('createMap disable egleBomb', () => {
  const { matrix } = createMap({
    width: 100,
    height: 100,
    bombNumber: 98 * 98,
    egleBomb: true,
  })

  const egleHasBomb = matrix
    .filter((_, pos) => isEglePos(pos, 100, 100))
    .find((cell) => cell.isBomb)

  expect(egleHasBomb).toBe(undefined)
})

test('setMark', () => {
  const map = createMap({ width: 4, height: 4, bombNumber: 3, egleBomb: false })
  const {
    matrix: [flagCell],
  } = setMark(0, map)
  expect(flagCell.mark).toBe('FLAG')

  const {
    matrix: [doubtCell],
  } = setMark(0, { ...map, matrix: [flagCell, ...map.matrix] })
  expect(doubtCell.mark).toBe('DOUBT')

  const {
    matrix: [noneCell],
  } = setMark(0, { ...map, matrix: [doubtCell, ...map.matrix] })
  expect(noneCell.mark).toBe('NONE')

  const {
    matrix: [fCell],
  } = setMark(0, { ...map, matrix: [noneCell, ...map.matrix] })
  expect(fCell.mark).toBe('FLAG')
})
