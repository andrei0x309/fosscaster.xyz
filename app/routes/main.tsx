import type { MetaFunction } from "@remix-run/node";
import { Main } from "~/components/pages/main";
import { Shell } from "~/components/template/shell";
import { HydrateFallback } from "~/components/atomic/hydratation-fallback";
import { useMainStore } from "~/store/main";
import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { useLocation } from "@remix-run/react";
import { useNotifBadgeStore } from "~/store/notif-badge-store"
import { getNotifsUnseen } from '~/lib/api'
import { addNotificationBadge, removeNotificationBadge } from '~/lib/misc'

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
// const SearchPage = lazy(() => import('~/components/pages/search'))
// const ChannelPage = lazy(() => import('~/components/pages/channel'))

export const meta: MetaFunction = () => {
  return [
    { title: "FC App - Warpcast SPA clone" },
    { name: "description", content: "Welcome to Remix (SPA Mode)!" },
  ];
  // const { setConnectModalOpen  } = useMainStore()
 
};

const noRightSidebar = ['/~/inbox', '/~/settings']


export default function Index() {
  
 
  const location = useLocation();

  const [page, setPage] = useState('home')
  const [feedInitial, setFeedInitial] = useState('home')
  const [pageData , setPageData] = useState('')
  const [profileUser, setProfileUser] = useState('')
  const [is404, setIs404] = useState(false)
  const { setRightSidebarVisible, isUserLoggedIn } = useMainStore()

  const { setNewDmsCount, setNewNotificationsCount } = useNotifBadgeStore()

  const notificationInterval = useRef<NodeJS.Timeout | null>(null)


  useEffect(() => {
    if (isUserLoggedIn) {
      getNotifsUnseen().then((data) => {
        setNewNotificationsCount(data.result.notificationsCount)
        setNewDmsCount(data.result.inboxCount)
        if(data.result.notificationsCount > 0) {
          addNotificationBadge()
        } else {
          removeNotificationBadge()
        }
      })
      notificationInterval.current = setInterval(() => {
        getNotifsUnseen().then((data) => {
          setNewNotificationsCount(data.result.notificationsCount)
          setNewDmsCount(data.result.inboxCount)
          if(data.result.notificationsCount > 0) {
            addNotificationBadge()
          } else {
            removeNotificationBadge()
          }
        })
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
  }, [isUserLoggedIn, setNewNotificationsCount, setNewDmsCount])

  useEffect(() => {
    setIs404(false)
    setPageData('')
    if (location?.pathname === '/' || location?.pathname === '/home') {
      setPage('home')
      setFeedInitial('')
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
          setPageData(splits[2])
          setPage('conversations')
        } else {
          setIs404(true)
        }
    } else if (location?.pathname?.startsWith('/~/channel/')) {
      setPage('channel')
      const splits = location?.pathname?.split('/')
      const channelId = splits[3]
      setPageData(channelId)
    }else if (location?.pathname === '/~/bookmarks') {
      if(!isUserLoggedIn) {
        setPage('home')
        setFeedInitial('trending')
        return
      }
      setPage('bookmarks')
    } else if (location?.pathname === '/~/explore') {
      if(!isUserLoggedIn) {
        setPage('home')
        setFeedInitial('trending')
        return
      }
      setPage('explore')
    } else if (location?.pathname === '/~/notifications') {
      if(!isUserLoggedIn) {
        setPage('home')
        setFeedInitial('trending')
        return
      }
      setPage('notifications')
    } else if (location?.pathname === '/~/inbox') {
      if(!isUserLoggedIn) {
        setPage('home')
        setFeedInitial('trending')
        return
      }
      setRightSidebarVisible(false)
      setPage('inbox')
    } else if (location?.pathname === '/~/settings') {
      if(!isUserLoggedIn) {
        setPage('home')
        setFeedInitial('trending')
        return
      }
      setRightSidebarVisible(false)
      setPage('settings')
    } else if( location?.pathname === '/~/trending') {
      setPage('home')
      setFeedInitial('trending')
    } else if( location?.pathname === '/~/trending-frames') {
      setPage('home')
      setFeedInitial('trending-frames')
    } else if( location?.pathname === '/~/all-channels') {
      setPage('home')
      setFeedInitial('all-channels')
    } else if( location?.pathname === '/~/about') {
      setPage('about')
    } else {
      setIs404(true)
    }

    if(!noRightSidebar.includes(location?.pathname)) {
      setRightSidebarVisible(true)
    }

  }, [location?.pathname, location, page, feedInitial, setRightSidebarVisible, isUserLoggedIn]);

 
  return (
    <Shell noRightSidebar={is404}>
      <Suspense fallback={<HydrateFallback />}>
        {page === 'home' && !is404 ? <Main key={1} initialFeed={feedInitial} /> : null }
        {page === 'profile' && !is404  ? <ProfilePage key={2} profile={profileUser} startFeed={pageData} /> : null }
        { page === 'bookmarks' && !is404 ? <BookmarkPage key={3} /> : null }
        { page === 'explore' && !is404 ? <ExplorePage key={4} /> : null }
         { page === 'notifications' && !is404 ? <NotificationsPage key={5} /> : null }
         { page === 'inbox' && !is404  ? <InboxPage key={6} /> : null }
         { page === 'settings' && !is404  ? <SettingsPage key={7} /> : null }
         {page === 'channel' && !is404  ? <ChannelPage key={8} channelId={pageData} /> : null}
         { page === 'conversations' && !is404 ? <ConversationPage key={9} hash={pageData} /> : null }
         {page === 'about' && !is404 ? <AboutPage key={10} /> : null}
        {is404 && <NotFoundPage key={11} />}
      </Suspense>
    </Shell>
  );
}
