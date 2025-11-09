import type { Tile } from '@/types'

const matchPosition = (a: Tile, b: Tile) => a.x === b.x && a.y === b.y
