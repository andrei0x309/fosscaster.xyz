import type { MetaFunction } from "@remix-run/node";
import { Main } from "~/components/pages/main";
import { Shell } from "~/components/template/shell";
import { HydrateFallback } from "~/components/atomic/hydratation-fallback";
import { useMainStore } from "~/store/main";
import { lazy, Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from "@remix-run/react";
import { useNotifBadgeStore } from "~/store/notif-badge-store"
import { getNotifsUnseen } from '~/lib/api'
import { addNotificationBadge, removeNotificationBadge } from '~/lib/misc'
import { ComposeModal } from "~/components/functional/modals/compose-cast"


const ProfilePage = lazy(() => import('~/components/pages/profile'))
const BookmarkPage = lazy(() => import('~/components/pages/bookmarks'))
const ExplorePage = lazy(() => import('~/components/pages/explore'))
const NotificationsPage = lazy(() => import('~/components/pages/notifications'))
const InboxPage = lazy(() => import('~/components/pages/inbox'))
const SettingsPage = lazy(() => import('~/components/pages/settings'))
const AboutPage = lazy(() => import('~/components/pages/about'))
const NotFoundPage = lazy(() => import('~/components/pages/404'))
const ChannelPage = lazy(() => import('~/components/pages/channel'))
const ConversationPage = lazy(() => import('~/components/pages/conversation'))
const SearchPage = lazy(() => import('~/components/pages/search'))
const MiniAppsPage = lazy(() => import('~/components/pages/mini-apps'))
// const SearchPage = lazy(() => import('~/components/pages/search'))
// const ChannelPage = lazy(() => import('~/components/pages/channel'))

export const meta: MetaFunction = () => {
  return [
    { title: "FC App - Warpcast SPA clone" },
    { name: "description", content: "Welcome to Remix (SPA Mode)!" },
    {
      property: "og:title",
      content: "FC App - Warpcast SPA clone",
    },
  ]; 
};


export default function Index() {
  
 
  const location = useLocation();

  const [page, setPage] = useState('home')
  const [feedInitial, setFeedInitial] = useState('home')
  const [pageData , setPageData] = useState('')
  const [additionalPageData, setAdditionalPageData] = useState('')
  const [profileUser, setProfileUser] = useState('')
  const [is404, setIs404] = useState(false)
  const { setRightSidebarVisible, isUserLoggedIn } = useMainStore()

  const { setNewDmsCount, setNewNotificationsCount, newDmsCount } = useNotifBadgeStore()

  const notificationInterval = useRef<NodeJS.Timeout | null>(null)

  const notifCheck = useCallback(async () => {
    getNotifsUnseen().then((data) => {
      setNewNotificationsCount(data.result.notificationsCount)
      if(data?.result?.inboxCount !== newDmsCount) {
        setNewDmsCount(data.result.inboxCount)
      }
      if(data.result.notificationsCount > 0) {
        addNotificationBadge()
      } else {
        removeNotificationBadge()
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isUserLoggedIn) {
      notifCheck()
      notificationInterval.current = setInterval(() => {
        notifCheck()
      }, 7000)
    } else {
      if (notificationInterval.current) {
        clearInterval(notificationInterval.current)
      }
    }
    return () => {
      if (notificationInterval.current) {
        clearInterval(notificationInterval.current)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserLoggedIn])

  const checkUserLooggedIn = useCallback(() => {
    if (!isUserLoggedIn) {
      setPage('home')
      setFeedInitial('trending')
      return false
    }
    return true
  }, [isUserLoggedIn])

  useEffect(() => {
    setIs404(false)
    setPageData('')
    if (location?.pathname === '/' || location?.pathname === '/home') {
      setPage('home')
      setFeedInitial('')
      setRightSidebarVisible(true)
    } else if (!location?.pathname?.startsWith('/~')) {      
        setPage('profile')
        const splits = location?.pathname?.split('/')
        const splitsLength = splits?.length
        const profileUser = splits[1]
        setProfileUser(profileUser)
        if(splitsLength === 2) {
          setPageData('casts')
        } else if (splitsLength === 3 && splits[2] === 'casts-and-replies') {
          setPageData('casts-and-replies')
        } else if (splitsLength === 3 && splits[2] === 'channels') {
          setPageData('channels')
        } else if (splitsLength === 3 && splits[2] === 'likes') {
          setPageData('likes')
        } else if (splitsLength === 3 && splits[2]?.startsWith('0x')){
          setPageData(splits[1])
          setAdditionalPageData(splits[2])
          setPage('conversations')
        } else {
          setIs404(true)
        }
      setRightSidebarVisible(true)
    } else if (location?.pathname?.startsWith('/~/channel/')) {
      setPage('channel')
      const splits = location?.pathname?.split('/')
      const channelId = splits[3]
      setPageData(channelId)
      setRightSidebarVisible(true)
    }else if (location?.pathname?.startsWith('/~/bookmarks')) {
      if(checkUserLooggedIn()) {
        setPage('bookmarks')
        setRightSidebarVisible(true)
      }
    } else if (location?.pathname?.startsWith('/~/explore')) {
      if(checkUserLooggedIn()) {
        const page = location?.pathname?.split('~/explore/')?.[1]?.replace('/', '') || ''
        setPage('explore')
        setPageData(page)
      }
      setRightSidebarVisible(true)
    } else if (location?.pathname?.startsWith('/~/notifications')) {
       if(checkUserLooggedIn()) {
        setPage('notifications')
        const page = location?.pathname?.split('~/notifications/')?.[1]?.replace('/', '') || ''
        setPageData(page)
      }
      setRightSidebarVisible(true)
    } else if (location?.pathname === '/~/mini-apps') {
      if(checkUserLooggedIn()) {
        setPage('mini-apps')
        setRightSidebarVisible(true)
      }
    } else if (location?.pathname.startsWith('/~/inbox')) {
      if(checkUserLooggedIn()) {
        setRightSidebarVisible(false)
        setPage('inbox')
      }
    } else if (location?.pathname?.startsWith('/~/search')) {
      setPage('search')
      // get query q from url use useSearchParams
      const searchParams = new URLSearchParams(location?.search)
      const q = searchParams.get('q') ?? ''
      const searchType = location?.pathname?.split('search/')[1].split('?')[0]
      setPageData(q)
      setAdditionalPageData(searchType ?? 'top')
      setRightSidebarVisible(true)
    }else if (location?.pathname?.startsWith('/~/settings')) {
      if(checkUserLooggedIn()) {
        setRightSidebarVisible(false)
        setPage('settings')
      }
    } else if( ['/~/trending', '/~/following', '/~/fc-oss', '/~/politics', '/~/cryptoleft'].includes(location?.pathname)) {
      setPage('home')
      setFeedInitial(location?.pathname?.split('/~/')[1])
      setRightSidebarVisible(true)
    } else if( location?.pathname === '/~/about') {
      setPage('about')
      setRightSidebarVisible(true)
    } else {
      setIs404(true)
      setRightSidebarVisible(true)
    }

  }, [location?.pathname, location, page, feedInitial, setRightSidebarVisible, isUserLoggedIn, checkUserLooggedIn]);

 
  return (
    <Shell noRightSidebar={is404}>
      <Suspense fallback={<HydrateFallback />}>
        {page === 'home' && !is404 ? <Main key={1} initialFeed={feedInitial} /> : null }
        {page === 'profile' && !is404  ? <ProfilePage key={2} profile={profileUser} startFeed={pageData} /> : null }
        { page === 'bookmarks' && !is404 ? <BookmarkPage key={3} /> : null }
        { page === 'explore' && !is404 ? <ExplorePage key={4} /> : null }
         { page === 'notifications' && !is404 ? <NotificationsPage key={5} page={pageData} /> : null }
         { page === 'inbox' && !is404  ? <InboxPage key={6}/> : null }
         {page === 'search' && !is404 ? <SearchPage key={7} query={pageData} searchType={additionalPageData} /> : null }
         { page === 'settings' && !is404  ? <SettingsPage key={8} /> : null }
         {page === 'channel' && !is404  ? <ChannelPage key={9} channelId={pageData} /> : null}
         { page === 'conversations' && !is404 ? <ConversationPage key={10} hash={additionalPageData} username={pageData} /> : null }
         {page === 'about' && !is404 ? <AboutPage key={11} /> : null}
         {page === 'mini-apps' && !is404 ? <MiniAppsPage key={12} /> : null}
        {is404 && <NotFoundPage key={11} />}
      </Suspense>
      <ComposeModal />
    </Shell>
  );
}
