import CreateVMS, {
  countRemainingUnOpen,
  createMap,
  map2MapData,
  mapData2Map,
} from './index'

test('CreateVMS', () => {
  const vms = CreateVMS({ width: 10, height: 10, bombNumber: 9 })
  expect(vms.width).toBe(10)
  expect(vms.height).toBe(10)
  expect(vms.map.matrix.length).toBe(10 * 10)
})

test('countRemainingUnOpen', () => {
  const { matrix } = createMap({
    width: 5,
    height: 10,
    bombNumber: 9,
  })

  expect(countRemainingUnOpen(matrix)).toBe(5 * 10 - 9)
})

test('createMap', () => {
  createMap({ width: 5, height: 10, bombNumber: 1 })

  expect(() => createMap({ width: 5, height: 10, bombNumber: -1 })).toThrow(
    /bombNumber 不能低于0/
  )
  expect(() => createMap({ width: 5, height: 10, bombNumber: 999999 })).toThrow(
    /bombNumber 不能超过 VMSMap 的格子数量 - 1/
  )
})

test('mapData2Map', () => {
  const m = `
010
101
`
  const map = mapData2Map(m)

  const bombArray = map.matrix.map((cell) => cell.isBomb)
  expect(bombArray).toEqual([false, true, false, true, false, true])
})

test('map2MapData', () => {
  const m = `
010
101
`
  const map = mapData2Map(m)

  const mData = map2MapData(map)
  expect(mData).toBe(m.trim())
})
