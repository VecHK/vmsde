import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { countBomb, countMark, VMS, getVMSStatus } from 'src/vms-logic'
import NumberMonitor from '../NumberMonitor'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

export default function GameTimer({
  className,
  vms,
  startTime,
}: {
  className?: HTMLDivElement['className']
  vms: VMS
  startTime: number | null
}) {
  const [nowTime, setNowTime] = useState(Date.now())

  const status = useMemo(() => getVMSStatus(vms.map.matrix), [vms.map.matrix])

  const refreshNow = useCallback(() => setNowTime(Date.now()), [])
  useEffect(() => {
    if (status === 'PLAYING') {
      refreshNow()
      const timer = setInterval(refreshNow, 1000)

      return () => clearInterval(timer)
    } else {
      setNowTime(Date.now())
    }
  }, [refreshNow, status])

  return useMemo(() => {
    let str = '00:00:00'
    if (startTime) {
      const x = dayjs(nowTime)
      const y = dayjs(Number(startTime))
      str = dayjs.duration(x.diff(y)).format('HH:mm:ss')
    }

    return (
      <div className={`game-timer ${className}`}>
        <NumberMonitor len={'00:00:00'.length} str={str} />
      </div>
    )
  }, [className, nowTime, startTime])
}
