'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { PenSquare } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { useMainStore } from "~/store/main"
import { getFeed, isTokenSet, get } from "~/lib/api"
import type { TWcFeedItems } from "~/types/wc-feed-items"
import  InfiniteScroll from "~/components/ui/extension/infinte-scroll"
import { ComposeModal } from "~/components/functional/modals/compose-cast"
import { Post } from "~/components/blocks/post"
import { SimpleLoader } from '../atomic/simple-loader'
import { CastHeader } from '../blocks/header/cast-header'
import { useImmer } from "use-immer"


export function ConversationPage({ hash, className = '' }: { hash?: string, className?: string }) {
  const { isUserLoggedIn, setConnectModalOpen, navigate  } = useMainStore()

  const [feed, setFeed] = useState({ result: [] as unknown as TWcFeedItems})
  const [repliesFeeds, setRepliesFeeds] = useState([] as TWcFeedItems[])
  const [isComposeModalOpen, setComposeModalOpen] = useState(false)
  const [feedLoading, setFeedLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(false)
  const [currentFeed, setCurrentFeed] = useState('')
  const [isNoContent, setIsNoContent] = useState(false)



//   const fetchData = useCallback(async (localCurrentFeed: string) => {
//     const feed = await getFeed({ feed: localCurrentFeed })
//     if (!feed?.result?.items?.length) {
//       setIsNoContent(true)
//       setHasMore(false)
//       setFeedLoading(false)
//       return
//     }
//     setFeed(feed)
//     if(!isInitialLoad) {
//       setIsInitialLoad(true)
//     }
//   }, [setFeedLoading, setFeed, setIsInitialLoad, isInitialLoad])

//   useEffect(() => {
//     let localCurrentFeed = ''
//     const isSetToken = isTokenSet()
//     console.log('isUserLoggedIn', isUserLoggedIn)
//     console.log('isSetToken', isSetToken)
//     if (initialFeed) {
//       setCurrentFeed(initialFeed)
//       localCurrentFeed = initialFeed
//     } if(!isUserLoggedIn && !initialFeed) {
//       setCurrentFeed('trending')
//       localCurrentFeed = 'trending'
//     } else if(isUserLoggedIn && !initialFeed && isSetToken) {
//       setCurrentFeed('home')
//       localCurrentFeed = 'home'
//     }
//     fetchData(localCurrentFeed)
//   }, [isUserLoggedIn, initialFeed, fetchData])

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


  return (

      <main className={`h-full w-full shrink-0 justify-center sm:w-[540px] lg:w-[680px] ${className}`}>
        <div className="h-full min-h-screen">
        <div className="sticky bg-white dark:bg-neutral-950 top-0 z-10 flex-col border-b-0 bg-app border-default h-26 p-2">
        <CastHeader title="Conversation" />
        </div>
 
        <div>
        
        
        
        {!isInitialLoad && !isNoContent ? <SimpleLoader /> : null}

        { isInitialLoad ? [...(feed?.result?.items ?? [])].map((item, i) => (
                <Post key={i} item={item} i={i} />
              )) : null}
 
        <InfiniteScroll hasMore={hasMore} isLoading={feedLoading} next={() => {}} threshold={1}>
        {isInitialLoad && hasMore && <div className='my-2'><SimpleLoader /></div>}
        </InfiniteScroll>
        </div>

        {isNoContent && <div className="flex items-center justify-center h-full mt-8">
          <h2 className="text-lg font-semibold">Nothing to see here. 🌳</h2>
        </div>}
          
 
        </div>
      </main>

      
  )
}

export default ConversationPage
