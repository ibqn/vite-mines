import { GameState, State, type Tile } from '@/types'
import { NUMBER_OF_MINES } from '@/utils/constants'
import { randomNumber } from '@/utils/random'
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

export const generateMinePositionsAtom = atom(null, (get, set, exceptIndex: number) => {
  const mines = new Set<number>()
  const tiles = get(tilesAtom)

  while (mines.size < NUMBER_OF_MINES) {
    const randomIndex = randomNumber(tiles.length)
    if (randomIndex !== exceptIndex) {
      mines.add(randomIndex)
    }
  }

  const tilesWithMines = [...tiles]
  for (const index of mines) {
    tilesWithMines[index].mine = true
  }

  set(mineCountAtom, mines.size)
  set(tilesAtom, tilesWithMines)
})

export const gameStateAtom = atom<GameState>(GameState.idle)
