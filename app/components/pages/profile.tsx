'use client'

import { Img as Image } from 'react-image'
import { useEffect, useState, useCallback } from 'react'
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { ScrollArea } from "~/components/ui/scroll-area"
import { useMainStore } from "~/store/main"
// import InfiniteScroll from "~/components/ui/extension/infinite-scroll"
import { Post } from "~/components/blocks/post"
import { Button } from "~/components/ui/button"
// import { Card } from "~/components/ui/card"
// import { MoreHorizontal, MessageSquare, Repeat2, Heart, Bookmark, Share2 } from 'lucide-react'
import type { TWCUserByUsername } from "~/types/wc-user-by-username"
import type { TAllFidCasts } from "~/types/wc-all-fid-casts"
import type { TUserChannelFollows } from "~/types/wc-user-channel-follows"
import { SimpleLoader } from "~/components/atomic/simple-loader"
import { formatNumber, wait } from "~/lib/misc"
import { Card } from "~/components/ui/card"
import { MoreHorizontal, PenSquare, MessageSquare, Repeat2, Heart, LayoutGrid, Bookmark, Share2, ArrowLeft, Mail, Bell } from 'lucide-react'
import  InfiniteScroll from "~/components/ui/extension/infinte-scroll"
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar"
import { 
  getUserByUsername,
  getAllFidCasts,
  getAllFidLikeCasts,
  getUserFollowingChannels,
  getProfileCasts,
  getFollowersYouKnow,
  userByFid
} from "~/lib/api"
import { useLocation } from "react-router";
import { CastHeader } from '~/components/blocks/header/cast-header'
import type { MetaFunction } from 'react-router'

export const meta: MetaFunction = ({ matches }) => {
    const parentMeta = matches.flatMap(
      (match) => match.meta ?? []
    );
    return [...parentMeta, { title: "Fosscaster.xyz - Profile" }];
};


const allowdFeedsLoggedIn = ['casts', 'likes', 'casts-and-replies', 'channels']
const allowdFeedsLoggedOut = ['casts', 'casts-and-replies']

export function ProfilePage({profile, startFeed, className = '' } : {profile: string, hash?: string, startFeed?: string, className?: string}) {
  const { isUserLoggedIn, setConnectModalOpen, mainUserData, navigate, setComposeModalOpen  } = useMainStore()

  const [feed, setFeed] = useState({} as TAllFidCasts)
  const [pageProfile, setPageProfile] = useState(profile)
  const [channels, setChannels] = useState({} as TUserChannelFollows)
  const [feedLoading, setFeedLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(false)
  const [user, setUser] = useState({} as TWCUserByUsername)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [selectedFeed, setSelectedFeed] = useState(startFeed ?? 'casts')
  const [isNoContent, setIsNoContent] = useState(false)
  const [loadMoreKey, setLoadMoreKey] = useState(0)
  const [wasFeedSelected, setWasFeedSelected] = useState(false)
  const [isFollowingYou, setIsFollowingYou] = useState(false)
  const [areYouFollowing, setAreYouFollowing] = useState(false)
  const [followersYouKnow, setFollowersYouKnow] = useState({} as Awaited<ReturnType<typeof getFollowersYouKnow>>)

  const location = useLocation()

  useEffect(() => {
    if (!location.pathname) return
    if(location.pathname.startsWith('/~/')) return
    const user = location.pathname.split('/')[1]
    if(user === pageProfile) return
    const feed = location.pathname.split('/')[2]
    setPageProfile(user)
    setSelectedFeed(feed)
    setLoadMoreKey(0)
    setIsInitialLoad(false)
    setFeed({} as TAllFidCasts)
    setChannels({} as TUserChannelFollows)
  }, [location, pageProfile])

  const fetchUser = useCallback(async () => {
    if(!pageProfile) return
    let user = null as unknown as TWCUserByUsername
    if(pageProfile.startsWith('!')) {
      user =  (await userByFid(pageProfile.replace('!', '')))?.result as TWCUserByUsername

    } else {
      user =  (await getUserByUsername(pageProfile))?.result as TWCUserByUsername
    }

    getFollowersYouKnow({fid: user.user.fid}).then(res => {
      setFollowersYouKnow(res)
    })

    if(!user) {
      navigate('/~/error/err-usr-001')
      return
    }
    setUser(user)
    setIsFollowingYou(user?.user?.viewerContext?.followedBy ?? false)
    setAreYouFollowing(user?.user?.viewerContext?.following ?? false)

    setIsOwnProfile(Number(user.user.fid) === Number(mainUserData?.fid))
  }, [pageProfile, mainUserData?.fid, navigate])

  const doFeedLoading = () => {
    setFeedLoading(true)
    setIsNoContent(false)
    setHasMore(true)
    setWasFeedSelected(false)
  }

  const doSelectFeed = ({ feed, isFeed = true, feedResult, channelsResult}:
   {feed: string, isFeed?: boolean, feedResult?: TAllFidCasts, channelsResult?: TUserChannelFollows}) => {
    setSelectedFeed(feed)
    setFeedLoading(false)
    setIsInitialLoad(true)
    setWasFeedSelected(isFeed)
    if(feedResult) {
      feedResult?.next?.cursor ? setHasMore(true) : setHasMore(false)
      feedResult?.result?.casts?.length ? setIsNoContent(false) : setIsNoContent(true)
    }
    if(channelsResult) {
      channelsResult?.result?.channels?.length ? setIsNoContent(false) : setIsNoContent(true)
    }
  }

  const checkAndReturnSelectedFeed = (feed: string) => {
    if(isUserLoggedIn) {
      if(allowdFeedsLoggedIn.includes(feed)) {
        return feed
      } else {
        return 'casts'
      }
    } else {
      if(allowdFeedsLoggedOut.includes(feed)) {
        return feed
      } else {
        return 'casts'
      }
  }
}
    

  const fetchFeed = useCallback(async () => {
    if(!user?.user?.fid) return
    let isLoadMore = false
    if(loadMoreKey > 0) {
      isLoadMore = true
    } else {
      setFeed({} as TAllFidCasts)
      setChannels({} as TUserChannelFollows)
    }
    doFeedLoading()
    const currentSelectedFeed = checkAndReturnSelectedFeed(selectedFeed)
    if( currentSelectedFeed === 'casts') {
      const newFeed =  await getProfileCasts({fid: user.user.fid, cursor: isLoadMore ? feed?.next?.cursor : undefined})
      setFeed((prev) => ({
        result: {
          casts: [...(prev.result?.casts ?? []), ...(newFeed.result.casts ?? [])]
        },
        next: newFeed.next
      }))
      doSelectFeed({feed: 'casts', feedResult: newFeed})
    } else if (currentSelectedFeed === 'likes') {
      const newFeed = await getAllFidLikeCasts({fid: user.user.fid, cursor: isLoadMore ? feed?.next?.cursor : undefined})
      setFeed((prev) => ({
        result: {
          casts: [...(prev.result?.casts ?? []), ...(newFeed.result.casts ?? [])]
        },
        next: newFeed.next
      }))
      doSelectFeed({feed: 'likes', feedResult: newFeed})
    } else if (currentSelectedFeed === 'casts-and-replies') {
      const newFeed = await getAllFidCasts({fid: user.user.fid})
      setFeed((prev) => ({
        result: {
          casts: [...(prev.result?.casts ?? []), ...(newFeed.result.casts ?? [])]
        },
        next: newFeed.next
      }))
      doSelectFeed({feed: 'casts-and-replies', feedResult: newFeed})
    } else if (currentSelectedFeed === 'channels') {
      if(!user.user.fid) return
      const channels = await getUserFollowingChannels({fid: user.user.fid, forComposer: false, limit:50})
      setChannels(channels)
      doSelectFeed({feed: 'channels', isFeed: false, channelsResult: channels})
    }

    

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user?.fid, selectedFeed, loadMoreKey])

  const isFeed  = (feed: string) => {
    return feed === 'casts' || feed === 'likes' || feed === 'casts-and-replies'
  }

  const dmUser = async () => {
    const dmLink = `${mainUserData?.fid}-${user?.user?.fid}`
    navigate(`/~/inbox/${dmLink}`)
  }
 
  useEffect(() => {
    fetchUser()
    fetchFeed()
  }, [fetchFeed, fetchUser, mainUserData?.fid, pageProfile, selectedFeed, startFeed])

  const handleFeedChange = async (feed: string) => {
    if (feed === selectedFeed) return
    if (feedLoading) return
    if(feed === 'casts') {
      window.history.replaceState(null, '', `/${pageProfile}`)
    } else {
      window.history.replaceState(null, '', `/${pageProfile}/${feed}`)
    }
    setLoadMoreKey(0)
    setIsInitialLoad(false)
    setSelectedFeed(feed)
  }

  const loadMore = async () => {
    if(feedLoading) return
    if(!hasMore) return
    const cursor = feed?.next?.cursor
    if(!cursor) return
    setLoadMoreKey(loadMoreKey + 1)
  }

  const doUnfollow = async () => {

  }

  const doFollow = async () => {

  }
 
  return (
    // <main className="h-full w-full shrink-0 justify-center sm:mr-4 sm:w-[540px] lg:w-[680px]">
    // <div className="h-full min-h-screen">
    //   <div className="sticky dark:bg-zinc-950 top-0 z-10 flex-col border-b-0 bg-app border-default h-14 sm:h-28 p-2">

    (<main className={`h-full w-full shrink-0 justify-center lg:w-[680px] ${className}`}>
      <div className="h-full min-h-screen">
      <CastHeader title={`@${user?.user?.username ?? ''}`} hasBackButton={true} />
     {/* Profile */}
  {!user?.user?.fid && <SimpleLoader />}
  {user?.user?.fid && (
  <><div className="px-4 pt-4">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-center justify-between mb-4">
                            
                        <div className="flex items-center space-x-3 mb-2">
                        <Image
                                    src={user?.user?.pfp?.url ?? "/placeholder.svg"}
                                    alt="Profile picture"
                                    width={64}
                                    height={64}
                                    className="rounded-full w-16 h-16 object-cover" />
            <div>
              <h1 className="text-xl font-bold items-center inline-block">
              {user?.user?.displayName}
              </h1>                  
              {isFollowingYou && <span className="text-neutral-400 text-sm ml-2 inline-block">Follows you</span>}

              <p className="text-neutral-400">@{user?.user?.username}</p>
              </div>
          </div>
                          
                            <div className="flex space-x-2">
                            {isOwnProfile && (
                                <Button variant="outline" className="text-red-500 border-red-500" onClick={() => navigate('/~/settings')}>
                                    Edit Profile
                                </Button>
                            )}
                            {!isOwnProfile && (
                                      <>
                                       <Button onClick={dmUser} variant="ghost" size="icon">
                                          <Mail className="h-5 w-5" />
                                        </Button>
                                        {/*
                                        // implement later
                                        <Button variant="ghost" size="icon">
                                          <Bell className="h-5 w-5" />
                                        </Button> */}
                                      </>
                              )}

                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                           

                        <p className="mb-2 break-words dark:text-neutral-300 text-neutral-600">
                            {user?.user?.profile?.bio?.text}
                        </p>

                        <div className="flex space-x-4 mb-4">
                            <span><strong>{formatNumber(Number(user?.user?.followingCount), 0)}</strong> Following</span>
                            <span><strong>{formatNumber(Number(user?.user?.followerCount), 0)}</strong> Followers</span>
                        </div>


                        <div className="flex space-x-4 mb-4">
                        {!isOwnProfile && (
                          <>
                          { areYouFollowing && <Button variant="outline" onClick={doUnfollow}>Unfollow</Button> }
                          { !areYouFollowing && <Button variant="outline" onClick={doFollow}>Follow</Button> }
                          </>
                        )}
                      </div>
                      
       {isUserLoggedIn && !isOwnProfile && followersYouKnow?.result?.totalCount ? (
        <>
       <div className="flex items-center space-x-2 mb-4">
        <div className="flex -space-x-2">
          { followersYouKnow.result?.users.map((user, index) => (
            <Image
              key={index}
              src={user.pfp?.url ?? "/placeholder.svg"}
              alt={`User ${index + 1}`}
              className="rounded-full border-2 border-[#1c1c24] w-10 h-10 object-cover"
            />
          ))}
        </div>
        <p className="text-sm text-neutral-400">
          Followed by&nbsp;
          {followersYouKnow.result?.users.map((user, index) => (
            <>
            <span className='font-bold cursor-pointer hover:underline' key={index} aria-disabled="true" onClick={() => navigate(`/~${user.username}`)} role='button' onKeyDown={() => {}}>
              {user.username}
            </span>
            <span>&nbsp;</span>
            </>
          ))}
           and {followersYouKnow?.result?.totalCount} others you know
        </p>
      </div>
      </>
      ): null}

      <div className="flex space-x-4 mb-6 border-b pb-2 border-neutral-700">
        <Button variant="ghost" className={`text-neutral-400 ${selectedFeed === 'casts' ? 'bg-accent text-accent-foreground' : ''}`} onClick={() => handleFeedChange('casts')}>Casts</Button>
        <Button variant="ghost" className={`text-neutral-400 ${selectedFeed === 'casts-and-replies' ? 'bg-accent text-accent-foreground' : ''}`} onClick={() => handleFeedChange('casts-and-replies')}>Casts + Replies</Button>
        {isUserLoggedIn ?
        <>
        <Button variant="ghost" className={`text-neutral-400 ${selectedFeed === 'likes' ? 'bg-accent text-accent-foreground' : ''}`} onClick={() => handleFeedChange('likes')}>Likes</Button>
        {/* <Button variant="ghost" className={`text-neutral-400 ${selectedFeed === 'channels' ? 'bg-accent text-accent-foreground' : ''}`} onClick={() => handleFeedChange('channels')}>Channels</Button> */}
        </> : null}
      </div>


        </div> 
                
                
         </div> 

        </>
      )}
  
{isNoContent && <div className="flex items-center justify-center h-full mt-8">
  <h2 className="text-lg font-semibold">Nothing to see here. 🌳</h2>
</div>}

{feedLoading && <SimpleLoader />}

{/* Feed */}
{isFeed(selectedFeed)  &&  <div className={`${feedLoading ? 'opacity-50' : ''}`}>

{[...(feed?.result?.casts ?? [])].map((item, i) => (
        <Post key={i} item={{cast: item}} />
      ))}

<InfiniteScroll hasMore={hasMore} isLoading={feedLoading} next={loadMore} threshold={0.3}>
{isInitialLoad && hasMore && <div className='my-2'><SimpleLoader /></div>}
</InfiniteScroll>

</div>
}

        {/* TEST Feed */}
        {/* <div>
    {[...(testFeed?.result?.items ?? [])].map((item, i) => (
              <Post key={i} item={item} />
            ))}

      {!isInitialLoad && !isNoContent && <SimpleLoader />}

      <InfiniteScroll hasMore={hasMore} isLoading={feedLoading} next={loadMore} threshold={0.3}>
      {isInitialLoad && hasMore && <div className='my-2'><SimpleLoader /></div>}
      </InfiniteScroll>
      </div> */}

{selectedFeed === 'channels' && <div className="flex space-x-4 mb-6">

  <ul className="divide-y dark:divide-neutral-800 divide-neutral-300">
  {channels?.result?.channels.map((channel) => (
    <li key={channel.key} className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={channel.fastImageUrl ?? channel.imageUrl} alt={channel.name} className="w-12 h-12 object-fill" />
            <AvatarFallback>{channel.name}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">{channel.name}</h2>
            <p className="text-sm text-neutral-400">/{channel.key} · 👥 {channel.memberCount}</p>
            <p className="mt-1 text-sm text-neutral-300">{channel.description}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="mt-1">
          Following
        </Button>
      </div>
    </li>
  ))}
</ul>

  </div>}



      </div>
    </main>)
  );
}

export default ProfilePage
 
// export default function ProfilePage2() {
//   return (
//     <div className="bg-[#1c1c24] text-white min-h-screen p-4">
//       <div className="max-w-2xl mx-auto">
//         <div className="flex items-center justify-between mb-4">
//           <Button variant="ghost" size="icon">
//             <ArrowLeft className="h-6 w-6" />
//           </Button>
//           <Button className="bg-purple-600 hover:bg-purple-700">
//             Cast
//           </Button>
//         </div>

//         <div className="flex items-start justify-between mb-4">
//           <div className="flex-1">

//             <p className="mb-2">
//               frames, frames, frames /bleu bleuonbase.twitter
//             </p>
//             <div className="flex space-x-4 mb-4">
//               <span><strong>2K</strong> <span className="text-neutral-400">Following</span></span>
//               <span><strong>21K</strong> <span className="text-neutral-400">Followers</span></span>
//             </div>
//           </div>
//           <div className="flex space-x-2">
//             <Button variant="ghost" size="icon">
//               <Mail className="h-5 w-5" />
//             </Button>
//             <Button variant="ghost" size="icon">
//               <Bell className="h-5 w-5" />
//             </Button>
//             <Button variant="ghost" size="icon">
//               <MoreHorizontal className="h-5 w-5" />
//             </Button>
//           </div>
//         </div>
        
//         <div className="flex space-x-4 mb-4">
//           <Button variant="outline" className="flex-1">Unfollow</Button>
//           <Button variant="outline" className="flex-1">
//             <span className="mr-2">$</span> Pay
//           </Button>
//         </div>

//         <div className="flex items-center space-x-2 mb-4">
//           <div className="flex -space-x-2">
//             <Image src="/placeholder.svg" alt="User 1" width={24} height={24} className="rounded-full border-2 border-[#1c1c24]" />
//             <Image src="/placeholder.svg" alt="User 2" width={24} height={24} className="rounded-full border-2 border-[#1c1c24]" />
//             <Image src="/placeholder.svg" alt="User 3" width={24} height={24} className="rounded-full border-2 border-[#1c1c24]" />
//           </div>
//           <p className="text-sm text-neutral-400">
//             Followed by @horsefacts.eth, @blankspace, @downshift.eth and 213 others you know
//           </p>
//         </div>
        
//         <div className="flex space-x-4 mb-6 border-b border-neutral-700">
//           <Button variant="ghost" className="text-white">Casts</Button>
//           <Button variant="ghost" className="text-neutral-400">Casts + Replies</Button>
//           <Button variant="ghost" className="text-neutral-400">Likes</Button>
//           <Button variant="ghost" className="text-neutral-400">Channels</Button>
//         </div>
        
//         <div className="space-y-4">
//           <Card className="bg-[#25252d] p-4">
//             <div className="flex space-x-3">
//               <Image
//                 src="/placeholder.svg"
//                 alt="Profile picture"
//                 width={48}
//                 height={48}
//                 className="rounded-full"
//               />
//               <div className="flex-1">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <span className="font-bold">agusti</span>
//                     <span className="text-neutral-400 ml-2">@bleu.eth · 25m</span>
//                   </div>
//                   <Button variant="ghost" size="icon">
//                     <MoreHorizontal className="h-4 w-4" />
//                   </Button>
//                 </div>
//                 <p className="mt-2">
//                   I dont use x much, but if i follow u here i would like to follow you there
//                   <br />
//                   just saw <span className="text-purple-400">@padenfool.eth</span> and <span className="text-purple-400">@yes2crypto.eth</span> on replies and followed
//                   <br />
//                   who else im misssing?
//                   <br />
//                   whos making an app to autofollow on twitta and viceversa or smt if you do here
//                   <br />
//                   ...
//                 </p>
//                 <Button variant="link" className="text-purple-400 p-0 h-auto mt-1">Show more</Button>
//                 <Card className="bg-[#2f2f3a] p-3 mt-3">
//                   <p className="font-bold">agusti - bleu.wtf @bleuonbase</p>
//                   <p>building $bleu le @bleuelefant meme coin on @base</p>
//                   <p>https://t.co/ZW8fKNbw1q https://t.co/0lETjoVmaD 🐘 ai artist</p>
//                   <p>blockchain connoisseur</p>
//                   <p>dev's not french</p>
//                 </Card>
//                 <div className="flex justify-between mt-4 text-neutral-400">
//                   <Button variant="ghost" size="icon"><MessageSquare className="h-4 w-4" /></Button>
//                   <Button variant="ghost" size="icon"><Repeat2 className="h-4 w-4" /></Button>
//                   <Button variant="ghost" size="icon"><Heart className="h-4 w-4" /></Button>
//                   <Button variant="ghost" size="icon"><LayoutGrid className="h-4 w-4" /></Button>
//                   <Button variant="ghost" size="icon"><Bookmark className="h-4 w-4" /></Button>
//                   <Button variant="ghost" size="icon"><Share2 className="h-4 w-4" /></Button>
//                 </div>
//                 <p className="text-neutral-400 text-sm mt-2">1 reply · 1 like · /someone-build</p>
//               </div>
//             </div>
//           </Card>

//           <Card className="bg-[#25252d] p-4">
//             <div className="flex space-x-3">
//               <Image
//                 src="/placeholder.svg"
//                 alt="Profile picture"
//                 width={48}
//                 height={48}
//                 className="rounded-full"
//               />
//               <div className="flex-1">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <span className="font-bold">agusti</span>
//                     <span className="text-neutral-400 ml-2">@bleu.eth · 1d</span>
//                   </div>
//                   <Button variant="ghost" size="icon">
//                     <MoreHorizontal className="h-4 w-4" />
//                   </Button>
//                 </div>
//                 <p className="mt-2">
//                   Anime is eating the world
//                   <br />
//                   - a16z
//                 </p>
//                 <Image
//                   src="/placeholder.svg"
//                   alt="Anime image"
//                   width={500}
//                   height={300}
//                   className="mt-4 rounded-lg"
//                 />
//                 <div className="flex justify-between mt-4 text-neutral-400">
//                   <Button variant="ghost" size="icon"><MessageSquare className="h-4 w-4" /></Button>
//                   <Button variant="ghost" size="icon"><Repeat2 className="h-4 w-4" /></Button>
//                   <Button variant="ghost" size="icon"><Heart className="h-4 w-4" /></Button>
//                   <Button variant="ghost" size="icon"><LayoutGrid className="h-4 w-4" /></Button>
//                   <Button variant="ghost" size="icon"><Bookmark className="h-4 w-4" /></Button>
//                   <Button variant="ghost" size="icon"><Share2 className="h-4 w-4" /></Button>
//                 </div>
//               </div>
//             </div>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }