import { NeighborNumber } from 'src/vms-logic'
import GameCell from '../GameCell'

const createEmptyArray = (len: number) => Array.from(Array(len))

export default function NumberMonitor({
  len,
  str,
}: {
  len: number
  str: string
}) {
  const digitList = createEmptyArray(len)
    .map((_, idx) => str.split('').reverse()[idx])
    .reverse()

  return (
    <div className="row">
      {digitList.map((n, id) => {
        return (
          <GameCell
            key={id}
            cell={{
              id,
              isBomb: false,
              mark: 'NONE',
              neighborNumber: (n as unknown) as NeighborNumber,
              isOpen: true,
            }}
          />
        )
      })}
    </div>
  )
}
