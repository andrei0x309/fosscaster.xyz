import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { MainState } from '~/types/stores/store'
import { setAuthToken } from '~/lib/client'

export const useMainStore = create<MainState>()(subscribeWithSelector((set) => ({
    isDarkMode: false,
    isTablet: false,
    isMobile: false,
    isUserLoggedIn: false,
    isConnectModalOpen: false,
    mainUserData: null,
    allUsersData: [],
    newNotificationsCount: 0,
    newDmsCount: 0,
    lightBoxSrc: '',
    lightBoxOpen: false,
    isRightSidebarVisible: true,
    isComposeModalOpen: false,
    composeModalData: null,
    isDcModalOpen: false,
    dcModalPage: '',
    miniAppToOpen: null,
    navigate: () => {},
    toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    setIsTablet: (a) => set(() => ({ isTablet: a })),
    setIsMobile: (a) => set(() => ({ isMobile: a })),
    setDarkMode: (a) => set(() => ({ isDarkMode: a })),
    setUserData: (data) => set(() => ({ mainUserData: data })),
    setAllUsersData: (data) => set(() => ({ allUsersData: data })),
    setIsUserLoggedIn: (a) => set(() => ({ isUserLoggedIn: a })),
    setConnectModalOpen: (a) => set(() => ({ isConnectModalOpen: a })),
    setNewNotificationsCount: (a) => set(() => ({ newNotificationsCount: a })),
    setNewDmsCount: (a) => set(() => ({ newDmsCount: a })),
    setLightBoxSrc: (a) => set(() => ({ lightBoxSrc: a })),
    setLightBoxOpen: (a) => set(() => ({ lightBoxOpen: a })),
    setNavigate: (a) => set(() => ({ navigate: a })),
    setRightSidebarVisible: (a) => set(() => ({ isRightSidebarVisible: a })),
    setComposeModalOpen: (a) => set(() => {
        if(a === false) return {
            composeModalData: null,
            isComposeModalOpen: false
        }
        return {
            isComposeModalOpen: true
        }
    }),
    setComposeModalData: (a) => set(() => ({ composeModalData: a })),
    setDcModalOpen: (a) => set(() => ({ isDcModalOpen: a})),
    setDcModalPage: (a) => set(() => ({ dcModalPage: a })),
    openMiniApp:(a) => set(() => ({ miniAppToOpen: a })),
})))

export const setInitialState = () => {
const localThemeDark = localStorage.getItem('isDarkMode') === 'true'
const isLocalThemeSet = localStorage.getItem('isDarkMode') !== null
const mediaPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const isMobile = window.matchMedia('(max-width: 768)').matches
const isTablet = window.matchMedia('(max-width: 1024)').matches
const mainUserData = localStorage.getItem('mainUserData') ? JSON.parse(localStorage.getItem('mainUserData') as string) : null
const allUsersData = localStorage.getItem('allUsersData') ? JSON.parse(localStorage.getItem('allUsersData') as string) : []
const isUserLoggedIn = mainUserData?.authToken ? true : false
if (isUserLoggedIn) {
    setAuthToken(mainUserData.authToken)
}
const isDarkMode  = isLocalThemeSet ? localThemeDark : mediaPrefersDark
useMainStore.setState({isDarkMode, isMobile, isTablet, isUserLoggedIn, mainUserData, allUsersData})
}