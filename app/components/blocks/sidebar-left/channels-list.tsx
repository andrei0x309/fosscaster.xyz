// TWCChannelInfo
import {
  FoldVertical,
  UnfoldVertical,
} from "lucide-react"
import { Button } from "~/components/ui/button"
import { useMainStore } from "~/store/main"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { useState, useEffect, useCallback } from "react"
import { getChannelInfo, getUserFollowingChannels } from "~/lib/api"
import type { TUserChannelFollows} from "~/types/wc-user-channel-follows"
import { ScrollArea } from "~/components/ui/scroll-area"


const defaultChannelsIds = [
    'fc-oss',
    'cryptoleft',
    'politics',
    'dev',
    'fc-devs',
    'farcasterunion',
    'no-channel',
    'random',
    'six'
]

export const ChannelsList = () =>  {
  const {
     isUserLoggedIn, mainUserData, navigate
    } = useMainStore()

    const [channels, setChannels] = useState([] as TUserChannelFollows['result']['channels'])
    const [recentChannels, setRecentChannels] = useState([] as TUserChannelFollows['result']['channels'])
    const [favChannels, setFavChannels] = useState([] as TUserChannelFollows['result']['channels'])
    const [loading, setLoading] = useState(true)
    const [isFavOpen, setIsFavOpen] = useState(true)
    const [isRecentOpen, setIsRecentOpen] = useState(true)
    const [isAllOpen, setIsAllOpen] = useState(true)
    const [wasAuthed, setWasAuthed] = useState(false)
    

    const loadChannels = useCallback(async () => {
        setLoading(true)
        if (!isUserLoggedIn || !mainUserData || !mainUserData.fid) {
            const channels = (await Promise.all(defaultChannelsIds.map(async (channelId) => {
                return await getChannelInfo(channelId)
            }))).map((channel) => channel.result.channel as TUserChannelFollows['result']['channels'][number])
            if(!wasAuthed) {
              setChannels(channels)
            }
        } else {
            setWasAuthed(true)
            const channels = await getUserFollowingChannels({fid: mainUserData.fid})
            const favChannels = channels.result.channels.filter((channel) => channel.viewerContext?.favoritePosition !== -1)
            const recentChannels = channels.result.channels.filter((channel) => channel.viewerContext?.activityRank !== undefined)
            setChannels(channels.result.channels)
            setFavChannels(favChannels)
            setRecentChannels(recentChannels)
        }
        setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUserLoggedIn, mainUserData?.username, wasAuthed])

    useEffect(() => {
      loadChannels()
    }, [loadChannels])
  
 

    return (
    <ScrollArea key={`ck-${isUserLoggedIn}-${mainUserData?.fid}`} className={`h-[30rem] max-h-screen ${loading ? 'pulse-with-blur': ''} `} >
    {recentChannels.length ? <>
      <div className="mt-4 font-semibold text-sm text-neutral-500 flex items-center justify-between">
        Recent
          {isRecentOpen ? 
          <FoldVertical className="w-4 h-4 ml-1 cursor-pointer hover:scale-110 mr-4" onClick={() => setIsRecentOpen(false)} /> : 
          <UnfoldVertical className="w-4 h-4 ml-1 cursor-pointer hover:scale-110 mr-4" onClick={() => setIsRecentOpen(true)} />}
      </div>
      {isRecentOpen ? recentChannels.map((channel) => (
        <Button key={channel.key} variant="ghost" className="justify-start text-sm w-full" onClick={() => navigate(`/~/channel/${channel.key}`)}>
          <Avatar className="w-5 h-5 mr-3">
          <AvatarImage src={channel.fastImageUrl} />
          <AvatarFallback>{channel.key}</AvatarFallback>
           </Avatar>
          {channel.key}
        </Button>
      )): null}
      </> : null} 

      {favChannels.length ? <>
      <div className="mt-4 font-semibold text-sm text-neutral-500 flex items-center justify-between">
        Favorites

        {isFavOpen ? 
          <FoldVertical className="w-4 h-4 ml-1 cursor-pointer hover:scale-110 mr-4" onClick={() => setIsFavOpen(false)} /> : 
          <UnfoldVertical className="w-4 h-4 ml-1 cursor-pointer hover:scale-110 mr-4" onClick={() => setIsFavOpen(true)} />}
      </div>
      {isFavOpen ? favChannels.map((channel) => (
        <Button key={channel.key} variant="ghost" className="justify-start text-sm w-full" onClick={() => navigate(`/~/channel/${channel.key}`)}>
          <Avatar className="w-5 h-5 mr-3">
          <AvatarImage src={channel.fastImageUrl} />
          <AvatarFallback>{channel.key}</AvatarFallback>
           </Avatar>
          {channel.key}
        </Button>
      )): null}
      </> : null}

      {channels.length ? <>
      <div className="mt-4 font-semibold text-sm text-neutral-500 flex items-center justify-between">
        {isUserLoggedIn ? 'All' : 'Channels'}

        {isAllOpen ? 
          <FoldVertical className="w-4 h-4 ml-1 cursor-pointer hover:scale-110 mr-4" onClick={() => setIsAllOpen(false)} /> : 
          <UnfoldVertical className="w-4 h-4 ml-1 cursor-pointer hover:scale-110 mr-4" onClick={() => setIsAllOpen(true)} />}

      </div>
      {isAllOpen ? channels.map((channel) => (
        <Button key={channel.key} variant="ghost" className="justify-start text-sm w-full" onClick={() => navigate(`/~/channel/${channel.key}`)}>
          <Avatar className="w-5 h-5 mr-3">
          <AvatarImage src={channel.fastImageUrl} />
          <AvatarFallback>{channel.key}</AvatarFallback>
           </Avatar>
          {channel.key}
        </Button>
      )): null}
      </>: null}
    </ScrollArea>
    )
}
