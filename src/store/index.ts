import { State, type Tile } from '@/types'
import { atom } from 'jotai'

export const boardSizeAtom = atom({ width: 9, height: 9 })

export const mineCountAtom = atom<number>(10)

export const tilesAtom = atom<Tile[]>([])

export const initializeTilesAtom = atom(null, (get, set) => {
  const boardSize = get(boardSizeAtom)
  const initialTiles = Array.from({ length: boardSize.width * boardSize.height }).map((_, index) => {
    const x = index % boardSize.width
    const y = Math.floor(index / boardSize.width)
    return { index, x, y, state: State.hidden } satisfies Tile
  })

  set(tilesAtom, initialTiles)
})
