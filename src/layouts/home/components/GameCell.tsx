import { useMemo } from 'react'
import { Cell, VMSStatus } from 'src/vms-logic'

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

function UnOpenInnerContent({
  status,
  cell,
}: {
  status: VMSStatus
  cell: Cell
}) {
  const flagNode = useMemo(
    () => (
      <div className="inner-un-open mark-flag">
        <div className="inner-icon">🚩</div>
      </div>
    ),
    []
  )
  const doubtNode = useMemo(
    () => (
      <div className="inner-un-open mark-doubt">
        <div className="inner-icon">❓</div>
      </div>
    ),
    []
  )
  const loseBombNode = useMemo(
    () => (
      <div className="inner-un-open lose-bomb">
        <div className="inner-icon">💣</div>
      </div>
    ),
    []
  )
  const emptyNode = useMemo(() => <div className="inner-un-open"></div>, [])

  if (status === 'LOSE') {
    if (cell.mark === 'FLAG' && cell.isBomb) {
      return flagNode
    } else if (cell.mark === 'FLAG' && !cell.isBomb) {
      return (
        <div
          className={`inner-un-open mark-flag miss-flag n-${cell.neighborNumber}`}
        >
          <div className="inner-icon">{cell.neighborNumber}</div>
        </div>
      )
    } else if (cell.mark === 'DOUBT' && !cell.isBomb) {
      return doubtNode
    } else if (cell.isBomb) {
      return loseBombNode
    }

    return emptyNode
  } else if (cell.mark === 'FLAG') {
    return flagNode
  } else if (cell.mark === 'DOUBT') {
    return doubtNode
  } else {
    return emptyNode
  }
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
  // loseBomb?: boolean
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
      return <UnOpenInnerContent status={status} cell={cell} />
    }
  }, [cell, status])

  const classNames = [
    'cell',
    `id-${cell.id}`,
    cell.isOpen ? 'is-open' : 'un-open',
    mouseStatus,
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
