'use client'

import { useEffect, useState, useCallback } from 'react'
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { useMainStore } from "~/store/main"
import { getFeed, isTokenSet } from "~/lib/api"
import type { TWcFeedItems } from "~/types/wc-feed-items"
import  InfiniteScroll from "~/components/ui/extension/infinte-scroll"
import { Post } from "~/components/blocks/post"
import { SimpleLoader } from '../atomic/simple-loader'
import { CastHeader } from '../blocks/header/cast-header'

export function Main({ initialFeed, className = '' }: { initialFeed?: string, className?: string }) {
  const { isUserLoggedIn  } = useMainStore()

  const [feed, setFeed] = useState({ result: [] as unknown as TWcFeedItems})
  const [feedLoading, setFeedLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(false)
  const [currentFeed, setCurrentFeed] = useState(initialFeed)
  const [isNoContent, setIsNoContent] = useState(false)

  const fetchData = useCallback(async (localCurrentFeed: string) => {
    const feed = await getFeed({ feed: localCurrentFeed })
    if (!feed?.result?.items?.length) {
      setIsNoContent(true)
      setHasMore(false)
      return
    }
    setFeed(feed)
    if(!isInitialLoad) {
      setIsInitialLoad(true)
    }
    setFeedLoading(false)
  }, [setFeedLoading, setFeed, setIsInitialLoad, isInitialLoad])

  useEffect(() => {
    const isSetToken = isTokenSet()
    if (initialFeed) {
      setCurrentFeed(initialFeed)
    } else if(!isUserLoggedIn && !initialFeed) {
      setCurrentFeed('trending')
    } else if(isUserLoggedIn && !initialFeed && isSetToken) {
      setCurrentFeed('home')
    }
  }, [isUserLoggedIn, initialFeed])

  useEffect(() => {
    if (currentFeed) {
      if(currentFeed === 'home' && !isUserLoggedIn) {
        return
      }
      setFeedLoading(true)
      fetchData(currentFeed);
    }
  }, [currentFeed, fetchData, isUserLoggedIn]);

  const loadMore = async () => {
    console.log('load more')
    setFeedLoading(true)
    const excludedIds = feed?.result?.items?.map((item) => item.cast.hash) ?? []
    const newFeed = await getFeed({ feed: currentFeed, excludeItemIdPrefixes: excludedIds, olderThan: feed?.result?.items?.[feed.result.items.length - 1]?.cast?.timestamp })
    if (!newFeed.result.items.length) {
      setHasMore(false)
      setFeedLoading(false)
      return
    }
    setFeed((prev) => ({
      result: {
        ...prev.result,
        items: [...(prev.result?.items ?? []), ...(newFeed.result.items ?? [])]
      }
    }))
    setFeedLoading(false)
  }

 const handleFeedChange = (feed: string) => {
  setIsInitialLoad(false)
    if (feed === 'home') {
      window.history.pushState(null, '', `/`)
    } else {
      window.history.pushState(null, '', `/~/${feed}`)
    }
    setCurrentFeed(feed)
  }


  return (
      <div className={`h-full w-full shrink-0 justify-center sm:w-[540px] lg:w-[680px] ${className}`}>
        <div className="h-full min-h-screen">
          <div className="sticky bg-white dark:bg-neutral-950 top-0 z-10 flex-col border-b-0 bg-app border-default h-26 p-2">

           <CastHeader title='Home' className='mb-2' />

            { currentFeed && (<Tabs value={currentFeed} className="w-full">
              <TabsList className="w-full justify-start">
                {isUserLoggedIn && <TabsTrigger value="home" onClick={() => handleFeedChange('home')}>Home</TabsTrigger>}
                {isUserLoggedIn && <TabsTrigger value="following" onClick={() => handleFeedChange('following')}>Following</TabsTrigger> }
                {!isUserLoggedIn && <TabsTrigger value="politics" onClick={() => handleFeedChange('politics')}>Politics</TabsTrigger> }
                {!isUserLoggedIn && <TabsTrigger value="fc-oss" onClick={() => handleFeedChange('fc-oss')}>FC FOSS</TabsTrigger> }
                {!isUserLoggedIn && <TabsTrigger value="cryptoleft" onClick={() => handleFeedChange('cryptoleft')}>CryptoLeft</TabsTrigger> }
                <TabsTrigger value="trending" onClick={() => handleFeedChange('trending')}>Trending</TabsTrigger>
              </TabsList>
            </Tabs> ) }
          </div>
          
        {/* Feed */}
        <div>
        {!isInitialLoad && !isNoContent ? <SimpleLoader /> : null}

        { isInitialLoad ? [...(feed?.result?.items ?? [])].map((item, i) => (
                <Post key={i} item={item}  />
              )) : null}
 
        <InfiniteScroll hasMore={hasMore} isLoading={feedLoading} next={loadMore} threshold={0.3}>
        {isInitialLoad && hasMore && <div className='my-2'><SimpleLoader /></div>}
        </InfiniteScroll>
        </div>

        {isNoContent && <div className="flex items-center justify-center h-full mt-8">
          <h2 className="text-lg font-semibold">Nothing to see here. 🌳</h2>
        </div>}
          
 
        </div>
      </div>

      
  )
}

export default Main
