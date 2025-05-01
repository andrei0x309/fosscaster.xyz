import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { ChevronRight, Loader2 } from "lucide-react"
import { getFavoriteFrames,disableMiniAppNotifications, enableMiniAppNotifications, removeMiniAppFromFavs, setMiniAppPosition } from '~/lib/api'
import { Img as Image } from 'react-image'
import { Switch } from "~/components/ui/switch"
import { useMainStore } from "~/store/main"
import { useToast } from "~/hooks/use-toast"

import type { TWCFavoriteFrames } from "~/types/wc-favorite-frames"

type MiniApp = TWCFavoriteFrames['result']['frames'][number]

export function DraggableMiniApps() {
  const [apps, setApps] = useState({} as TWCFavoriteFrames)
  const [activeApp, setActiveApp] = useState< MiniApp | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { setMiniAppRefreshCount, miniAppRefreshCount } = useMainStore()
  const { toast } = useToast()

  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    const sourceIndex = result.destination.index
    const destinationIndex = result.source.index
    const items = Array.from(apps?.result?.frames || [])
    const [reorderedItem] = items.splice(sourceIndex, 1)
    items.splice(destinationIndex, 0, reorderedItem)

    setMiniAppPosition({
      domain: reorderedItem.domain,
      position: destinationIndex
    }).then(() => {
      setMiniAppRefreshCount(miniAppRefreshCount + 1)
      toast({
        title: 'Success',
        description: 'Mini apps positions updated'
      })
    }).catch((error) => {
      console.error('Failed to set mini app position', error)
    })

    setApps({
      ...apps,
      result: {
        ...apps.result,
        frames: items,
      },
    })
  }

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const apps = await getFavoriteFrames({ limit: 100})
        setApps(apps)
      } catch (error) {
        console.error('Failed to fetch frames', error)
      }
    }
    fetchApps()
  }, [])

  const openMiniAppSettings = (app: MiniApp) => {
    setActiveApp(app)
  }

  const closeMiniAppSettings = () => {
    setActiveApp(null)
  }

  const doEnableMiniAppNotifications = async (app: MiniApp) => {
    try {
      if (isLoading) return
      setIsLoading(true)
      await enableMiniAppNotifications({domain: app.domain})
      toast({
        title: 'Mini app notifications enabled',
        description: `Enabled notifications for ${app.name}`,
      })
      setIsLoading(false)
      } catch (error) {
      console.error('Failed to enable mini app notifications', error)
      setIsLoading(false)
    }
  }

  const doDisableMiniAppNotifications = async (app: MiniApp) => {
    try {
      if (isLoading) return
      setIsLoading(true)
      await disableMiniAppNotifications({domain: app.domain})
      toast({
        title: 'Mini app notifications disabled',
        description: `Disabled notifications for ${app.name}`,
      })
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to disable mini app notifications', error)
      setIsLoading(false)
    }
  }

  const doRemoveMiniApp = async (app: MiniApp) => {
    try {
      if (isLoading) return
      setIsLoading(true)

      await removeMiniAppFromFavs({domain: app.domain})
      setMiniAppRefreshCount(miniAppRefreshCount + 1)
      setApps({
        ...apps,
        result: {
          ...apps.result,
          frames: apps.result.frames.filter((frame) => frame.domain !== app.domain),
        },
      })
      setActiveApp(null)
      toast({
        title: 'Mini app removed',
        description: `Removed ${app.name} from your mini apps`,
      })
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to remove mini app', error)
      setIsLoading(false)
    }
  }

  const doSwitchTogle = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, app: MiniApp) => {
     try{
      if (isLoading) return
      setIsLoading(true)
    const isChecked = e.currentTarget.getAttribute('data-state') !== 'checked'
    if (isChecked) {
      await doEnableMiniAppNotifications(app)
    } else {
      await doDisableMiniAppNotifications(app)
    }
    setIsLoading(false)
    } catch (error) {
      console.error('Failed to switch toogle', error)
      setIsLoading(false)
    }
  }

  return (
    <>
    { !activeApp?.homeUrl ? <div className="max-w-2xl">
      <p className="dark:text-neutral-200 mb-6">
        Drag and drop to rearrange the order of your mini apps.
        <br />
        Mini apps are displayed from left to right, filling the top row first, then moving to the next row.
      </p>

      <div className="dark:bg-neutral-900 bg-neutral-100 rounded-lg overflow-hidden">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="mini-apps">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {apps?.result?.frames?.map((app, index) => (
                  <Draggable key={app.domain} draggableId={app.domain} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="border-b dark:border-neutral-800 last:border-b-0"
                      >
                        <div className="flex items-center">
                          <div {...provided.dragHandleProps} className="mr-3 text-gray-500 cursor-grab px-4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="4" x2="20" y1="9" y2="9" />
                              <line x1="4" x2="20" y1="15" y2="15" />
                            </svg>
                          </div>
                          <div className="flex w-full cursor-pointer p-4 items-center" onClick={() => openMiniAppSettings(app)} aria-hidden>
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 text-lg cursor-pointer"
                            style={{ backgroundColor: app.splashBackgroundColor }}
                          >
                            <Image src={[app?.iconUrl ?? app?.splashImageUrl ?? '/placeholder.svg']} alt={app.name} loader={<Loader2 className="h-5 w-5 text-red-500 animate-spin" />} className="w-full h-full object-cover rounded-lg" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{app.name}</div>
                            <div className="text-sm text-gray-400">{app?.author?.username}</div>
                          </div>
                          <ChevronRight className="text-gray-400 cursor-pointer" size={20}/>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  :
  
  <div className="flex flex-col bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg border-[1px] border-neutral-200 dark:border-neutral-700 max-w-80">
   <button onClick={closeMiniAppSettings} className="rounded-lg text-action-purple disabled:opacity-50 px-4 py-2 text-sm mb-2 flex items-center !p-0 font-normal text-link hover:text-default">
      <svg aria-hidden="true" focusable="false" role="img" className="mr-1" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style={{"display":"inline-block","userSelect":"none","verticalAlign":"text-bottom","overflow":"visible"}}>
         <path d="M7.78 12.53a.75.75 0 0 1-1.06 0L2.47 8.28a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L4.81 7h7.44a.75.75 0 0 1 0 1.5H4.81l2.97 2.97a.75.75 0 0 1 0 1.06Z"></path>
      </svg>
      Return to list
   </button>
   <div className="flex flex-col space-y-2.5">
      <div className="flex items-center space-x-3">
         <div className="border-hairline size-14 overflow-hidden rounded-lg border border-faint">
         <Image src={[activeApp?.iconUrl ?? activeApp?.splashImageUrl ?? '/placeholder.svg']} alt={activeApp.name} loader={<Loader2 className="h-5 w-5 text-red-500 animate-spin" />} className="w-full h-full object-cover rounded-lg" /></div>
         <div className="shrink">
            <div className="font-semibold">{activeApp?.name}</div>
            <div className="text-sm text-neutral-400">Built by {activeApp?.author?.username}</div>
            <div className="truncate text-xs text-neutral-400">Domain: {activeApp?.domain}</div>
         </div>
      </div>
      <div className="rounded-xl p-3 bg-neutral-400/20">
         <div className="flex w-full items-center justify-between gap-2"><span className="flex grow flex-col"><span className="font-semibold text-default" id="headlessui-label-:r18e:">Notifications</span><span className="text-sm text-muted" id="headlessui-description-:r18f:"></span></span>
         <Switch checked={activeApp?.viewerContext?.notificationsEnabled} disabled={isLoading} onClick={(e) => doSwitchTogle(e, activeApp)} className="data-[state=unchecked]:bg-red-600 data-[state=checked]:bg-green-500" />
         {isLoading ? <Loader2 className="h-5 w-5 text-white animate-spin" /> : null}
         </div>
      </div>
      <button disabled={isLoading} onClick={ () => doRemoveMiniApp(activeApp)} className="rounded-lg font-semibold text-white bg-red-600 text-light disabled:opacity-50 px-4 py-2 text-sm w-full">Remove
        {isLoading ? <Loader2 className="h-5 w-5 text-white animate-spin inline-block ml-4" /> : null}
      </button>
   </div>
</div>
          }
          </>
      )
}
