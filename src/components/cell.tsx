import { gameStateAtom, generateMinePositionsAtom, tilesAtom } from '@/store'
import { GameState, State, type Tile } from '@/types'
import { useAtom, useSetAtom } from 'jotai'
import { useImmerAtom } from 'jotai-immer'
import { useEffect, useRef, type MouseEventHandler } from 'react'

type CellProps = {
  tile: Tile
}

export const Cell = ({ tile }: CellProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const [_, setTiles] = useImmerAtom(tilesAtom)
  const generateMinePositions = useSetAtom(generateMinePositionsAtom)
  const [gameState, setGameState] = useAtom(gameStateAtom)

  const handleClick = (index: number) => () => {
    if (gameState === GameState.idle) {
      generateMinePositions(index)
      setGameState(GameState.going)
    }

    if (gameState !== GameState.going && gameState !== GameState.idle) {
      return
    }

    setTiles((tiles) => {
      tiles[index].state = State.mine
      return tiles
    })
  }

  const handleRightClick =
    (index: number): MouseEventHandler =>
    (event) => {
      event.preventDefault()

      setTiles((tiles) => {
        tiles[index].state = State.marked
        return tiles
      })
    }

  useEffect(() => {
    if (tile && ref.current) {
      ref.current.setAttribute('data-state', tile.state)
    }
  }, [tile, ref])

  return (
    <div
      ref={ref}
      className="flex size-16 cursor-pointer border border-gray-400 bg-white bg-center bg-no-repeat
        data-[state=marked]:bg-yellow-400 data-[state=marked]:bg-[url('./images/flag.svg')] data-[state=mine]:bg-red-700
        data-[state=mine]:bg-[url('./images/mine.svg')]"
      onClick={handleClick(tile.index)}
      onContextMenu={handleRightClick(tile.index)}
      data-state={tile.state}
    ></div>
  )
}
