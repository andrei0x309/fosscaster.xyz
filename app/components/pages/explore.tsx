import { useEffect, useState,  } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { suggestedUsers, getDiscoverChannels, putFollowChannel, deleteFollowChannel } from "~/lib/api"
import { Activity } from 'lucide-react'
import { CastHeader } from "~/components/blocks/header/cast-header"

export default function ExplorePage({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState({} as Awaited<ReturnType<typeof suggestedUsers>>)
  const [channels, setChannels] = useState({} as Awaited<ReturnType<typeof getDiscoverChannels>>)
  const [loading, setLoading] = useState(true)
  const [usersCursor, setUsersCursor] = useState('')
  const [channelsCursor, setChannelsCursor] = useState('')

  const handleFollowChannel = async (channelKey: string) => {
    try {
      await putFollowChannel(channelKey)
      setChannels((prev) => {
        return {
          ...prev,
          result: {
            ...prev.result,
            channels: prev.result.channels.map((channel) => {
              if (channel.key === channelKey) {
                return {
                  ...channel,
                  viewerContext: {
                    ...channel.viewerContext,
                    following: true
                  }
                }
              }
              return channel
            })
          }
        }
      })
    }
    catch (error) {
      console.error(error)
    }
  }

  const handleUnfollowChannel = async (channelKey: string) => {
    try {
      await deleteFollowChannel(channelKey)
      setChannels((prev) => {
        return {
          ...prev,
          result: {
            ...prev.result,
            channels: prev.result.channels.map((channel) => {
              if (channel.key === channelKey) {
                return {
                  ...channel,
                  viewerContext: {
                    ...channel.viewerContext,
                    following: false
                  }
                }
              }
              return channel
            })
          }
        }
      })
    }
    catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    suggestedUsers({}).then(setUsers)
    getDiscoverChannels().then(setChannels)
  }, [])

 
  return (

    <main className={`h-full w-full shrink-0 justify-center sm:w-[540px] lg:w-[680px] ${className}`}>
    <div className={`min-h-screen text-white ${className}`}>
    <div className="h-full min-h-screen">
    <div className="sticky bg-white dark:bg-neutral-950 top-0 z-10 flex-col border-b-0 bg-app border-default h-26 p-2">
      <CastHeader title="Explore" hasBackButton={true} />
      <nav className="flex border-b border-t border-neutral-700">
        <button 
          className={`flex-1 py-2 text-center ${activeTab === 'users' ? 'text-red-400 border-b-2 border-red-600' : 'text-neutral-400'}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={`flex-1 py-2 text-center ${activeTab === 'channels' ? 'text-red-400 border-b-2 border-red-600' : 'text-neutral-400'}`}
          onClick={() => setActiveTab('channels')}
        >
          Channels
        </button>
      </nav>
      </div>
      <div className="p-4">
        {activeTab === 'users' && (
          users?.result?.users.map((user, index) => (
            <div key={index} className="flex items-start space-x-4 mb-6">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.pfp.url} alt={user.username} />
                <AvatarFallback>{user.username}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold flex items-center">
                      {user.username}
                      {user?.activeOnFcNetwork ? (
                        <Activity className="w-4 h-4 ml-1 text-red-600" />
                      ): null}
                    </h2>
                    <p className="text-gray-400 text-sm">{user.username}</p>
                  </div>
                  <Button variant="secondary" className="bg-red-600 hover:bg-red-700 text-white">
                    Follow
                  </Button>
                </div>
                <p className="text-sm mt-1">
                  {user?.profile?.bio?.text}
                </p>
              </div>
            </div>
          ))
        )}
        {activeTab === 'channels' && (
          <>
            {channels?.result?.channels?.length ? channels.result.channels.map((channel) => (
              <div key={channel.key} className="flex items-start space-x-4 mb-6">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={channel.fastImageUrl} alt={channel.name} />
                  <AvatarFallback>{channel.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-semibold">{channel.name}</h2>
                      <p className="text-gray-400 text-sm">
                        {channel.key} Mmebers: {channel.memberCount && `• Followers: ${channel.followerCount}`}
                      </p>
                    </div>
                    { !channel.viewerContext.following ? (
                    <Button variant="secondary" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleFollowChannel(channel.key)}>
                      Follow
                    </Button>
                    ) : (
                      <Button variant="secondary" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleUnfollowChannel(channel.key)}>
                        Unfollow
                      </Button>
                    )}
                  </div>
                  <p className="text-sm mt-1 text-gray-300">{channel.description}</p>
                </div>
              </div>
            )) : null
             }
          </>
        )}
      </div>
    </div>
    </div>
    </main>
  )
}