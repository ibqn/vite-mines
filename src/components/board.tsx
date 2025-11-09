import { boardSizeAtom, initializeTilesAtom, tilesAtom } from '@/store'
import { useAtomValue, useSetAtom } from 'jotai'
import { Cell } from '@/components/cell'
import { useEffect } from 'react'

export const Board = () => {
  const boardSize = useAtomValue(boardSizeAtom)
  const tiles = useAtomValue(tilesAtom)
  const initializeTiles = useSetAtom(initializeTilesAtom)

  useEffect(() => {
    initializeTiles()
  }, [initializeTiles])

  return (
    <div
      className="grid grid-cols-[repeat(var(--board-width),1fr)] grid-rows-[repeat(var(--board-height),1fr)] gap-1
        bg-gray-200 p-1.5"
      style={{
        ['--board-width' as string]: `${boardSize.width}`,
        ['--board-height' as string]: `${boardSize.height}`,
      }}
    >
      {tiles.map((tile) => (
        <Cell key={tile.index} tile={tile} />
      ))}
    </div>
  )
}
