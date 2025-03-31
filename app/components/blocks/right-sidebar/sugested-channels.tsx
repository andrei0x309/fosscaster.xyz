
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import type { TWCDiscoverChannels } from "~/types/wc-discover-channels"

import { getDiscoverChannels } from '~/lib/api'

export const SuggestedChannels = () => {

    const [channels, setChannels] = useState([] as TWCDiscoverChannels['result']['channels'] )
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchChannels = async () => {
            const channels = await getDiscoverChannels()
            if (!channels.result.channels.length) {
                setLoading(false)
                return
            }
            if ( channels.result.channels.length > 3) {
                channels.result.channels = channels.result.channels.sort(() => Math.random() - 0.5).slice(0, 3)
            }
            setChannels(channels.result.channels)
            setLoading(false)
        }
        fetchChannels()
    }, [])


    return (
        <div className="container bg-gray-100 dark:dark:bg-zinc-900 rounded-lg p-4 mb-4">
        <h2 className="font-semibold mb-2">Suggested Channels</h2>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {channels?.length ? channels?.map((channel) => (
              <div key={channel.key} className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-2">
                    <AvatarImage src={channel.fastImageUrl} alt={channel.name} />
                    <AvatarFallback>{channel.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{channel.name}</div>
                    <div className="text-sm text-neutral-500 font-semibold">id: {channel.key}</div>
                    <div className="text-sm text-neutral-500 text-[0.9rem]">{channel.memberCount} members</div>
                    <div className="text-sm text-neutral-500 text-[0.9rem]">{channel.followerCount} followers</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Follow</Button>
              </div>
            )) : null}
          </div>
        )}

        {/* {['Web3', 'NFTs', 'DeFi'].map((channel, i) => (
          <div key={channel} className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-red-800 flex items-center justify-center mr-2">
                <Hash className="h-5 w-5 text-red-600 dark:text-red-300" />
              </div>
              <div>
                <div className="font-semibold">{channel}</div>
                <div className="text-sm text-neutral-500">{1000 + i * 500} members</div>
              </div>
            </div>
            <Button variant="outline" size="sm">Join</Button>
          </div>
        ))} */}
        <Button variant="link" className="text-red-600 p-0">Discover more</Button>
      </div>
    )

}