import { Item, ItemCast } from '../wc-feed-items'


export type T_USER_SETTINGS = {
    isCryptoLeftFeedDisabled?: boolean
    isTrendingFeedEnabled?: boolean
    isSaveDraftEnabled?: boolean
    isPrimaryFeedFollowing?: boolean
}

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
    settings?: T_USER_SETTINGS
}

export type T_MODAL_DATA = {
    reply?: Item | null
    quote?: ItemCast | null
    channelKey?: string
}


export type T_MINI_APP_DATA = {
    homeUrl: string
    name?: string
    splashImageUrl?: string
    isInstalled?: boolean
    iconUrl?: string
    author?: {
        username: string
        avatarUrl: string
    },
    fetchFrameData?: boolean
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
    isComposeModalOpen: boolean
    composeModalData: T_MODAL_DATA | null
    isDcModalOpen: boolean
    dcModalPage: string
    isMiniApp: boolean
    miniAppToOpen: null  | T_MINI_APP_DATA
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
    setComposeModalOpen: (a: boolean) => void
    setComposeModalData: (data: T_MODAL_DATA) => void
    setDcModalOpen: (a: boolean) => void
    setDcModalPage: (a: string) => void
    openMiniApp:(a: null | T_MINI_APP_DATA) => void
    setIsMiniApp: (a: boolean) => void
}

export type T_META_DATA = { title: string; description: string}
export type T_META_TAG = { name: string; content: string }

export type MetaStore = {
    title: string
    description: string
    metatags: T_META_TAG[]
    setMeta: (data: T_META_DATA) => void
    setMetatags: (data: T_META_TAG[]) => void
}