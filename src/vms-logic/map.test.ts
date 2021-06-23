import { createMap } from './map'

test('createMap', () => {
  createMap({ width: 5, height: 10, bombNumber: 1, egleBomb: false })

  expect(() =>
    createMap({ width: 5, height: 10, bombNumber: -1, egleBomb: false })
  ).toThrow(/bombNumber 不能低于0/)
  expect(() =>
    createMap({ width: 5, height: 10, bombNumber: 999999, egleBomb: false })
  ).toThrow(/bombNumber 不能超过 VMSMap 的格子数量 - 1/)
})
