
import type { TWCDiscoverChannels } from '~/types/wc-discover-channels'
import { putFollowChannel, deleteFollowChannel } from "~/lib/api"
import { useState, } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"

export function ChannelItem ({ channel, className = '' }: { channel: TWCDiscoverChannels['result']['channels'][number], className?: string }) {

    const [stateChannel, setStateChannel] = useState(channel)

    const handleFollowChannel = async () => {
        try {
            await putFollowChannel(channel.key)
            setStateChannel({
                ...channel,
                viewerContext: {
                    ...channel.viewerContext,
                    following: true
                }
            })
        }
        catch (error) {
            console.error(error)
        }
    }

    const handleUnfollowChannel = async () => {
        try {
            await deleteFollowChannel(channel.key)
            setStateChannel({
                ...channel,
                viewerContext: {
                    ...channel.viewerContext,
                    following: false
                }
            })
        }
        catch (error) {
            console.error(error)
        }
    }

    return (
        <div key={stateChannel.key} className={`flex items-start space-x-4 mb-6 ${className}`}>
            <Avatar className="w-10 h-10">
                <AvatarImage src={stateChannel.fastImageUrl} alt={stateChannel.name} />
                <AvatarFallback>{stateChannel.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="font-semibold">{stateChannel.name}</h2>
                        <p className="text-neutral-400 text-sm">
                            {stateChannel.key} Mmebers: {stateChannel.memberCount && `• Followers: ${stateChannel.followerCount}`}
                        </p>
                    </div>
                    {!stateChannel.viewerContext.following ? (
                        <Button variant="secondary" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleFollowChannel()}>
                            Follow
                        </Button>
                    ) : (
                        <Button variant="secondary" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleUnfollowChannel()}>
                            Unfollow
                        </Button>
                    )}
                </div>
                <p className="text-sm mt-1 text-neutral-300">{stateChannel.description}</p>
            </div>
        </div>
    )

}