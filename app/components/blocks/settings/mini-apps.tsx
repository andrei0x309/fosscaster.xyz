import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { ChevronRight, Loader2 } from "lucide-react"
import { getFavoriteFrames } from '~/lib/api'
import { Img as Image } from 'react-image'

import type { TWCFavoriteFrames } from "~/types/wc-favorite-frames"

type MiniApp = TWCFavoriteFrames['result']['frames'][number]

export function DraggableMiniApps() {
  const [apps, setApps] = useState({} as TWCFavoriteFrames)
  const [activeApp, setActiveApp] = useState< MiniApp | null>(null)

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(apps?.result?.frames || [])
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

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

  return (
    <>
    { !activeApp?.homeUrl ? <div className="max-w-2xl">
      <p className="text-[#a0a0c0] mb-6">
        Drag and drop to rearrange the order of your mini apps.
        <br />
        Mini apps are displayed from left to right, filling the top row first, then moving to the next row.
      </p>

      <div className="bg-[#1e1e2e] rounded-lg overflow-hidden">
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
                        className="border-b border-gray-800 last:border-b-0"
                      >
                        <div className="flex items-center p-4">
                          <div {...provided.dragHandleProps} className="mr-3 text-gray-500 cursor-grab">
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
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 text-lg"
                            style={{ backgroundColor: app.splashBackgroundColor }}
                          >
                            <Image src={[app?.splashImageUrl ?? '/placeholder.svg']} alt={app.name} loader={<Loader2 className="h-5 w-5 text-red-500 animate-spin" />} className="w-full h-full object-cover rounded-lg" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{app.name}</div>
                            <div className="text-sm text-gray-400">{app?.author?.username}</div>
                          </div>
                          <ChevronRight className="text-gray-400 cursor-pointer" size={20} onClick={() => openMiniAppSettings(app)} />
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
  
  <div className="flex flex-col">
   <button onClick={closeMiniAppSettings} className="rounded-lg text-action-purple disabled:opacity-50 px-4 py-2 text-sm mb-2 flex items-center !p-0 font-normal text-link hover:text-default">
      <svg aria-hidden="true" focusable="false" role="img" className="mr-1" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style={{"display":"inline-block","userSelect":"none","verticalAlign":"text-bottom","overflow":"visible"}}>
         <path d="M7.78 12.53a.75.75 0 0 1-1.06 0L2.47 8.28a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L4.81 7h7.44a.75.75 0 0 1 0 1.5H4.81l2.97 2.97a.75.75 0 0 1 0 1.06Z"></path>
      </svg>
      Return to list
   </button>
   <div className="flex flex-col space-y-2.5">
      <div className="flex items-center space-x-3">
         <div className="border-hairline size-14 overflow-hidden rounded-lg border border-faint">
          <img loading="lazy" src="https://proxy.wrpcd.net/?url=https%3A%2F%2Frewards.warpcast.com%2Fapp.png&amp;s=fb6f1c859aaccaabdd7eed6d0d4af051c49b445270053495c32c1c08fa8ff77e" alt="Rewards" className="size-full object-cover" /></div>
         <div className="shrink">
            <div className="font-semibold">{activeApp?.name}</div>
            <div className="text-sm text-muted">Built by {activeApp?.author?.username}</div>
            <div className="truncate text-xs text-muted">{activeApp?.domain}</div>
         </div>
      </div>
      <div className="rounded-xl p-3 bg-overlay-faint">
         <div className="flex w-full items-center justify-between gap-2"><span className="flex grow flex-col"><span className="font-semibold text-default" id="headlessui-label-:r18e:">Notifications</span><span className="text-sm text-muted" id="headlessui-description-:r18f:"></span></span>
         <button className="bg-action-purple relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent ring-0 transition-colors duration-200 ease-in-out focus:outline-none" id="headlessui-switch-:r18g:" role="switch" type="button" aria-checked="true" data-headlessui-state="checked" aria-labelledby="headlessui-label-:r18e:" aria-describedby="headlessui-description-:r18f:"><span aria-hidden="true" className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span></button></div>
      </div>
      <button className="rounded-lg font-semibold bg-action-danger text-light disabled:opacity-50 px-4 py-2 text-sm w-full">Remove</button>
   </div>
</div>
          }
          </>
      )
}
