import { create } from 'zustand'



type ScrollState = {
  'home': number
  'profile': number
  'bookmark': number
  'channel': number
  'conversations': number
}

export type scrollPageKey = keyof ScrollState

export type ScrollStore = {
    scrollStore: ScrollState
    setScrollStore: (key: keyof ScrollState, value: number) => void
}

export const useStoreScroll = create<ScrollStore>((set) => ({
scrollStore: {
    home: 0,
    profile: 0,
    bookmark: 0,
    channel: 0,
    conversations: 0,
  },
  setScrollStore: (key, value) => set((state) => ({ scrollStore: { ...state.scrollStore, [key]: value } })),
}))

