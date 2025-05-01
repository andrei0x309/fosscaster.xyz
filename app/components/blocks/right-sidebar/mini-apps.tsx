
import { useEffect, useState, useCallback } from 'react'
import { Button  } from "~/components/ui/button"
import { Settings, Grid2x2, SquareArrowRight } from 'lucide-react'
import type { TWCFavoriteFrames } from "~/types/wc-favorite-frames"
import { Img as Image } from 'react-image'
import { getFavoriteFrames } from '~/lib/api'
import { useMainStore } from '~/store/main'
// import type { T_MINI_APP_DATA } from '~/types/stores/store'

export const MiniAppsSidebar = () => {

    const [miniApps, setMiniApps] = useState([] as TWCFavoriteFrames['result']['frames'])
    const [userHasApps, setUserHasApps] = useState(true)
    const [loading, setLoading] = useState(true)
    const { navigate, openMiniApp, miniAppRefreshCount } = useMainStore()

    const fetchApps = useCallback(async () => {
          try {
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
  }, [])

    useEffect(() => {
        fetchApps()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
      fetchApps()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [miniAppRefreshCount])


    return (
        <div className="bg-neutral-100 dark:dark:bg-zinc-900 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Mini Apps</h2>
            <div className="flex space-x-2">
              <Settings className="h-5 w-5" />
              <Grid2x2 className="h-5 w-5 cursor-pointer" onClick={() => navigate('/~/mini-apps')} />
            </div>
          </div>

          {loading &&
          <div>Loading...</div>}
        
         {userHasApps && !loading &&
          <div className="grid grid-cols-4 gap-4 mb-4">
            {miniApps.map((app, index) => (
              <div key={index} className="flex flex-col items-center cursor-pointer" onClick={() => openMiniApp({
                homeUrl: app.homeUrl,
                name: app.name,
                iconUrl: app.iconUrl,
                viewerContext: {
                  favorited: app?.viewerContext?.favorited || false,
                  notificationDetails: {
                    token: app?.viewerContext?.notificationDetails?.token || '',
                    url: app?.viewerContext?.notificationDetails?.url || '',
                  },
                  notificationsEnabled: app?.viewerContext?.notificationsEnabled || false,
                },
                splashImageUrl: app.splashImageUrl,
                author: {
                  username: app?.author?.username,
                  avatarUrl: app?.author?.pfp?.url,
                },
              })
              }
              role="button"
              aria-hidden
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden mb-2">
                  <Image
                    src={app.iconUrl || "/placeholder.svg"}
                    alt={app.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs text-center">{app.name.length > 8 ? app.name.substring(0, 8) + "..." : app.name}</span>
              </div>
            ))}
          </div>
        } 

        {!userHasApps && !loading &&
        <div className="flex flex-col items-center">
            <h2 className="text-white text-center">No mini apps found</h2>
            <Button variant="outline" className="mt-4">
                <SquareArrowRight className="mr-2 h-4 w-4" />
                <span>Explore</span>
            </Button>
            </div>
            }
      </div>
    )

}