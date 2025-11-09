import { gameStateAtom, generateMinePositionsAtom, revealTileAtom, tilesAtom } from '@/store'
import { GameState, State, type Tile } from '@/types'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect, useRef, type MouseEventHandler } from 'react'

type CellProps = {
  tile: Tile
}

export const Cell = ({ tile }: CellProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const [tiles, setTiles] = useAtom(tilesAtom)
  const generateMinePositions = useSetAtom(generateMinePositionsAtom)
  const revealTile = useSetAtom(revealTileAtom)
  const [gameState, setGameState] = useAtom(gameStateAtom)

  const handleClick = (index: number) => () => {
    console.log('Cell clicked:', index)
    if (gameState === GameState.idle) {
      generateMinePositions(index)
      setGameState(GameState.going)
    }

    if (gameState !== GameState.going && gameState !== GameState.idle) {
      return
    }

    revealTile(index)
  }

  const handleRightClick =
    (index: number): MouseEventHandler =>
    (event) => {
      event.preventDefault()

      setTiles(
        tiles.map((tile) =>
          tile.index === index ? { ...tile, state: tile.state === State.marked ? State.hidden : State.marked } : tile
        )
      )
    }

  useEffect(() => {
    if (tile.adjacentMinesCount && ref.current) {
      ref.current.style.backgroundImage = `url(./images/type${tile.adjacentMinesCount}.svg)`
    }
  }, [tile.adjacentMinesCount, ref])

  return (
    <div
      ref={ref}
      className="flex size-16 cursor-pointer border border-gray-400 bg-gray-400 bg-center bg-no-repeat
        data-[state=marked]:bg-yellow-400 data-[state=marked]:bg-[url('./images/flag.svg')] data-[state=mine]:bg-red-700
        data-[state=mine]:bg-[url('./images/mine.svg')] data-[state=number]:bg-white"
      onClick={handleClick(tile.index)}
      onContextMenu={handleRightClick(tile.index)}
      data-state={tile.state}
    ></div>
  )
}
