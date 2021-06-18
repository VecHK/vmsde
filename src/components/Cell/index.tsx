import { CSSProperties, ReactNode, useMemo } from 'react'
import './index.css'

function SolidInner({ innerContent }: { innerContent: ReactNode }) {
  return (
    <div className="solid-inner">
      <div className="inner-content">{innerContent}</div>
    </div>
  )
}

function HollowInner({ innerContent }: { innerContent: ReactNode }) {
  return (
    <div className="hollow-inner">
      <div className="inner-content">{innerContent}</div>
    </div>
  )
}

export type CellMouseStatus = 'press' | 'hover' | 'default'
export type CellInnerType = 'solid' | 'hollow'
export default function Cell({
  mouseStatus,
  innerType,
  innerContent,
  cursor = 'auto',
  nColor,

  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
  onMouseDown,
}: {
  innerType: CellInnerType
  innerContent: ReactNode
  cursor?: CSSProperties['cursor']

  nColor?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

  mouseStatus?: CellMouseStatus

  onClick?: React.HTMLAttributes<HTMLDivElement>['onClick']
  onMouseEnter?: React.HTMLAttributes<HTMLDivElement>['onMouseEnter']
  onMouseLeave?: React.HTMLAttributes<HTMLDivElement>['onMouseLeave']
  onMouseUp?: React.HTMLAttributes<HTMLDivElement>['onMouseUp']
  onMouseDown?: React.HTMLAttributes<HTMLDivElement>['onMouseDown']
}) {
  const innerNode = useMemo(
    () =>
      innerType === 'solid' ? (
        <SolidInner innerContent={innerContent} />
      ) : (
        <HollowInner innerContent={innerContent} />
      ),
    [innerContent, innerType]
  )

  const classNames = ['cell-frame']

  if (mouseStatus === undefined) {
    classNames.push('auto-press')
  } else {
    classNames.push(mouseStatus)
  }

  if (nColor !== undefined) {
    classNames.push(`n-${nColor}`)
  }

  return (
    <div
      className={classNames.join(' ')}
      style={{ cursor }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
    >
      {innerNode}
    </div>
  )
}
