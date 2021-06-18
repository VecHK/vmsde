import React, { ReactNode, useMemo, useState } from 'react'
import CreateVMS, { VMS, VMSStatus } from 'src/vms-logic'
import GameCell from '../GameCell'
import './index.css'

export type GameStatusProps = {
  vms: VMS
  setVMS: React.Dispatch<React.SetStateAction<VMS>>
  status: VMSStatus

  onClickReplay: () => void

  cfg: {
    WIDTH: number
    HEIGHT: number
    BOMB_NUM: number
  }
}
export function GameStatus({
  status,
  setVMS,
  onClickReplay,
  cfg: { WIDTH, HEIGHT, BOMB_NUM },
}: GameStatusProps) {
  const [lock, setLock] = useState(false)
  const [winCount, setWinCount] = useState(0)
  const [loseCount, setLoseCount] = useState(0)

  const replayButton = useMemo(() => {
    return (
      <button
        className="replay-button"
        onClick={() => {
          if (status === 'WIN') {
            setLoseCount(0)
            setWinCount((c) => c + 1)
          } else if (status === 'LOSE') {
            setLoseCount((c) => c + 1)
            setWinCount(0)
          }

          onClickReplay()
        }}
      >
        <div className="rb-inner">再来一把</div>
      </button>
    )
  }, [onClickReplay, status])

  return (
    <div className="game-status">
      {useMemo<ReactNode>(() => {
        if (status === 'PLAYING') {
          // setLock(true)
          return (
            <>
              点击
              <GameCell
                cell={{
                  id: 9,
                  isBomb: false,
                  mark: 'NONE',
                  neighborNumber: 0,
                  isOpen: false,
                }}
              />
              就完事了
            </>
          )
        }

        let labelText = '✌️你赢了'

        if (status === 'WIN') {
          if (winCount > 3) {
            labelText = '✌️赢麻了'
          } else if (winCount > 2) {
            labelText = '✌️四赢'
          } else if (winCount > 1) {
            labelText = '✌️三赢'
          } else if (winCount > 0) {
            labelText = '✌️双赢'
          }
        } else if (status === 'LOSE') {
          labelText = `胜败乃兵家常事，大侠请重新来过`

          if (loseCount > 1) {
            labelText = '无序连败早该管管了！'
          }
        }

        return (
          <div className="game-end">
            <div className="label">{labelText}</div>
            {replayButton}
          </div>
        )
      }, [loseCount, replayButton, status, winCount])}
    </div>
  )
}
