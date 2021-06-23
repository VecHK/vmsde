import { mData2Map } from './m-data'

test('mapData2Map', () => {
  const m = `
_-_
-_-
`
  const map = mData2Map(m)

  const bombArray = map.matrix.map((cell) => cell.isBomb)
  expect(bombArray).toEqual([false, true, false, true, false, true])
})

// test('map2MapData', () => {
//   const m = `
// 010
// 101
// `
//   const map = mapData2Map(m)

//   const mData = map2MapData(map)
//   expect(mData).toBe(m.trim())
// })
