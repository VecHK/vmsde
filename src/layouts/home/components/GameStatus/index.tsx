import { ReactNode, useMemo, useState } from 'react'
import Button from 'src/components/Button'
import { VMS, VMSStatus } from 'src/vms-logic'
import GameCell from '../GameCell'
import './index.css'

import { Trans, useTranslation } from 'react-i18next'

function PlayingTips() {
  const cellNode = useMemo(
    () => (
      <GameCell
        cell={{
          id: 9,
          isBomb: false,
          mark: 'NONE',
          neighborNumber: 0,
          isOpen: false,
        }}
      />
    ),
    []
  )

  return <Trans i18nKey="PlayingTips">点击{cellNode}就完事了</Trans>
}

export type GameStatusProps = {
  vms: VMS
  status: VMSStatus

  onClickReplay: () => void
}
export function GameStatus({ status, onClickReplay }: GameStatusProps) {
  const { t } = useTranslation()

  const [winCount, setWinCount] = useState(0)
  const [loseCount, setLoseCount] = useState(0)

  const replayButton = useMemo(() => {
    return (
      <Button
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
        {t('再来一把')}
      </Button>
    )
  }, [onClickReplay, status, t])

  return (
    <div className="game-status">
      {useMemo<ReactNode>(() => {
        if (status === 'PLAYING') {
          return <PlayingTips />
        }

        let labelText = t('✌️你赢了')

        if (status === 'WIN') {
          if (winCount > 3) {
            labelText = t('✌️赢麻了')
          } else if (winCount > 2) {
            labelText = t('✌️四赢')
          } else if (winCount > 1) {
            labelText = t('✌️三赢')
          } else if (winCount > 0) {
            labelText = t('✌️双赢')
          }
        } else if (status === 'LOSE') {
          labelText = t(`胜败乃兵家常事，大侠请重新来过`)

          if (loseCount > 1) {
            labelText = t(`无序连败早该管管了`)
          }
        }

        return (
          <div className="game-end">
            <div className="label">{labelText}</div>
            {replayButton}
          </div>
        )
      }, [loseCount, replayButton, status, t, winCount])}
    </div>
  )
}
