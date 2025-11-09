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

export const nearbyTilesAtom = atom((get) => (index: number) => {
  const tiles = get(tilesAtom)
  const boardSize = get(boardSizeAtom)

  const nearbyTiles: Tile[] = []

  for (let offsetX = -1; offsetX <= 1; offsetX++) {
    for (let offsetY = -1; offsetY <= 1; offsetY++) {
      if (offsetX === 0 && offsetY == 0) {
        continue
      }

      const x = index % boardSize.width
      const y = Math.floor(index / boardSize.width)

      if (x + offsetX < 0 || x + offsetX >= boardSize.width || y + offsetY < 0 || y + offsetY >= boardSize.height) {
        continue
      }

      const idx = index + offsetX + offsetY * boardSize.width
      const tile = tiles[idx]

      if (tile) {
        nearbyTiles.push(tile)
      }
    }
  }

  return nearbyTiles
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
      return
    }
    console.log('Revealing safe tile:', queueIndex, newTiles[queueIndex])

    newTiles[queueIndex].state = State.number

    const nearbyTiles = getNearbyTiles(queueIndex)
    console.log('Nearby tiles:', nearbyTiles)

    const nearbyMinesCount = nearbyTiles.filter((tile) => tile.mine).length
    console.log('Nearby mines count:', nearbyMinesCount)

    if (nearbyMinesCount === 0) {
      for (const nearbyTile of nearbyTiles) {
        queue.push(nearbyTile.index)
      }
    } else {
      newTiles[queueIndex].adjacentMinesCount = nearbyMinesCount
    }
  }
  set(tilesAtom, newTiles)
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

  const marked = selectedTile.state === State.marked

  const newTiles = tiles.map((tile) =>
    tile.index === index ? { ...tile, state: marked ? State.hidden : State.marked } : tile
  )
  set(tilesAtom, newTiles)
  set(mineCountAtom, get(mineCountAtom) + (marked ? 1 : -1))
})
