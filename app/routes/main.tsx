import type { MetaFunction } from "react-router";
import { Main } from "~/components/pages/main";
import { Shell } from "~/components/template/shell";
import { HydrateFallback } from "~/components/atomic/hydratation-fallback";
import { useMainStore } from "~/store/main";
import { lazy, Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from "react-router";
import { useNotifBadgeStore } from "~/store/notif-badge-store"
import { getNotifsUnseen } from '~/lib/api'
import { addNotificationBadge, removeNotificationBadge, debounce } from '~/lib/misc'
import { ComposeModal } from "~/components/functional/modals/compose-cast"
import { type scrollPageKey, useStoreScroll } from '~/store/scroll-restore'
import { LeftSidebar } from "~/components/template/left-sidebar"
import { RightSidebar } from "~/components/template/right-sidebar"
import { generateURLFCFrameEmbed } from '~/lib/mini-app'
import { Helmet } from "react-helmet";
import { useMetaStore } from "~/store/meta"


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
    { title: "Fosscaster.xyz - Farcaster Social Network" },
    { name: "description", content: "Farcaster Social Network FOSS Web client" },
    {
      property: "og:title",
      content: "Fosscaster.xyz - Farcaster Social Network",
    },
    {
      property: "og:description",
      content: "Farcaster Social Network FOSS Web client",
    },
    {
      property: "og:image",
      content: "https://fosscaster.xyz/hotlink-ok/og/default.webp",
    },
    {
      property: "og:url",
      content: window.location.href,
    },
    {
      property: "fc:frame",
      content: generateURLFCFrameEmbed({
        url: window.location.href,
        featureImage: "https://fosscaster.xyz/hotlink-ok/og/default.webp"
      })
    }

  ]; 
};

const pagesToPreserveScroll = ['home', 'channel', 'conversations', 'profile', "bookmark", ] as scrollPageKey[]

const defaultMeta = {
  title: 'Fosscaster.xyz - Farcaster Social Network',
  description: 'Farcaster Social Network FOSS Web client',
}

export default function Index() {
  
 
  const location = useLocation();

  const [page, setPage] = useState('home')
  const [feedInitial, setFeedInitial] = useState('home')
  const [pageData , setPageData] = useState('')
  const [additionalPageData, setAdditionalPageData] = useState('')
  const [profileUser, setProfileUser] = useState('')
  const [is404, setIs404] = useState(false)
  const { isUserLoggedIn, setIsMiniApp } = useMainStore()
  const [rightSidebarVisible, setRightSidebarVisible] = useState(false)

  const { setNewDmsCount, setNewNotificationsCount, newDmsCount } = useNotifBadgeStore()

  const { setMeta, description, title } = useMetaStore()

  const notificationInterval = useRef<NodeJS.Timeout | null>(null)
  
  const { scrollStore, setScrollStore } = useStoreScroll()


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
      const handleScroll = () => {
          if (pagesToPreserveScroll.includes(page as scrollPageKey) && window.scrollY > 0) {
              setScrollStore(page as scrollPageKey, window.scrollY);
          }
      };
      const debouncedHandleScroll = debounce(handleScroll, 100);
      window.addEventListener('scroll', debouncedHandleScroll);
      return () => {
          window.removeEventListener('scroll', debouncedHandleScroll);
      };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, scrollStore]);

  useEffect(() => {

      let currentPage = 'home' as scrollPageKey;
      let currentFeed = '';
      let currentPageData = '';
      let currentAdditionalPageData = '';
      let currentProfileUser = '';
      let currentIs404 = false;
      let currentRightSidebarVisible = true;

      setMeta(defaultMeta)

    if (location?.pathname === '/' || ['/~/trending', '/~/following', '/~/fc-oss', '/~/politics', '/~/cryptoleft', '/home'].includes(location?.pathname)) {
      currentPage = 'home'
      if(location?.pathname?.includes('~')) {
        currentFeed = location?.pathname?.split('/~/')[1]
      }
    } else if (!location?.pathname?.startsWith('/~')) {      
        currentPage = 'profile'
        const splits = location?.pathname?.split('/')
        const splitsLength = splits?.length
        const profileUser = splits[1]
        currentProfileUser = profileUser
        if(splitsLength === 2) {
          currentPageData = 'casts'
        } else if (splitsLength === 3 && splits[2] === 'casts-and-replies') {
          currentPageData = 'casts-and-replies'
        } else if (splitsLength === 3 && splits[2] === 'channels') {
          currentPageData = 'channels'
        } else if (splitsLength === 3 && splits[2] === 'likes') {
          currentPageData = 'likes'
        } else if (splitsLength === 3 && splits[2]?.startsWith('0x')){
          currentPageData = splits[1]
          currentAdditionalPageData = splits[2]
          currentPage = 'conversations'
        } else {
          currentIs404 = true
        }
        setMeta({
          title: `Profile ${currentProfileUser} - Fosscaster.xyz`,
          description: `View farcaster profile ${currentProfileUser} on Fosscaster.xyz`,
        })
    } else if (location?.pathname?.startsWith('/~/channel/')) {
      currentPage = 'channel'
      const splits = location?.pathname?.split('/')
      const channelId = splits[3]
      currentPageData = channelId
      setMeta({
        title: `Channel ${channelId} - Fosscaster.xyz`,
        description: `View channel ${channelId} on Fosscaster.xyz`,
      })
    }else if (location?.pathname?.startsWith('/~/bookmarks')) {
      if(checkUserLooggedIn()) {
        currentPage = 'bookmarks' as scrollPageKey
      }
    } else if (location?.pathname?.startsWith('/~/explore')) {
      if(checkUserLooggedIn()) {
        const page = location?.pathname?.split('~/explore/')?.[1]?.replace('/', '') || ''
        currentPage = 'explore' as scrollPageKey
        currentPageData = page
      }
      setMeta({
        title: `Explore - Fosscaster.xyz`,
        description: `Explore users and channels on Fosscaster.xyz`,
      })
    } else if (location?.pathname?.startsWith('/~/notifications')) {
       if(checkUserLooggedIn()) {
        currentPage = 'notifications' as scrollPageKey
        const page = location?.pathname?.split('~/notifications/')?.[1]?.replace('/', '') || ''
        currentPageData = page
      }
    } else if (location?.pathname === '/~/mini-apps') {
      if(checkUserLooggedIn()) {
        currentPage = 'mini-apps' as scrollPageKey
      }
    } else if (location?.pathname.startsWith('/~/inbox')) {
      if(checkUserLooggedIn()) {
        currentPage = 'inbox' as scrollPageKey
        currentRightSidebarVisible = false
      }
    } else if (location?.pathname?.startsWith('/~/search')) {
      currentPage = 'search' as scrollPageKey
      // get query q from url use useSearchParams
      const searchParams = new URLSearchParams(location?.search)
      const q = searchParams.get('q') ?? ''
      const searchType = location?.pathname?.split('search/')[1].split('?')[0]
      currentPageData = q
      currentAdditionalPageData = searchType ?? 'top'
    }else if (location?.pathname?.startsWith('/~/settings')) {
      if(checkUserLooggedIn()) {
        currentPage = 'settings' as scrollPageKey
        currentRightSidebarVisible = false
      }
    } else if( location?.pathname === '/~/about') {
      currentPage = 'about' as scrollPageKey
      setMeta({
        title: `About - Fosscaster.xyz`,
        description: `About Fosscaster.xyz`,
      })
    } else {
      currentIs404 = true
      setMeta({
        title: `404 - Fosscaster.xyz`,
        description: `404 - Fosscaster.xyz`,
      })
    }

    setPage(currentPage);
    setFeedInitial(currentFeed);
    setPageData(currentPageData);
    setAdditionalPageData(currentAdditionalPageData);
    setProfileUser(currentProfileUser);
    setIs404(currentIs404);
    setRightSidebarVisible(currentRightSidebarVisible);

      requestAnimationFrame(() => {
        if (pagesToPreserveScroll.includes(currentPage) && scrollStore[currentPage] !== undefined) {
            window.scrollTo(0, scrollStore[currentPage]);
        }
        else if (!is404 && !pagesToPreserveScroll.includes(currentPage)) {
             window.scrollTo(0, 0);
        }
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.pathname, location, page, feedInitial, setRightSidebarVisible, isUserLoggedIn, checkUserLooggedIn]);


  useEffect(() => {
    import('@farcaster/frame-sdk').then(async (module) => {
      const sdk = module.default
      const context = await sdk.context;
      sdk.actions.ready();
      if(context?.client?.clientFid) {
        setIsMiniApp(true)
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>

    <Shell>
      <Suspense fallback={<HydrateFallback />}>
       <LeftSidebar key={'left-sidebar'} />
       <main>
       <Main key={'home'} initialFeed={feedInitial} className={page === 'home' && !is404  ? 'block' :'hidden'}/>
       <ConversationPage key={'conversations'} hash={additionalPageData} username={pageData} className={page === 'conversations' && !is404  ? 'block' :'hidden'} />
       <ProfilePage key={'profile'} profile={profileUser} startFeed={pageData} className={page === 'profile' && !is404 ? 'block' :'hidden'} />
       <BookmarkPage key={'bookmarks'} className={page === 'bookmarks' && !is404 ? 'block' :'hidden'}  />
       <ChannelPage key={'channel'} channelId={pageData} className={page === 'channel' && !is404 ? 'block' :'hidden'}  /> 
        {page === 'explore' && !is404 ? <ExplorePage key={'explore'} /> : null }
         {page === 'notifications' && !is404 ? <NotificationsPage key={'notifications'} page={pageData} /> : null }
         {page === 'inbox' && !is404  ? <InboxPage key={'inbox'}/> : null }
         {page === 'search' && !is404 ? <SearchPage key={'search'} query={pageData} searchType={additionalPageData} /> : null }
         {page === 'settings' && !is404  ? <SettingsPage key={'settings'} /> : null }
         {page === 'about' && !is404 ? <AboutPage key={'about'} /> : null}
         {page === 'mini-apps' && !is404 ? <MiniAppsPage key={'miniapps'} /> : null}
         {is404 && <NotFoundPage key={'404'} />}

        </main>
        {rightSidebarVisible && <RightSidebar key={'right-sidebar'} /> }
      </Suspense>
      <ComposeModal />
    </Shell>
    </>
  );
}
