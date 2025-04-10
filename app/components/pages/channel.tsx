import { ArrowLeft, Bell, MoreHorizontal, Share2, MessageSquare, Repeat2, Heart, Bookmark, SquareStack, Send, CheckCheck } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { CastHeader } from "~/components/blocks/header/cast-header"



import { useEffect, useState, useCallback, useRef } from 'react'
import { PenSquare } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { useMainStore } from "~/store/main"
import { 
    getFeed, 
    getChannelInfo,
    getChannelFollowersYouKnow 
} from "~/lib/api"
import  InfiniteScroll from "~/components/ui/extension/infinte-scroll"
import { ComposeModal } from "~/components/functional/modals/compose-cast"
import { Post } from "~/components/blocks/post"
import { SimpleLoader } from '../atomic/simple-loader'
import { useImmer } from "use-immer"
import { formatNumber } from "~/lib/misc"

import type { TWcFeedItems } from "~/types/wc-feed-items"
import type { TWCChannelInfo } from "~/types/wc-channel-info"
import type { TWCCNFollowersYouKnow } from "~/types/wc-channel-followers-you-know"



export default function ChannelPage({
    channelId,
    className = ''
}: {
    channelId: string
    className?: string
}) {

    const { isUserLoggedIn, setConnectModalOpen, navigate  } = useMainStore()
    const [feedLoading, setFeedLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [isInitialLoad, setIsInitialLoad] = useState(false)
    const [isNoContent, setIsNoContent] = useState(false)
    const [followersYouKnow, setFollowersYouKnow] = useImmer({} as TWCCNFollowersYouKnow)
    const [wasCopyCalled, setWasCopyCalled] = useState(false)

    const [feed, setFeed] = useImmer({ result: {} as TWcFeedItems})
    const [channelInfo, setChannelInfo] = useImmer({} as TWCChannelInfo)
    
    const fetchChannelInfo = useCallback(async (channelId: string) => {
        if(!channelId) return
        const channelInfo = await getChannelInfo(channelId)
        setChannelInfo(channelInfo)
    } , [setChannelInfo])

    const fetchFollowersYouKnow = useCallback(async (channelId: string) => {
      if(!isUserLoggedIn) return
      if(!channelId) return
        const followersYouKnow = await getChannelFollowersYouKnow({
            channelKey: channelId
        })
        setFollowersYouKnow(followersYouKnow)
    }, [isUserLoggedIn, setFollowersYouKnow])

    const fetchFeed = useCallback(async (localCurrentFeed: string) => {
        const feed = await getFeed({ feed: localCurrentFeed })
        if (!feed?.result?.items?.length) {
          setIsNoContent(true)
          setHasMore(false)
          setFeedLoading(false)
          return
        }
        setFeed(feed)
        if(!isInitialLoad) {
          setIsInitialLoad(true)
        }
      }, [setFeedLoading, setFeed, setIsInitialLoad, isInitialLoad])

      const loadMore = async () => {
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

    useEffect(() => {
        fetchChannelInfo(channelId)
        fetchFeed(channelId)
        if(isUserLoggedIn) {
            fetchFollowersYouKnow(channelId)
        }
    }, [channelId, fetchChannelInfo, fetchFeed, fetchFollowersYouKnow, isUserLoggedIn])

    const shareToClipboard = async () => {
        await navigator.clipboard.writeText(window.location.href)
        setWasCopyCalled(true)
        setTimeout(() => {
            setWasCopyCalled(false)
        }, 2500)
    }

    // useEffect(() => {
    //     console.log('channelId', channelId)
    //     console.log('channelInfo', channelInfo)
    //     console.log('feed', feed)
    //     console.log('followersYouKnow', followersYouKnow)
    // }, [channelId, channelInfo, feed, followersYouKnow])


  return (
    <main className={`h-full w-full shrink-0 justify-center sm:w-[540px] lg:w-[680px] ${className}`}>
    <div className="h-full min-h-screen">
      <div className="sticky bg-white dark:bg-neutral-950 top-0 z-10 flex-col border-b-0 bg-app border-default h-26 p-2">

     </div>
        
      {/* Profile Section    style={{ backgroundImage: `url('${channelInfo?.result?.channel?.headerImageUrl}')`}} */}
      <div className="relative">
      <div className={`h-52 bg-contain dark:from-neutral-800 dark:to-neutral-900 bg-gradient-to-b from-neutral-200 to-neutral-400`}>
      {channelInfo?.result?.channel?.headerImageUrl ? <img loading="lazy" src={channelInfo?.result?.channel?.headerImageUrl} alt={channelInfo?.result?.channel?.name} className="aspect-[3/1] h-full w-full object-cover object-center" /> : null}
        </div>
        <div className="absolute bottom-0 left-4 transform translate-y-1/2">
          <Avatar className="w-24 h-24 border-4 border-[#1c1c1c]">
            
            <AvatarImage src={channelInfo?.result?.channel?.fastImageUrl ??channelInfo?.result?.channel?.imageUrl} alt="Channel picture" />
            
            <AvatarFallback className="text-[1.4rem]" >CN</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="mt-16 px-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{ channelInfo?.result?.channel?.name ?? 'NA'  }</h2>
            <p className="text-gray-400">/{ channelInfo?.result?.channel?.key ?? 'NA' }</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{formatNumber(channelInfo?.result?.channel?.memberCount ?? 0)} <span className="text-gray-400 text-sm">members</span></p>
            <p className="font-semibold">{formatNumber(channelInfo?.result?.channel?.followerCount ?? 0)} <span className="text-gray-400 text-sm">followers</span></p>
          </div>
        </div>
        <p className="mt-2 text-gray-500 dark:text-gray-300"></p>
        <div className="flex items-center mt-2 space-x-2">
            
         {followersYouKnow?.result?.totalCount > 0 ?  (<><div className="flex -space-x-2"> 
          {followersYouKnow.result.users.map((user, index) => (
            <Avatar key={index} className={`w-6 h-6`}>
              <AvatarImage src={user.pfp.url} alt={user.username} />
              <AvatarFallback>{user.username}</AvatarFallback>
            </Avatar>
          ))}
          </div>
          <span className="text-sm text-gray-400">{followersYouKnow?.result?.totalCount} mutual followers</span>
          </>
        ): null}
 
          
        </div>
        <div className="flex space-x-4 mt-4">
          <Button variant="outline" className="flex-1">
            <SquareStack className="w-4 h-4 mr-2" />
            Member
          </Button>
          {!wasCopyCalled ? <Button variant="outline" className="flex-1" onClick={ shareToClipboard }>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
            : <Button variant="outline" className="flex-1" >
                <CheckCheck className="w-4 h-4 mr-2" />
                Copied!!!
                </Button>
            }
        </div>
      </div>

 
      <div>
        {!isInitialLoad && !isNoContent ? <SimpleLoader /> : null}

        { isInitialLoad ? [...(feed?.result?.items ?? [])].map((item, i) => (
                <Post key={i} item={item} i={i} />
              )) : null}
 
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