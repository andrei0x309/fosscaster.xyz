import { useEffect, useState,  } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { suggestedUsers, getDiscoverChannels } from "~/lib/api"
import { CastHeader } from "~/components/blocks/header/cast-header"
import { ChannelItem } from "~/components/blocks/explore/channel"
import { UserItem } from "~/components/blocks/explore/user"

export default function ExplorePage({ className, page = 'users' }: { className?: string, page?: 'users' | 'channels' }) {
  const [activeTab, setActiveTab] = useState(page)
  const [users, setUsers] = useState({} as Awaited<ReturnType<typeof suggestedUsers>>)
  const [channels, setChannels] = useState({} as Awaited<ReturnType<typeof getDiscoverChannels>>)
  const [loading, setLoading] = useState(true)
  const [usersCursor, setUsersCursor] = useState('')
  const [channelsCursor, setChannelsCursor] = useState('')

  
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
            <UserItem key={index} user={user} />
          ))
        )}
        {activeTab === 'channels' && (
          <>
            {channels?.result?.channels?.length ? channels.result.channels.map((channel) => (
              <ChannelItem key={channel.key} channel={channel} />
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