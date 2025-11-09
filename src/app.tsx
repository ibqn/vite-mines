import { Board } from '@/components/board'
import { useAtomValue } from 'jotai'
import { mineCountAtom } from './store'

export const App = () => {
  const minesCount = useAtomValue(mineCountAtom)

  return (
    <main className="flex min-h-svh flex-col items-center gap-10 pt-20">
      <div>
        <h1 className="text-3xl font-bold uppercase">free mines</h1>
        <p>Mines left: {minesCount}</p>
      </div>

      <Board />
    </main>
  )
}
