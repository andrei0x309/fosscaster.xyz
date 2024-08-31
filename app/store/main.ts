import { create } from 'zustand'

// const localThemeDark = localStorage.getItem('isDarkMode') === 'true'
// const isLocalThemeSet = localStorage.getItem('isDarkMode') !== null
// const mediaPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
// const isMobile = window.matchMedia('(max-width: 768)').matches
// const isTablet = window.matchMedia('(max-width: 1024)').matches

// const isDarkMode  = isLocalThemeSet ? localThemeDark : mediaPrefersDark

type MainState = {
    isDarkMode: boolean
    isTablet: boolean
    isMobile: boolean
    toggleDarkMode: () => void
    setIsTablet: (a: boolean) => void
    setIsMobile: (a: boolean) => void
    setDarkMode: (a: boolean) => void
}

export const useMainStore = create<MainState>((set) => ({
    isDarkMode: false,
    isTablet: false,
    isMobile: false,
    toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    setIsTablet: (a) => set(() => ({ isTablet: a })),
    setIsMobile: (a) => set(() => ({ isMobile: a })),
    setDarkMode: (a) => set(() => ({ isDarkMode: a })),
}))

export const setInitialState = () => {
const localThemeDark = localStorage.getItem('isDarkMode') === 'true'
const isLocalThemeSet = localStorage.getItem('isDarkMode') !== null
const mediaPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const isMobile = window.matchMedia('(max-width: 768)').matches
const isTablet = window.matchMedia('(max-width: 1024)').matches

const isDarkMode  = isLocalThemeSet ? localThemeDark : mediaPrefersDark
useMainStore.setState({isDarkMode, isMobile, isTablet})
}