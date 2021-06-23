import { createPlainCell } from './cell'

test('createPlainCell', () => {
  const cell = createPlainCell(9)
  expect(cell).toEqual({
    id: 9,
    isBomb: false,
    mark: 'NONE',
    neighborNumber: 0,
    isOpen: false,
  })
})
