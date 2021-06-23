import { createPlainCell, createCell } from './cell'

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

test('createCell', () => {
  expect(createCell()).toEqual({
    id: 0,
    isBomb: false,
    mark: 'NONE',
    neighborNumber: 0,
    isOpen: false,
  })

  expect(createCell({ id: 10, isBomb: true })).toEqual({
    id: 10,
    isBomb: true,
    mark: 'NONE',
    neighborNumber: 0,
    isOpen: false,
  })
})
