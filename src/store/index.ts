import { GameState, State, type Tile } from '@/types'
import { NUMBER_OF_MINES } from '@/utils/constants'
import { randomNumber } from '@/utils/random'
import { atom } from 'jotai'
import { timerElapsedAtom, timerRunningAtom, timerStartAtom } from './timer'

export const boardSizeAtom = atom({ width: 9, height: 9 })

export const mineCountAtom = atom<number>(10)

export const tilesAtom = atom<Tile[]>([])

export const initializeTilesAtom = atom(null, (get, set) => {
  const boardSize = get(boardSizeAtom)
  const initialTiles = Array.from({ length: boardSize.width * boardSize.height }).map((_, index) => {
    return { index, state: State.hidden } satisfies Tile
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

// prettier-ignore
const neighborOffsets = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],/*(0,0)*/ [1,  0],
  [-1,  1], [0,  1], [1,  1],
]

const nearbyTilesAtom = atom((get) => (index: number) => {
  const tiles = get(tilesAtom)
  const boardSize = get(boardSizeAtom)
  const x = index % boardSize.width
  const y = Math.floor(index / boardSize.width)

  const nearbyTiles: Tile[] = []

  for (const [dx, dy] of neighborOffsets) {
    const nx = x + dx
    const ny = y + dy

    if (nx < 0 || nx >= boardSize.width || ny < 0 || ny >= boardSize.height) {
      continue
    }

    const idx = nx + ny * boardSize.width
    const tile = tiles[idx]

    if (tile) {
      nearbyTiles.push(tile)
    }
  }

  return nearbyTiles
})

export const checkWinConditionAtom = atom(null, (get, set) => {
  const tiles = get(tilesAtom)
  const hiddenCount = tiles.filter((tile) => tile.state === State.hidden).length
  const markedCount = tiles.filter((tile) => tile.state === State.marked).length
  const mineCount = tiles.filter((tile) => tile.mine).length

  if (hiddenCount === 0 && mineCount === markedCount) {
    set(gameStateAtom, GameState.won)
    set(timerRunningAtom, false)
  }
})

export const revealTileAtom = atom(null, (get, set, currentIndex: number) => {
  console.log('Revealing tile:', currentIndex)
  const tiles = get(tilesAtom)
  const getNearbyTiles = get(nearbyTilesAtom)

  const newTiles = tiles.map((tile) => tile)

  const queue: number[] = [currentIndex]

  while (queue.length > 0) {
    const queueIndex = queue.shift()!
    const tile = newTiles[queueIndex]

    if (tile.state !== State.hidden) {
      continue
    }

    if (tile.mine) {
      newTiles[queueIndex].state = State.mine
      set(tilesAtom, newTiles)
      set(gameStateAtom, GameState.lost)
      set(timerRunningAtom, false)
      return
    }

    newTiles[queueIndex].state = State.number

    const nearbyTiles = getNearbyTiles(queueIndex)
    const nearbyMinesCount = nearbyTiles.filter((tile) => tile.mine).length

    if (nearbyMinesCount === 0) {
      for (const nearbyTile of nearbyTiles) {
        queue.push(nearbyTile.index)
      }
    } else {
      newTiles[queueIndex].adjacentMinesCount = nearbyMinesCount
    }
  }
  set(tilesAtom, newTiles)

  set(checkWinConditionAtom)
})

export const tryRevealTileAtom = atom(null, (get, set, index: number) => {
  const tiles = get(tilesAtom)
  const tile = tiles[index]

  if (tile.state !== State.number) {
    return
  }

  const getNearbyTiles = get(nearbyTilesAtom)
  const nearbyTiles = getNearbyTiles(index)
  const markedCount = nearbyTiles.filter((tile) => tile.state === State.marked).length

  const nearbyMinesCount = tile.adjacentMinesCount ?? 0
  if (markedCount === nearbyMinesCount) {
    for (const nearbyTile of nearbyTiles) {
      set(revealTileAtom, nearbyTile.index)
    }
  }
})

export const markTileAtom = atom(null, (get, set, index: number) => {
  const tiles = get(tilesAtom)
  const selectedTile = tiles[index]
  const gameState = get(gameStateAtom)

  const allowedStates: State[] = [State.hidden, State.marked]
  if (!allowedStates.includes(selectedTile.state)) {
    return
  }

  if (gameState !== GameState.going) {
    return
  }

  const marked = selectedTile.state === State.marked

  const newTiles = tiles.map((tile) =>
    tile.index === index ? { ...tile, state: marked ? State.hidden : State.marked } : tile
  )
  set(tilesAtom, newTiles)
  set(mineCountAtom, get(mineCountAtom) + (marked ? 1 : -1))

  set(checkWinConditionAtom)
})

export const resetGameAtom = atom(null, (_, set) => {
  set(gameStateAtom, GameState.idle)
  set(timerRunningAtom, false)
  set(timerStartAtom, null)
  set(timerElapsedAtom, 0)
})
