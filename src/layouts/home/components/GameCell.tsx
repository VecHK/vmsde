import { ReactNode, useMemo } from 'react'
import { Cell, VMSStatus } from 'src/vms-logic'
import CellFrame, { CellInnerType } from 'src/components/Cell'

export type CellMouseStatus = 'press' | 'hover' | 'default'

function IsOpenInnerContent(cell: Cell) {
  if (cell.isBomb) {
    return <div className="inner-is-open is-bomb">💥</div>
  }

  return <>{cell.neighborNumber ? cell.neighborNumber : ''}</>
}

export default function GameCell({
  cell,
  status = 'PLAYING',
  mouseStatus = 'default',
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
  onMouseDown,
}: {
  cell: Cell
  status?: VMSStatus
  mouseStatus?: CellMouseStatus

  onMouseEnter?: React.HTMLAttributes<HTMLDivElement>['onMouseEnter']
  onMouseLeave?: React.HTMLAttributes<HTMLDivElement>['onMouseLeave']
  onMouseUp?: React.HTMLAttributes<HTMLDivElement>['onMouseUp']
  onMouseDown?: React.HTMLAttributes<HTMLDivElement>['onMouseDown']
}) {
  const events = { onMouseEnter, onMouseLeave, onMouseUp, onMouseDown }

  const loseBombNode = useMemo(
    () => (
      <div className="inner-un-open lose-bomb">
        <div className="inner-icon">💣</div>
      </div>
    ),
    []
  )

  let innerType: CellInnerType = 'hollow'
  let innerContent: ReactNode

  if (cell.isOpen) {
    innerType = 'hollow'

    if (cell.isBomb) {
      innerContent = '💥'
    } else {
      innerContent = <IsOpenInnerContent {...cell} />
    }
  } else {
    innerType = 'solid'
    if (cell.mark === 'FLAG') {
      innerContent = '🚩'
    } else if (cell.mark === 'DOUBT') {
      innerContent = '❓'
    }

    if (status === 'LOSE') {
      if (cell.isBomb) {
        innerContent = loseBombNode
      }

      if (cell.mark === 'FLAG') {
        if (cell.isBomb) {
          innerContent = '🚩'
        } else {
          innerType = 'hollow'
          innerContent = (
            <div
              className={`inner-un-open mark-flag miss-flag n-${cell.neighborNumber}`}
            >
              <div className="inner-icon">
                {cell.neighborNumber ? cell.neighborNumber : ''}
              </div>
            </div>
          )
        }
      }
    }
  }

  return (
    <CellFrame
      innerType={innerType}
      innerContent={innerContent}
      cursor={!cell.isOpen ? 'pointer' : undefined}
      nColor={cell.isOpen ? cell.neighborNumber : 0}
      mouseStatus={mouseStatus}
      {...events}
    />
  )
}
