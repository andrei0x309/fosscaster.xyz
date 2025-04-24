"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { ChevronRight } from "lucide-react"

type MiniApp = {
  id: string
  name: string
  developer: string
  icon: string
  iconBg: string
}

const initialApps: MiniApp[] = [
  {
    id: "amps",
    name: "Amps",
    developer: "by ampsfun",
    icon: "⚡",
    iconBg: "#8b5cf6",
  },
  {
    id: "scout-game",
    name: "Scout Game",
    developer: "by scoutgamexyz",
    icon: "🚲",
    iconBg: "#3b82f6",
  },
  {
    id: "rewards",
    name: "Rewards",
    developer: "by warpcast",
    icon: "⚙️",
    iconBg: "#8b5cf6",
  },
  {
    id: "warpslot",
    name: "Warpslot",
    developer: "by warpslot",
    icon: "🎰",
    iconBg: "#f59e0b",
  },
  {
    id: "farcademy",
    name: "Farcademy",
    developer: "by metopia",
    icon: "📚",
    iconBg: "#8b5cf6",
  },
  {
    id: "eggs",
    name: "$EGGS",
    developer: "by warpcastadmin.eth",
    icon: "🥚",
    iconBg: "#ec4899",
  },
  {
    id: "blog",
    name: "blog.flashsoft.eu",
    developer: "by andrei0x309",
    icon: "📝",
    iconBg: "#10b981",
  },
  {
    id: "sveltekit",
    name: "SveleteKit Starter Mini-App",
    developer: "by andrei0x309",
    icon: "🔥",
    iconBg: "#f97316",
  },
  {
    id: "labels",
    name: "Warpcast Labels",
    developer: "by compez.eth",
    icon: "🏷️",
    iconBg: "#6366f1",
  },
]

export function DraggableMiniApps() {
  const [apps, setApps] = useState(initialApps)

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(apps)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setApps(items)
  }

  return (
    <div className="max-w-2xl">
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
                {apps.map((app, index) => (
                  <Draggable key={app.id} draggableId={app.id} index={index}>
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
                            style={{ backgroundColor: app.iconBg }}
                          >
                            {app.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{app.name}</div>
                            <div className="text-sm text-gray-400">{app.developer}</div>
                          </div>
                          <ChevronRight className="text-gray-400" size={20} />
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
  )
}
