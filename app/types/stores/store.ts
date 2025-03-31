import { ResultCast } from '../wc-all-fid-casts'

export type T_USER_DATA = {
    authToken?: string
    avatar?: string
    username?: string
    displayName?: string
    bio?: string
    fid?: number
    location?: string
    locationId?: string
    url?: string
}

export type T_MODAL_DATA = {
    reply?: ResultCast | null
    quote?: ResultCast | null
}

export type MainState = {
    isDarkMode: boolean
    isTablet: boolean
    isMobile: boolean
    isUserLoggedIn: boolean
    mainUserData: T_USER_DATA | null
    allUsersData: T_USER_DATA[]
    isConnectModalOpen: boolean
    newNotificationsCount: number
    newDmsCount: number
    lightBoxSrc: string
    lightBoxOpen: boolean
    isRightSidebarVisible: boolean
    isComposeModalOpen: boolean
    composeModalData: T_MODAL_DATA | null
    navigate: (_a: string | number) => void
    toggleDarkMode: () => void
    setIsTablet: (a: boolean) => void
    setIsMobile: (a: boolean) => void
    setDarkMode: (a: boolean) => void
    setUserData: (data: T_USER_DATA | null) => void
    setAllUsersData: (data: T_USER_DATA[]) => void
    setIsUserLoggedIn: (a: boolean) => void
    setConnectModalOpen: (a: boolean) => void
    setNewNotificationsCount: (a: number) => void
    setNewDmsCount: (a: number) => void
    setLightBoxSrc: (a: string) => void
    setLightBoxOpen: (a: boolean) => void
    setNavigate: (a: (_a: string | number) => void) => void
    setRightSidebarVisible: (a: boolean) => void
    setComposeModalOpen: (a: boolean, data?: T_MODAL_DATA) => void
}

export type T_META_DATA = { title: string; description: string; keywords: string }
export type T_META_TAG = { name: string; content: string }

export type MetaStore = {
    title: string
    description: string
    keywords: string
    metatags: T_META_TAG[]
    setMeta: (data: T_META_DATA) => void
    setMetatags: (data: T_META_TAG[]) => void
}