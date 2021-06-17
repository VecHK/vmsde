import { useMemo } from 'react'
import { Cell } from 'src/vms-logic'

export type CellMouseStatus = 'press' | 'hover' | 'default'

function IsOpenInnerContent(cell: Cell) {
  if (cell.isBomb) {
    return <div className="inner-is-open is-bomb">💥</div>
  }

  return (
    <div className={`inner-is-open n-${cell.neighborNumber}`}>
      {cell.neighborNumber ? cell.neighborNumber : ''}
    </div>
  )
}

function UnOpenInnerContent(cell: Cell) {
  if (cell.mark === 'FLAG') {
    return (
      <div className="inner-un-open mark-flag">
        <div className="inner-icon">🚩</div>
      </div>
    )
  } else if (cell.mark === 'DOUBT') {
    return (
      <div className="inner-un-open mark-doubt">
        <div className="inner-icon">❓</div>
      </div>
    )
  } else {
    return <div className="inner-un-open"></div>
  }
}

export default function GameCell({
  cell,
  loseBomb,
  mouseStatus = 'default',
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
  onMouseDown,
}: {
  cell: Cell
  loseBomb?: boolean
  mouseStatus?: CellMouseStatus

  onMouseEnter?: React.HTMLAttributes<HTMLDivElement>['onMouseEnter']
  onMouseLeave?: React.HTMLAttributes<HTMLDivElement>['onMouseLeave']
  onMouseUp?: React.HTMLAttributes<HTMLDivElement>['onMouseUp']
  onMouseDown?: React.HTMLAttributes<HTMLDivElement>['onMouseDown']
}) {
  const innerContent = useMemo(() => {
    if (cell.isOpen) {
      return <IsOpenInnerContent {...cell} />
    } else {
      return <UnOpenInnerContent {...cell} />
    }
  }, [cell])

  const classNames = [
    'cell',
    `id-${cell.id}`,
    cell.isOpen ? 'is-open' : 'un-open',
    mouseStatus,
    loseBomb ? 'lose-bomb' : '',
  ]

  return (
    <div
      className={classNames.join(' ')}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
    >
      {innerContent}
    </div>
  )
}
