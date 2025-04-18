import { useEffect, useState, useCallback  } from 'react'
import { Button } from "~/components/ui/button"
 import { CastHeader, OptionalEndContent } from "~/components/blocks/header/cast-header"
import { Img as Image } from 'react-image'
import { Trophy, ChevronDown, Loader } from 'lucide-react'
import type { TWCFavoriteFrames } from "~/types/wc-favorite-frames"
import type { TWCTopFrames } from "~/types/wc-top-frames"
import { getFavoriteFrames, getTopFrames } from '~/lib/api'
import { useMainStore } from '~/store/main'

type TFrame = TWCFavoriteFrames['result']['frames'][number]

export default function MiniApps({ className}: { className?: string }) {
 
    const [miniApps, setMiniApps] = useState([] as TWCFavoriteFrames['result']['frames'])
    const [userHasApps, setUserHasApps] = useState(true)
    const [moreTopFrames, setMoreTopFrames] = useState(true)
    const [loading, setLoading] = useState(false)
    const [loadingTopFrames, setLoadingTopFrames] = useState(false)
    const [topFrames, setTopFrames] = useState({} as TWCTopFrames)
    const { openMiniApp } = useMainStore()
    


    const loadTopFrames = async () => {
        try {
            if(loadingTopFrames) return
            setLoadingTopFrames(true)
            const resultTopFrames = await getTopFrames({cursor: topFrames?.next?.cursor || ''})
            if(!resultTopFrames?.next?.cursor) {
                setMoreTopFrames(false)
            }
            setTopFrames({
                ...resultTopFrames,
                result: {
                    ...resultTopFrames.result,
                    frames: [...(topFrames?.result?.frames || []), ...resultTopFrames.result.frames]
                }
            })
            setLoadingTopFrames(false)
        } catch (error) {
            console.error('Failed to fetch top frames', error)
            setLoadingTopFrames(false)
        }
    }

    const fetchApps = async () => {
        try {
            if(loading) return
            const apps = await getFavoriteFrames({ limit: 12})
        if (!apps.result?.frames?.length) {
            setUserHasApps(false)
            setLoading(false)
            return
        }

        setMiniApps(apps.result?.frames)
        setLoading(false)
    } catch (error) {
        console.error('Failed to fetch frames', error)
        setUserHasApps(false)
        setLoading(false)
    }
    }
 

    const callbackLoadTopFrames = useCallback(loadTopFrames, [loadingTopFrames, topFrames?.next?.cursor, topFrames?.result?.frames])
    const callbackFetchApps = useCallback(fetchApps, [loading])

    useEffect(() => {
        callbackFetchApps()
        callbackLoadTopFrames()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const doOpenMiniApp = (app: TFrame) => {
       openMiniApp({
        name: app.name,
        homeUrl: app.homeUrl,
        iconUrl: app.iconUrl,
        author: {
          avatarUrl: app.author?.pfp?.url || '',
          username: app.author?.username
        },
        isInstalled: app?.viewerContext?.favorited,
        splashImageUrl: app?.splashImageUrl
      })
    }
 
  return (

    <main className={`h-full w-full shrink-0 justify-center sm:w-[540px] lg:w-[680px] ${className}`}>
        
        <div className="p-4">
        <CastHeader title="Mini Apps" headerClassName='text-[1.45rem]' hasBackButton={true} hasComposeButton={false} hasOptionalEndContent={true} >
            <OptionalEndContent>
                <Trophy className="mr-2" />
            </OptionalEndContent>
        </CastHeader>

        {userHasApps && <div className="mb-8 mt-4">
          <h2 className="text-lg text-neutral-400 mb-4">Added</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {loading && (
              <div className="flex items-center justify-center">
                <Loader className="animate-spin" />
              </div>
            )}

            {miniApps.map((app, index) => (
              <div key={index} className="flex flex-col items-center cursor-pointer" onClick={() => doOpenMiniApp(app)} aria-hidden>
                <div className="w-16 h-16 rounded-xl overflow-hidden mb-2">
                  <Image
                    src={app.iconUrl || "/placeholder.svg"}
                    alt={app.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs text-center">{app.name}</span>
              </div>
            ))}
          </div>
        </div>
       }

        <h2 className="text-lg text-neutral-400 mb-4">Top mini apps</h2>

        <div className="space-y-4">
         {loadingTopFrames && (
            <div className="flex items-center justify-center">
              <Loader className="animate-spin" />
            </div>
          )}

          {topFrames?.result?.frames.map((app, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg overflow-hidden mr-3" onClick={() => doOpenMiniApp(app as TFrame)} aria-hidden>
                  <Image
                    src={app.iconUrl || "/placeholder.svg"}
                    alt={app.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{app.name}</h3>
                  <p className="text-neutral-400 text-xs">by {app?.author?.username}</p>
                </div>
              </div>
              <Button className="bg-red-600 hover:bg-red-700 text-white rounded-md" onClick={() => doOpenMiniApp(app as TFrame)} aria-hidden>Open</Button>
            </div>
          ))}
        </div>

        {moreTopFrames && <button onClick={loadTopFrames} className="flex items-center justify-center w-full mt-6 text-red-600 hover:text-red-700 text-sm">
          View All <ChevronDown className="ml-1 h-4 w-4" />
        </button>
        }
    </div>
    {/* <div className={`min-h-screen text-white ${className}`}>
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
    </div> */}
    </main>
  )
}