'use client'

import { useEffect, useState, useCallback } from 'react'
import { getBookmarkedCasts } from "~/lib/api"
import type { TBookmarkedCasts } from "~/types/wc-bookmarked-casts"
import { Post } from "~/components/blocks/post"
import { SimpleLoader } from "~/components/atomic/simple-loader"
import InfiniteScroll from "~/components/ui/extension/infinte-scroll"
import { CastHeader } from "~/components/blocks/header/cast-header"
import { Helmet } from 'react-helmet'


export function BookmarkPages ({ className = '' }: { className?: string }) {

  const [feed, setFeed] = useState({} as TBookmarkedCasts)
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
    console.log('load more')
    setFeedLoading(true)
    const cursor = feed?.next?.cursor
    if (!cursor) {
      setHasMore(false)
      setFeedLoading(false)
      return
    }
    const newFeed = await getBookmarkedCasts({ cursor })
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
    <>
      <Helmet>
        <title>Fosscaster.xyz - Bookmarks</title>
        <meta name="description" content="Bookmarks - Fosscaster.xyz" />
      </Helmet>
      <div className={`h-full w-full shrink-0 justify-center sm:w-[540px] lg:w-[680px] ${className}`}>
        <div className="h-full min-h-screen">
          <CastHeader title='Bookmarks' hasBackButton={true} />

          {/* Feed */}
          <div className={`space-y-4 ${feedLoading ? 'opacity-50' : ''}`}>
            {/* {feedLoading && <div className='my-2'><SimpleLoader /></div>} */}

            {[...(feed?.result?.bookmarks?.map(i => ({ cast: i })) ?? [])].map((item, i) => (
              <Post key={i} item={item} />
            ))}

            <InfiniteScroll hasMore={hasMore} isLoading={feedLoading} next={loadMore} threshold={0.3}>
              {isInitialLoad && hasMore && <div className='my-2'><SimpleLoader /></div>}
            </InfiniteScroll>
          </div>

          {isNoContent && <div className="flex items-center justify-center h-full mt-8">
            <h2 className="text-lg font-semibold">Nothing to see here. 🌳</h2>
          </div>}


        </div>

      </div>

    </>
  )
}

export default BookmarkPages