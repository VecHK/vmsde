import { ReactNode } from 'react'
import { countBomb, countMark, VMS, NeighborNumber } from 'src/vms-logic'
import GameCell from '../GameCell'

import './index.css'

export type DashboardProps = {
  vms: VMS
}
export function Dashboard({ vms }: DashboardProps) {
  const { map } = vms
  const { matrix } = map

  return (
    <div className="dashboard">
      <DCol name={<>💣</>} value={`x${countBomb(map.matrix)}`} />
      <DCol
        name={
          <GameCell
            cell={{
              id: 9,
              isBomb: false,
              mark: 'NONE',
              neighborNumber: 0,
              isOpen: false,
            }}
          />
        }
        value={`x${map.remainingUnOpen}`}
      />
      <DCol
        name={<>🚩</>}
        value={`x${countBomb(map.matrix) - countMark(matrix, 'FLAG')}`}
      />
    </div>
  )
}

function DCol({ name, value }: { name: ReactNode; value: ReactNode }) {
  return (
    <div className="d-col">
      <div className="dc-name">{name}</div>
      <div className="dc-value">{value}</div>
    </div>
  )
}
