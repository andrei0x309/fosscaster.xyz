'use client'

import {Img as Image} from 'react-image'
import { useEffect, useState, useCallback } from 'react'
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { ScrollArea } from "~/components/ui/scroll-area"
import { useMainStore } from "~/store/main"
import { getBookmarkedCasts } from "~/lib/api"
import type {TBookmarkedCasts } from "~/types/wc-bookmarked-casts"
// import InfiniteScroll from "~/components/ui/extension/infinite-scroll"
import { ComposeModal } from "~/components/functional/modals/compose-cast"
import { Post } from "~/components/blocks/post"
import { Button } from "~/components/ui/button"
// import { Card } from "~/components/ui/card"
// import { MoreHorizontal, MessageSquare, Repeat2, Heart, Bookmark, Share2 } from 'lucide-react'
import type { TWCUserByUsername } from "~/types/wc-user-by-username"
import type { TAllFidCasts } from "~/types/wc-all-fid-casts"
import { SimpleLoader } from "~/components/atomic/simple-loader"
import { formatNumber } from "~/lib/misc"
import { Card } from "~/components/ui/card"
import { MoreHorizontal, PenSquare, MessageSquare, Repeat2, Heart, LayoutGrid, Bookmark, Share2, ArrowLeft, Mail, Bell } from 'lucide-react'
import  InfiniteScroll from "~/components/ui/extension/infinte-scroll"
import { CastHeader } from "~/components/blocks/header/cast-header"


export function BookmarkPages({className = ''}: {className?: string}) {
  const { isUserLoggedIn, setConnectModalOpen, navigate  } = useMainStore()

  const [feed, setFeed] = useState({} as TBookmarkedCasts)
  const [isComposeModalOpen, setComposeModalOpen] = useState(false)
  const [feedLoading, setFeedLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(false)
  const [isNoContent, setIsNoContent] = useState(false)

  const fetchFeed = useCallback(async () => {
    setFeedLoading(true)
    setIsNoContent(false)  
    const newFeed = await getBookmarkedCasts()
    if (!newFeed?.result?.bookmarks.length) {
      setIsNoContent(true)
      setHasMore(false)
      setFeedLoading(false)
      return
    }
    // const filtred = newFeed.result.bookmarks.filter((item) => item.hash.startsWith('0x2930383c'))
    // newFeed.result.bookmarks = filtred
    setFeed(newFeed)
    setFeedLoading(false)
    setIsInitialLoad(true)
  
  }, [])

 
  useEffect(() => {
    fetchFeed()
  }, [fetchFeed])



  const loadMore = async () => {
    setFeedLoading(true)
    const cursor = feed?.next?.cursor
    if (!cursor) {
      setHasMore(false)
      setFeedLoading(false)
      return
    }
    const newFeed = await getBookmarkedCasts({cursor})
    if (!newFeed?.result?.bookmarks.length) {
      setHasMore(false)
      setFeedLoading(false)
      return
    }
    setFeed({
      result: {
        bookmarks: [...feed.result.bookmarks, ...newFeed.result.bookmarks],
      },
      next: newFeed.next,
    })
    setFeedLoading(false)
  }


  return (

    // <main className="h-full w-full shrink-0 justify-center sm:mr-4 sm:w-[540px] lg:w-[680px]">
    // <div className="h-full min-h-screen">
    //   <div className="sticky dark:bg-zinc-950 top-0 z-10 flex-col border-b-0 bg-app border-default h-14 sm:h-28 p-2">

      <main className={`h-full w-full shrink-0 justify-center sm:w-[540px] lg:w-[680px] ${className}`}>
        <div className="h-full min-h-screen">
        <CastHeader title='Bookmarks' hasBackButton={true} />
  

      
                {/* Feed */}
                <div className={`space-y-4 ${feedLoading ? 'opacity-50' : ''}`}>

      {[...(feed?.result?.bookmarks?.map(i => ({ cast: i})) ?? [])].map((item, i) => (
                <Post key={i} item={item} i={i} />
              ))}

        <InfiniteScroll hasMore={hasMore} isLoading={feedLoading} next={loadMore} threshold={1}>
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

 export default BookmarkPages