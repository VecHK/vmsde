import React, { ReactNode } from 'react'
import './index.css'

export default function Button({
  children,
  ...restProps
}: {
  children?: ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="c-button" {...restProps}>
      <div className="rb-inner">{children}</div>
    </button>
  )
}
