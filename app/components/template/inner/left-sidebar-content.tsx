import {
  Bell, Home, Search, MessageCircle,
  Bookmark, User, Settings, ChevronDown, Sun,
  Grid2x2, Moon, LogOut,
  LogIn
} from "lucide-react"
import { Button } from "~/components/ui/button"
import { useMainStore } from "~/store/main"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { clearUserData, clearAllUsersData, persistUserData } from "~/lib/localstorage"
import { useState, useEffect } from "react"
import { PopOverMenu, PopOverMenuItem } from "~/components/blocks/drop-menu"
import { ChannelsList } from "~/components/blocks/sidebar-left/channels-list"
import { useLocation } from "react-router";
import { useNotifBadgeStore } from "~/store/notif-badge-store"
import { wc } from "~/lib/client"
import { removeNotificationBadge } from '~/lib/misc'

export const LeftSidebarContent = (
  { isDarkMode, toggleTheme, setAddAccountModalOpen }:
    { isDarkMode: boolean; toggleTheme: () => void; setAddAccountModalOpen: (value: boolean) => void }
) => {
  const { isConnectModalOpen, setConnectModalOpen,
    isUserLoggedIn, mainUserData, allUsersData,
    setIsUserLoggedIn, setAllUsersData, setUserData, navigate
  } = useMainStore()

  const { newNotificationsCount, newDmsCount, setNewNotificationsCount } = useNotifBadgeStore()

  const [whatMenuActive, setWhatMenuActive] = useState('')

  const location = useLocation()


  useEffect(() => {
    if (!location?.pathname) return

    if (
      ['/~/trending', '/~/following', '/~/fc-oss', '/~/politics', '/~/cryptoleft'].includes(location?.pathname)
    ) {
      setWhatMenuActive('home')
    } else if (location?.pathname?.startsWith('/~/notifications')) {
      setWhatMenuActive('notifications')
      setNewNotificationsCount(0)
      removeNotificationBadge()
    } else if (location?.pathname?.startsWith('/~/inbox')) {
      setWhatMenuActive('dc')
    } else if (location?.pathname?.startsWith('/~/explore')) {
      setWhatMenuActive('explore')
    } else if (location?.pathname?.startsWith('/~/bookmarks')) {
      setWhatMenuActive('bookmarks')
    } else if (location?.pathname.startsWith(`/${mainUserData?.username}`) && mainUserData?.username) {
      setWhatMenuActive('profile')
    } else if (location?.pathname?.startsWith('/~/mini-apps')) {
      setWhatMenuActive('mini-apps')
    } else {
      setWhatMenuActive('')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainUserData?.username, location?.pathname])

  const handleMenuNavigate = ({
    isAuthNeeded = false,
    path,
    activeMenu
  }: {
    isAuthNeeded?: boolean,
    path: string,
    activeMenu: string
  }) => {
    if (isAuthNeeded && !isUserLoggedIn && !isConnectModalOpen) {
      setConnectModalOpen(true)
    } else {
      setWhatMenuActive(activeMenu)
      navigate(path)
    }
  }

  const handleLogout = () => {
    wc.setToken('')
    clearUserData()
    clearAllUsersData()
    setIsUserLoggedIn(false)
    setUserData(null)
    setAllUsersData([])
  }

  const handleProfile = () => {
    setWhatMenuActive('profile')
    navigate(`/${mainUserData?.username}`)
  }

  const handleAddAccount = () => {
    setAddAccountModalOpen(true)
  }

  return (
    <>
      <div className="mb-8 flex items-center">
        <div
          role="button"
          aria-label="logo"
          tabIndex={0}
          onKeyDown={() => { }}
          onClick={() => {
            () => handleMenuNavigate({
              isAuthNeeded: false,
              path: '/',
              activeMenu: 'home'
            })
          }} className="w-8 h-8 ml-2 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold mr-2
        cursor-pointer
        ">
          FC</div>
        <div className="ml-auto flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleMenuNavigate({
            isAuthNeeded: true,
            path: '/~/settings',
            activeMenu: 'settings'
          })}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <Button variant="ghost" className={`justify-start mb-2 font-semibold w-full ${whatMenuActive === 'home' ? 'dark:text-red-600 text-red-500 bg-zinc-200/30 dark:bg-zinc-600/30' : ''}`} onClick={() => handleMenuNavigate({
        isAuthNeeded: false,
        path: '/',
        activeMenu: 'home'
      })}>
        <Home className="h-5 w-5 mr-3" />
        Home
      </Button>
      <Button variant="ghost" className={`justify-start mb-2 font-semibold w-full ${whatMenuActive === 'notifications' ? 'dark:text-red-600 text-red-500 bg-zinc-200/30 dark:bg-zinc-600/30' : ''}`} onClick={() => handleMenuNavigate({
        isAuthNeeded: true,
        path: '/~/notifications',
        activeMenu: 'notifications'
      })}>
        <Bell className="h-5 w-5 mr-3" />
        Notifications

        {newNotificationsCount && newNotificationsCount > 0 && <div className=" bg-red-600 absolute flex items-center justify-center rounded-full shadow-sm xl:right-0 xl:top-auto xl:ml-0 xl:mr-2 xl:min-h-[14px] xl:w-auto xl:min-w-[14px] xl:px-[0.175rem] xl:py-[.025rem] top-1.5 h-2 w-2 bg-action-red ml-4"><span className="hidden text-[9px] font-normal xl:flex text-white">{newNotificationsCount}</span></div> || null}
      </Button>
      <Button variant="ghost" className={`justify-start mb-2 font-semibold w-full ${whatMenuActive === 'dc' ? 'dark:text-red-600 text-red-500 bg-zinc-200/30 dark:bg-zinc-600/30' : ''}`} onClick={() => handleMenuNavigate({
        isAuthNeeded: true,
        path: '/~/inbox',
        activeMenu: 'dc'
      })}>
        <MessageCircle className="h-5 w-5 mr-3" />
        Direct Casts

        {newDmsCount && newDmsCount > 0 && <div className=" bg-red-600 absolute flex items-center justify-center rounded-full shadow-sm xl:right-0 xl:top-auto xl:ml-0 xl:mr-2 xl:min-h-[14px] xl:w-auto xl:min-w-[14px] xl:px-[0.175rem] xl:py-[.025rem] top-1.5 h-2 w-2 bg-action-red ml-4"><span className="hidden text-[9px] font-normal xl:flex text-white">{newDmsCount}</span></div> || null}
      </Button>
      <Button variant="ghost" className={`justify-start mb-2 font-semibold w-full ${whatMenuActive === 'explore' ? 'dark:text-red-600 text-red-500 bg-zinc-200/30 dark:bg-zinc-600/30' : ''}`} onClick={() => handleMenuNavigate({
        activeMenu: 'explore',
        path: '/~/explore/users',
        isAuthNeeded: false
      })}>
        <Search className="h-5 w-5 mr-3" />
        Explore
      </Button>
      <Button variant="ghost" className={`justify-start mb-2 font-semibold w-full ${whatMenuActive === 'bookmarks' ? 'dark:text-red-600 text-red-500 bg-zinc-200/30 dark:bg-zinc-600/30' : ''}`} onClick={() => handleMenuNavigate({
        activeMenu: 'bookmarks',
        path: '/~/bookmarks',
        isAuthNeeded: true
      })}>
        <Bookmark className="h-5 w-5 mr-3" />
        Bookmarks
      </Button>
      <Button variant="ghost" className={`justify-start mb-2 font-semibold w-full ${whatMenuActive === 'mini-apps' ? 'dark:text-red-600 text-red-500 bg-zinc-200/30 dark:bg-zinc-600/30' : ''}`} onClick={() => handleMenuNavigate({
        activeMenu: 'miniapps',
        path: '/~/mini-apps',
        isAuthNeeded: true
      })}>
        <Grid2x2 className="h-5 w-5 mr-3" />
        Mini Apps
      </Button>


      {isUserLoggedIn &&
        (<div className="flex items-center justify-start mb-2 w-full">
          <Button variant="ghost" className={`justify-start w-[80%] ${whatMenuActive === 'profile' ? 'dark:text-red-600 text-red-500 bg-zinc-200/30 dark:bg-zinc-600/30' : ''}`} onClick={handleProfile}>
            <Avatar className="w-5 h-5 mr-3">
              <AvatarImage src={mainUserData?.avatar} alt="@user" />
              <AvatarFallback>{mainUserData?.username ?? 'Anon'}</AvatarFallback>
            </Avatar>
            {mainUserData?.username}
          </Button>
          <PopOverMenu
            trigger={
              <Button variant="ghost" className="justify-end w-[20%] ml-1 mr-1 p-4">
                <ChevronDown className="h-5 w-5" />
              </Button>
            }
            content={
              <>
                {allUsersData.length > 1 ? allUsersData.filter((u) => u.fid !== mainUserData?.fid).map((user) => (
                  <PopOverMenuItem className="cursor-pointer" key={user.fid} >
                    <Button variant="ghost" className="" onClick={() => {
                      setUserData(user)
                      wc.setToken(user?.authToken as string)
                      persistUserData(user)
                      window.location.reload()
                    }}>
                      <Avatar className="w-5 h-5 mr-3">
                        <AvatarImage src={user.avatar} alt="@user" />
                        <AvatarFallback>{user.username ?? 'Anon'}</AvatarFallback>
                      </Avatar>
                      {user.username}
                    </Button>
                    <Button variant="outline" className="ml-auto hover:bg-opacity-30" onClick={() => {
                      setAllUsersData(allUsersData.filter((u) => u.fid !== user.fid))
                      clearAllUsersData(user.fid)
                    }}><LogOut className="h-4 w-4" /></Button>
                  </PopOverMenuItem>
                )) : null}

                <PopOverMenuItem className="cursor-pointer" onClick={handleAddAccount}>
                  <Button variant="ghost" className=""><User className="h-5 w-5 mr-3" />
                    Add Account
                  </Button>
                </PopOverMenuItem>
              </>
            } />

        </div>
        )
      }
      {!isUserLoggedIn && (
        <Button variant="ghost" className="justify-start mb-2 w-full" onClick={() => setConnectModalOpen(true)}>
          <User className="h-5 w-5 mr-3" />
          Profile
        </Button>
      )}


      {isUserLoggedIn && <Button variant="ghost" className="justify-start mb-2 w-full" onClick={handleLogout}>
        <LogOut className="h-5 w-5 mr-3" />
        Logout
      </Button>}
      {!isUserLoggedIn && <Button variant="ghost" className="justify-start mb-2 w-full" onClick={() => setConnectModalOpen(true)}>
        <LogIn className="h-5 w-5 mr-3" />
        Login
      </Button>}

      <ChannelsList />
    </>)
}
