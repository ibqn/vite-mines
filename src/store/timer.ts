import { atom } from 'jotai'

export const timerStartAtom = atom<number | null>(null)
export const timerRunningAtom = atom<boolean>(false)
export const timerElapsedAtom = atom<number>(0)

export const timerTickAtom = atom(
  (get) => get(timerElapsedAtom),
  (get, set) => {
    const start = get(timerStartAtom)
    if (start !== null) {
      set(timerElapsedAtom, Date.now() - start)
    }
  }
)
