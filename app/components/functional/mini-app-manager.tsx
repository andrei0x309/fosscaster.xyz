"use client"
import { useState, useEffect, useCallback } from "react"
import { Modal } from "./modals/mini-app-host"
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react"
import { cn } from "~/lib/utils"
import { useMainStore } from "~/store/main"
import type { ModalProps } from "./modals/mini-app-host"
import { Img as Image } from 'react-image'
// import { T_MINI_APP_DATA } from "~/types/stores/store"

// Maximum number of minimized modals allowed
const MAX_MINIMIZED_MODALS = 6

export function ModalManager() {

  const { miniAppToOpen, openMiniApp } = useMainStore()
  const [modals, setModals] = useState<ModalProps[]>([] as ModalProps[])

  // const [modals, setModals] = useState<ModalData[]>([
  //   {
  //     id: "1",
  //     title: "Spaces",
  //     subtitle: "built by moe",
  //     isInstalled: false,
  //     icon: "🌐",
  //     isOpen: true,
  //     isMinimized: false,
  //     content: (
  //       <div className="flex flex-col gap-4">
  //         <div className="h-40 bg-muted/30 flex items-center justify-center text-muted-foreground">NO LIVE SPACES</div>
  //         <div className="space-y-4">
  //           <input
  //             type="text"
  //             placeholder="Space Title"
  //             className="w-full px-4 py-2 rounded-md border border-input bg-background"
  //           />
  //           <button className="w-full py-3 bg-muted hover:bg-muted/80 transition-colors rounded-md">
  //             Create Space
  //           </button>
  //         </div>
  //       </div>
  //     ),
  //   },
  //   {
  //     id: "2",
  //     title: "Scout Game",
  //     subtitle: "built by scoutgamexyz",
  //     isInstalled: true,
  //     icon: "🎮",
  //     isOpen: false,
  //     isMinimized: false,
  //     content: (
  //       <div className="flex flex-col gap-4">
  //         <div className="bg-gradient-to-b from-blue-400 to-purple-600 p-4 rounded-md text-white">
  //           <div className="flex items-center gap-2 mb-2">
  //             <span className="bg-white/20 p-1 rounded-full">ℹ️</span>
  //             <span>
  //               Scout Game's <u>DEV token</u>
  //             </span>
  //             <span className="font-bold">21</span>
  //           </div>
  //           <h2 className="text-2xl font-bold mb-2">Fantasy Sports for Onchain Developers</h2>
  //           <p className="mb-4">Pick great developers. Earn rewards. Everyone can play. No coding required!</p>
  //           <div className="flex justify-center items-center py-2">
  //             <span className="animate-pulse">Logging in...</span>
  //           </div>
  //         </div>
  //       </div>
  //     ),
  //   },
  //   {
  //     id: "3",
  //     title: "Weather App",
  //     subtitle: "built by weatherxyz",
  //     isInstalled: true,
  //     icon: "🌤️",
  //     isOpen: false,
  //     isMinimized: false,
  //     content: (
  //       <div className="flex flex-col gap-4 items-center">
  //         <div className="text-4xl">🌤️</div>
  //         <h2 className="text-xl font-bold">Weather Forecast</h2>
  //         <p className="text-muted-foreground">Current temperature: 72°F</p>
  //       </div>
  //     ),
  //   },
  //   {
  //     id: "4",
  //     title: "Calculator",
  //     subtitle: "built by calcxyz",
  //     isInstalled: false,
  //     icon: "🧮",
  //     isOpen: false,
  //     isMinimized: false,
  //     content: (
  //       <div className="flex flex-col gap-2">
  //         <input type="text" readOnly value="0" className="w-full p-2 text-right text-xl border rounded-md" />
  //         <div className="grid grid-cols-4 gap-2">
  //           {["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "-", "0", ".", "=", "+"].map((key) => (
  //             <button key={key} className="p-2 bg-muted hover:bg-muted/80 rounded-md">
  //               {key}
  //             </button>
  //           ))}
  //         </div>
  //       </div>
  //     ),
  //   },
  //   {
  //     id: "5",
  //     title: "Notes",
  //     subtitle: "built by notesxyz",
  //     isInstalled: true,
  //     icon: "📝",
  //     isOpen: false,
  //     isMinimized: false,
  //     content: (
  //       <div className="flex flex-col gap-4">
  //         <textarea placeholder="Type your notes here..." className="w-full h-40 p-2 border rounded-md"></textarea>
  //         <div className="flex justify-end">
  //           <button className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-md">Save</button>
  //         </div>
  //       </div>
  //     ),
  //   },
  //   {
  //     id: "6",
  //     title: "Calendar",
  //     subtitle: "built by calxyz",
  //     isInstalled: false,
  //     icon: "📅",
  //     isOpen: false,
  //     isMinimized: false,
  //     content: (
  //       <div className="flex flex-col gap-4">
  //         <div className="text-center">
  //           <h2 className="text-xl font-bold">April 2025</h2>
  //         </div>
  //         <div className="grid grid-cols-7 gap-1">
  //           {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
  //             <div key={day} className="text-center font-medium">
  //               {day}
  //             </div>
  //           ))}
  //           {Array.from({ length: 30 }, (_, i) => (
  //             <div key={i} className="text-center p-2 hover:bg-muted/50 rounded-md">
  //               {i + 1}
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     ),
  //   },
  //   {
  //     id: "7",
  //     title: "Tasks",
  //     subtitle: "built by tasksxyz",
  //     isInstalled: true,
  //     icon: "✅",
  //     isOpen: false,
  //     isMinimized: false,
  //     content: (
  //       <div className="flex flex-col gap-4">
  //         <div className="flex items-center gap-2">
  //           <input type="text" placeholder="Add a task..." className="flex-1 p-2 border rounded-md" />
  //           <button className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-md">Add</button>
  //         </div>
  //         <div className="space-y-2">
  //           <div className="flex items-center gap-2">
  //             <input type="checkbox" id="task1" />
  //             <label htmlFor="task1">Complete project documentation</label>
  //           </div>
  //           <div className="flex items-center gap-2">
  //             <input type="checkbox" id="task2" />
  //             <label htmlFor="task2">Schedule team meeting</label>
  //           </div>
  //           <div className="flex items-center gap-2">
  //             <input type="checkbox" id="task3" checked />
  //             <label htmlFor="task3" className="line-through">
  //               Review pull requests
  //             </label>
  //           </div>
  //         </div>
  //       </div>
  //     ),
  //   },
  // ])


  
  // State for sidebar collapse
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  // Handle opening a modal
  const handleOpenModal = useCallback((homeUrl: string) => {
    setModals(
      modals.map((modal: ModalProps) => {
        if (modal.homeUrl === homeUrl) {
          return { ...modal, isOpen: true, isMinimized: false }
        }
        return modal
      }),
    )
  }, [modals])

  // Handle closing a modal
  const handleCloseModal =  useCallback((homeUrl: string) => {
    setModals(
       modals.filter((modal: ModalProps) => {
        if (modal.homeUrl === homeUrl) {
          return false
        }
        return true
      })
    )
  }, [modals])

  // Handle minimizing a modal
  const handleMinimizeModal =  useCallback((homeUrl: string) => {
    setModals(
      modals.map((modal: ModalProps) => {
        if (modal.homeUrl === homeUrl) {
          return { ...modal, isMinimized: true }
        }
        return modal
      }),
    )
  }, [modals])

  // Handle maximizing a modal
  const handleMaximizeModal =  useCallback((homeUrl: string) => {
    setModals(
      modals.map((modal: ModalProps) => {
        if (modal.homeUrl === homeUrl) {
          return { ...modal, isMinimized: false }
        }
        return modal
      }),
    )
  }, [modals])

  // Get all minimized modals
  const minimizedModals = modals.filter((modal: ModalProps) => modal.isOpen && modal.isMinimized)

  // Get all open, non-minimized modals
  const openModals = modals.filter((modal:ModalProps) => modal.isOpen && !modal.isMinimized)

  // Check if we've reached the maximum number of minimized modals
  const isMaxMinimizedReached = minimizedModals.length >= MAX_MINIMIZED_MODALS

  useEffect(() => {
    if(miniAppToOpen === null) return
    openMiniApp(null)
    const isModalOpen = modals.find(modal => modal.homeUrl === miniAppToOpen.homeUrl)
    if (isModalOpen && !isModalOpen.isMinimized) return
    if (isModalOpen && isModalOpen.isMinimized){
      setModals(
        modals.map((modal: ModalProps) => {
          if (modal.homeUrl === miniAppToOpen.homeUrl) {
            return { ...modal, isOpen: true, isMinimized: false }
          }
          return modal
        }),
      )
    } else {
      const newModal = {
        homeUrl: miniAppToOpen.homeUrl,
        name: miniAppToOpen.name,
        isOpen: true,
        isMinimized: false,
        onClose: () => handleCloseModal(miniAppToOpen.homeUrl),
        onMinimize: () => handleMinimizeModal(miniAppToOpen.homeUrl),
        onMaximize: () => handleMaximizeModal(miniAppToOpen.homeUrl),
        isInstalled: miniAppToOpen.isInstalled,
        iconUrl: miniAppToOpen.iconUrl,
        splashImageUrl: miniAppToOpen.splashImageUrl,
        author: miniAppToOpen.author,
      } as ModalProps
      setModals([...modals, newModal])
    }
      
    }, [handleCloseModal, handleMaximizeModal, handleMinimizeModal, miniAppToOpen, modals, openMiniApp])


  return (
    <div>
      {/* Demo Controls */}
      {/* <div className="fixed top-4 left-4 z-40 flex flex-wrap gap-2 max-w-[600px]">
        {modals.map((modal) => (
          <button
            key={modal.id}
            onClick={() => handleOpenModal(modal.id)}
            className="px-3 py-1 bg-[#4a3a6b] text-white rounded-md hover:bg-[#5a4a7b] transition-colors"
          >
            Open {modal.title}
          </button>
        ))}
      </div> */}

      {/* Render open modals */}
      {openModals.map((modal: ModalProps) => (
        <Modal
          homeUrl={modal.homeUrl}
          key={modal.homeUrl}
          name={modal.name}
          iconUrl={modal.iconUrl}
          isInstalled={modal.isInstalled}
          isMinimized={modal.isMinimized}
          onClose={() => handleCloseModal(modal.homeUrl)}
          onMinimize={() => {
            // If we've reached the maximum, close instead of minimize
            if (isMaxMinimizedReached) {
              handleCloseModal(modal.homeUrl)
            } else {
              handleMinimizeModal(modal.homeUrl)
            }
          }}
          onMaximize={() => handleMaximizeModal(modal.homeUrl)}
          isMaxMinimizedReached={isMaxMinimizedReached}
          author={modal.author}
        >
        </Modal>
      ))}

      {/* Minimized Column */}
      {minimizedModals.length > 0 && (
        <div
          className={cn(
            "fixed top-0 right-0 bottom-0 z-50 dark:bg-neutral-900 shadow-lg flex flex-col transition-all duration-300",
            isSidebarCollapsed ? "w-16" : "w-64",
          )}
        >
          {/* Header with collapse/expand toggle */}
          <div className="p-3 dark:bg-neutral-800 dark:text-white font-medium flex items-center">
            {isSidebarCollapsed ? (
              <button
                onClick={toggleSidebar}
                className="flex items-center justify-center w-full"
                title="Expand Mini Apps"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            ) : (
              <>
                <button
                  onClick={toggleSidebar}
                  className="mr-2 hover:bg-white/10 rounded-sm p-1"
                  title="Collapse Mini Apps"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <span>Mini Apps</span>
              </>
            )}
          </div>

          {/* Minimized apps list */}
          <div className="flex-1 overflow-y-auto">
            {minimizedModals.map((modal: ModalProps) => (
              <div
                key={modal.homeUrl}
                className={cn(
                  "flex items-center border-b border-neutral-300 hover:bg-neutral-200 dark:border-neutral-600 dark:hover:bg-neutral-500 transition-colors",
                  modal.isInstalled ? "dark:text-white text-black" : "dark:text-white/70 text-black/70",
                  isSidebarCollapsed ? "justify-center p-3" : "justify-between p-3",
                )}
              >
                {isSidebarCollapsed ? (
                  <div className="flex flex-col items-center">
                    <div className="text-xl mb-1 inline-block">
                      <Image src={modal?.iconUrl as string} alt={modal.name} className="h-6 w-6" />
                      </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleMaximizeModal(modal.homeUrl)}
                        className="p-1 rounded-sm hover:bg-white/10 transition-colors"
                        title={`Maximize ${modal.name}`}
                      >
                        <Maximize2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleCloseModal(modal.homeUrl)}
                        className="p-1 rounded-sm hover:bg-white/10 transition-colors"
                        title={`Close ${modal.name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleMaximizeModal(modal.homeUrl)}
                      className="flex items-center gap-2 flex-1 text-left"
                    >
                      <span className="text-xl"><Image src={modal?.iconUrl as string} alt={modal.name} className="h-6 w-6" /></span>
                      <span className="truncate">{modal.name}</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMaximizeModal(modal.homeUrl)}
                        className="p-1 rounded-sm hover:bg-white/10 transition-colors"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleCloseModal(modal.homeUrl)}
                        className="p-1 rounded-sm hover:bg-white/10 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
