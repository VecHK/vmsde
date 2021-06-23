import { createMap } from './map'
import { countRemainingUnOpen } from './matrix'

test('countRemainingUnOpen', () => {
  const { matrix } = createMap({
    width: 5,
    height: 10,
    bombNumber: 9,
    egleBomb: false,
  })

  expect(countRemainingUnOpen(matrix)).toBe(5 * 10 - 9)
})
