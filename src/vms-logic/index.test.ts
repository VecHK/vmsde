import CreateVMS from './index'

test('CreateVMS', () => {
  const vms = CreateVMS({ width: 10, height: 10, bombNumber: 9 })
  expect(vms.width).toBe(10)
  expect(vms.height).toBe(10)
  expect(vms.map.matrix.length).toBe(10 * 10)
})
