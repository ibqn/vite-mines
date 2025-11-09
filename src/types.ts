export const State = {
  hidden: 'hidden',
  mine: 'mine',
  number: 'number',
  marked: 'marked',
} as const

export type State = (typeof State)[keyof typeof State]

export type Tile = {
  index: number
  x: number
  y: number
  state: State
  mine?: boolean
  adjacentMinesCount?: number
}

export const GameState = {
  idle: 'idle',
  going: 'going',
  won: 'won',
  lost: 'lost',
} as const

export type GameState = (typeof GameState)[keyof typeof GameState]
