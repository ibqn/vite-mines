import { Board } from '@/components/board'
import { useAtomValue } from 'jotai'
import { mineCountAtom } from './store'
import { useMillisecondTimer } from './hooks/use-millisecond-timer'
import { format } from 'date-fns'

export const App = () => {
  const minesCount = useAtomValue(mineCountAtom)
  const { elapsed } = useMillisecondTimer()

  return (
    <main className="flex min-h-svh flex-col items-center gap-10 pt-20">
      <div className="space-y-10">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold uppercase">free mines</h1>
            <p>Mines left: {minesCount}</p>
          </div>
          <div className="flex">
            <span className="font-mono text-2xl font-light tabular-nums">{format(new Date(elapsed), 'mm:ss.SSS')}</span>
          </div>
        </div>

        <Board />
      </div>
    </main>
  )
}
