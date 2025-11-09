import { Board } from '@/components/board'

export const App = () => {
  return (
    <main className="flex min-h-svh flex-col items-center gap-10 pt-20">
      <h1 className="text-3xl font-bold uppercase">free mines</h1>
      <Board />
    </main>
  )
}
