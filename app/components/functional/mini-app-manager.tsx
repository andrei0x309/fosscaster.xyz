"use client"
import { useState, useEffect, useCallback } from "react"
import { Modal } from "./modals/mini-app-host"
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react"
import { cn } from "~/lib/utils"
import { useMainStore } from "~/store/main"
import type { ModalProps } from "./modals/mini-app-host"
import { Img as Image } from 'react-image'
import { getFrame } from '~/lib/api'
// import { T_MINI_APP_DATA } from "~/types/stores/store"

// Maximum number of minimized modals allowed
const MAX_MINIMIZED_MODALS = 6

export function ModalManager() {

  const { miniAppToOpen, openMiniApp } = useMainStore()
  const [modals, setModals] = useState<ModalProps[]>([] as ModalProps[])
 
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
      (async () => {
        let miniAppToOpenData = miniAppToOpen
        if(miniAppToOpen?.fetchFrameData) {
          const frameData = (await getFrame({domain: new URL(miniAppToOpen.homeUrl).hostname}))?.result?.frame ?? {}
          miniAppToOpenData = {
            viewerContext: frameData?.viewerContext,
           author: {
            avatarUrl: frameData?.author?.pfp?.url,
            username : frameData?.author?.username,
           },
           homeUrl: frameData?.homeUrl ?? miniAppToOpen.homeUrl,
           iconUrl: frameData?.iconUrl,
           name: frameData?.name,
           splashImageUrl: frameData?.splashImageUrl,
          }
        }
        const newModal = {
          homeUrl: miniAppToOpenData.homeUrl,
          name: miniAppToOpenData.name,
          isOpen: true,
          isMinimized: false,
          onClose: () => handleCloseModal(miniAppToOpenData.homeUrl),
          onMinimize: () => handleMinimizeModal(miniAppToOpenData.homeUrl),
          onMaximize: () => handleMaximizeModal(miniAppToOpenData.homeUrl),
          viewerContext: miniAppToOpenData?.viewerContext,
          iconUrl: miniAppToOpenData.iconUrl,
          splashImageUrl: miniAppToOpenData.splashImageUrl,
          author: miniAppToOpenData.author,
        } as ModalProps
        setModals([...modals, newModal])
      })();
    }
      
    }, [handleCloseModal, handleMaximizeModal, handleMinimizeModal, miniAppToOpen, modals, openMiniApp])


  return (
      <>
      {openModals.map((modal: ModalProps, index: number) => (
        <Modal
          homeUrl={modal.homeUrl}
          key={`opened:${index}:${modal.homeUrl}`}
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
          viewerContext={modal.viewerContext}
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
            {minimizedModals.map((modal: ModalProps, index: number) => (
              <div
                key={`minimized:${index}:${modal.homeUrl}`}
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
   </>
  )
}
