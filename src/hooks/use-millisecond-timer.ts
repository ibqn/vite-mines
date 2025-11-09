import { useAtom, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { timerStartAtom, timerRunningAtom, timerTickAtom } from '@/store/timer'

export function useMillisecondTimer() {
  const [running, setRunning] = useAtom(timerRunningAtom)
  const [, setStart] = useAtom(timerStartAtom)
  const [elapsed] = useAtom(timerTickAtom)
  const updateTick = useSetAtom(timerTickAtom)

  useEffect(() => {
    let interval: number | null = null
    if (running) {
      setStart(Date.now())
      interval = setInterval(() => {
        updateTick()
      }, 10)
    }
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [running, setStart, updateTick])

  return {
    elapsed,
    running,
    setRunning,
    start: () => setRunning(true),
    stop: () => setRunning(false),
    reset: () => {
      setStart(null)
      setRunning(false)
    },
  }
}
