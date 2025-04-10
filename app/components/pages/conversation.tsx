import { useEffect, useState, useCallback, useRef } from 'react'
import { PenSquare } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { useMainStore } from "~/store/main"
import { getCastThread } from "~/lib/api"
import type { TWcUserThreadItems } from "~/types/wc-user-thread-casts"
import  InfiniteScroll from "~/components/ui/extension/infinte-scroll"
import { ComposeModal } from "~/components/functional/modals/compose-cast"
import { Post } from "~/components/blocks/post"
import { SimpleLoader } from '../atomic/simple-loader'
import { CastHeader } from '../blocks/header/cast-header'
import { useImmer } from "use-immer"
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar"
import { UserIcon } from '~/components/icons/user'
import { Item } from '~/types/wc-feed-items'


export function ConversationPage({ hash, username, className = '' }: { hash: string, username: string, className?: string }) {
  const { isUserLoggedIn, setConnectModalOpen, navigate, mainUserData, setComposeModalData, setComposeModalOpen  } = useMainStore()

  const [castReplies, setCastReplies] = useState([] as { cast: TWcUserThreadItems['result']['casts'][number]}[])
  const [mainCast, setMainCast] = useState({} as { cast: TWcUserThreadItems['result']['casts'][number]})
  const [feedLoading, setFeedLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(false)
  const [currentFeed, setCurrentFeed] = useState('')


  const acctionClasses = ['action']


  const fetchData = useCallback(async (castHash: string, user: string) => {
    setFeedLoading(true)
    const feed = await getCastThread({ castHash, username: user})
    
    const hasRootCast = feed.result.casts[0]?.castType === 'root_embed' || feed.result.casts[0]?.castType === 'root-embed'
    const sliceFrom = hasRootCast ? 1 : 0

    if (!feed.result.casts.length) {
      setHasMore(false)
      setFeedLoading(false)
      return
    }
    
    setMainCast({ cast: feed.result.casts[sliceFrom] })
    setCastReplies(feed.result.casts.slice(sliceFrom+1).map((cast) => ({ cast })))
    console.log('maincast', feed.result.casts[sliceFrom])
 
  }, [setFeedLoading, setIsInitialLoad, isInitialLoad])

  useEffect(() => {

    fetchData(hash, username)
 
  }, [

    hash, username, fetchData

  ])

//   const loadMore = async () => {
//     setFeedLoading(true)
//     const excludedIds = feed?.result?.items?.map((item) => item.cast.hash) ?? []
//     const newFeed = await getFeed({ feed: currentFeed, excludeItemIdPrefixes: excludedIds, olderThan: feed?.result?.items?.[feed.result.items.length - 1]?.cast?.timestamp })
//     if (!newFeed.result.items.length) {
//       setHasMore(false)
//       setFeedLoading(false)
//       return
//     }
//     setFeed((prev) => ({
//       result: {
//         ...prev.result,
//         items: [...(prev.result?.items ?? []), ...(newFeed.result.items ?? [])]
//       }
//     }))
//     setFeedLoading(false)
//   }

//  const handleFeedChange = (feed: string) => {
//   setIsInitialLoad(false)
//     if (feed === 'home') {
//       navigate('/')
//       return
//     }
//     navigate(`/~/${feed}`)
//   }

 const doReply = (e: Event) => {
    if(!isUserLoggedIn) {
      setConnectModalOpen(true)
      return
    }
    const target = e.target as HTMLElement
    const parents = [] as HTMLElement[]
    let parent = target.parentElement
    for (let i = 0; i < 3; i++) {
      if (parent) {
        parents.push(parent)
        parent = parent.parentElement
      }
    }

    if (parents.find((parent) => acctionClasses.some((className) => parent.classList.contains(className)))) return

    setComposeModalData({
      reply: mainCast as unknown as Item
    })
    setComposeModalOpen(true)
 }

  return (

      <main className={`h-full w-full shrink-0 justify-center sm:w-[540px] lg:w-[680px] ${className}`}>
        <div className="h-full min-h-screen">
        <div className="sticky bg-white dark:bg-neutral-950 top-0 z-10 flex-col border-b-0 bg-app border-default h-26 p-2">
        <CastHeader title="Conversation" />
        </div>
 
        <div>
        
        <Post item={mainCast} i={0} />
     <div className="flex items-center gap-3 border-0 border-t-1 border-b-2 border-neutral-400/50 hover:bg-slate-500/10" onClick={(e) => doReply(e)} aria-hidden>
      {mainUserData?.avatar ?
      <Avatar onClick={() => navigate(`/${mainUserData?.username}`)} className="h-10 w-10 cursor-pointer hover:opacity-70 m-3 action">
      <AvatarImage src={mainUserData?.avatar ?? '/placeholder.svg'} alt={`${mainUserData?.username} avatar`} />
      <AvatarFallback>{mainUserData?.username ?? 'Anon'}</AvatarFallback>
      </Avatar>
      : <UserIcon className='w-10 my-2 mx-4' />
     }
      <div className="flex-1">
      <div className="w-full bg-transparent outline-none text-gray-500 cursor-pointer h-full p-3">Cast your reply</div>
      </div>
      <Button className="bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2 m-3">Reply</Button>
    </div>
        
        {/* {!isInitialLoad && !isNoContent ? <SimpleLoader /> : null} */}

        { castReplies.length ? castReplies.map((item, i) => (
                <Post key={i} item={item} i={i} />
              )) : null}
 
        <InfiniteScroll hasMore={hasMore} isLoading={feedLoading} next={() => {}} threshold={1}>
        {isInitialLoad && hasMore && <div className='my-2'><SimpleLoader /></div>}
        </InfiniteScroll>
        </div>

        {/* {isNoContent && <div className="flex items-center justify-center h-full mt-8">
          <h2 className="text-lg font-semibold">Nothing to see here. 🌳</h2>
        </div>} */}
          
 
        </div>
      </main>

      
  )
}

export default ConversationPage
