import { tilesAtom } from '@/store'
import { State, type Tile } from '@/types'
import { useImmerAtom } from 'jotai-immer'
import { useEffect, useRef, type MouseEventHandler } from 'react'

export const Cell = ({ tile }: { tile: Tile }) => {
  const ref = useRef<HTMLDivElement>(null)

  const [_, setTiles] = useImmerAtom(tilesAtom)

  const handleClick = (index: number) => () => {
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
