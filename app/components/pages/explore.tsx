import { useEffect, useState,  } from 'react'
import { suggestedUsers, getDiscoverChannels } from "~/lib/api"
import { CastHeader } from "~/components/blocks/header/cast-header"
import { ChannelItem } from "~/components/blocks/explore/channel"
import { UserItem } from "~/components/blocks/explore/user"
import  InfiniteScroll from "~/components/ui/extension/infinte-scroll"
import { SimpleLoader } from "~/components/atomic/simple-loader"

export default function ExplorePage({ className, page = 'users' }: { className?: string, page?: 'users' | 'channels' }) {
  const [activeTab, setActiveTab] = useState(page)
  const [users, setUsers] = useState({} as Awaited<ReturnType<typeof suggestedUsers>>)
  const [channels, setChannels] = useState({} as Awaited<ReturnType<typeof getDiscoverChannels>>)
  const [loading, setLoading] = useState(false)
  const [hasMoreUsers, setHasMoreUsers] = useState(true)
  const [hasMoreChannels, setHasMoreChannels] = useState(true)
  const [isUsersFirstLoad, setIsUsersFirstLoad] = useState(false)
  const [isChannelsFirstLoad, setIsChannelsFirstLoad] = useState(false)
 
  const loadMoreUsers = async () => {
    console.log('loadMoreUsers')
    if(loading) return
    try{ 
    setLoading(true)
    const usersCursor = users?.next?.cursor
    if(!usersCursor){
      setHasMoreUsers(false)
      setLoading(false)
      return
    }
    const res = await suggestedUsers({ cursor: usersCursor })
    setUsers({  next: res.next, result: {
      users: [...(users?.result?.users ?? []), ...(res?.result?.users ?? [])]
    } })
    setLoading(false)
  } catch(e){
    setLoading(false)
    console.error(e)
  }
}

const loadMoreChannels = async () => {
  if(loading) return
  try{
  setLoading(true)
  const channelsCursor = channels?.next?.cursor
  if(!channelsCursor){
    setHasMoreChannels(false)
    setLoading(false)
    return
  }
  const res = await getDiscoverChannels({ cursor: channelsCursor })
  setChannels({  next: res.next, result: {
    ...(channels?.result ?? {}),
    channels: [...(channels?.result?.channels ?? []), ...(res?.result?.channels ?? [])]
  } })
  
  setLoading(false)
  } catch(e){
    setLoading(false)
    console.error(e)
  }
}
  
  useEffect(() => {
    suggestedUsers({}).then(setUsers).then(() => setIsUsersFirstLoad(true))
    getDiscoverChannels({}).then(setChannels).then(() => setIsChannelsFirstLoad(true))
  }, [])

 
  return (

    <main className={`h-full w-full shrink-0 justify-center sm:w-[540px] lg:w-[680px] ${className}`}>
    <div className={`min-h-screen text-white ${className}`}>
    <div className="h-full min-h-screen">
    <div className="sticky bg-white dark:bg-neutral-950 top-0 z-10 flex-col border-b-0 bg-app border-default h-26 p-2">
      <CastHeader title="Explore" hasBackButton={true} />
      <nav className="flex border-b border-t border-neutral-700">
        <button
          disabled={loading}
          className={`flex-1 py-2 text-center ${activeTab === 'users' ? 'text-red-400 border-b-2 border-red-600' : 'text-neutral-400 '} ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          disabled={loading}
          className={`flex-1 py-2 text-center ${activeTab === 'channels' ? 'text-red-400 border-b-2 border-red-600' : 'text-neutral-400'} ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={() => setActiveTab('channels')}
        >
          Channels
        </button>
      </nav>
      </div>
      <div className="p-4 h-full min-h-screen">
        {activeTab === 'users' && (
          <>
          { users?.result?.users.map((user, index) => (
            <UserItem key={index} user={user} />
          )) }
          {loading && <SimpleLoader />}
          {isUsersFirstLoad && <InfiniteScroll hasMore={hasMoreUsers} isLoading={loading} next={loadMoreUsers} threshold={1}>
           <div className='my-2'>
           </div>
          </InfiniteScroll>
          }
          </>
        )}
        {activeTab === 'channels' && (
          <>
            {channels?.result?.channels?.length ? channels.result.channels.map((channel) => (
              <ChannelItem key={channel.key} channel={channel} />
            )) : null
             }
           {loading && <SimpleLoader />} 
          {isChannelsFirstLoad && <InfiniteScroll hasMore={hasMoreChannels} isLoading={loading} next={loadMoreChannels} threshold={1}>
          <div className='my-2'></div>
          </InfiniteScroll>}

          </>
        )}

         


      </div>
    </div>
    </div>
    </main>
  )
}