// import { exposeToIframe  } from '@farcaster/frame-host'
import { exposeToIframe } from '~/vendor/frame-host'
import type { FrameHost } from '@farcaster/frame-core'
import {Img as Image } from 'react-image'
import type React from "react"
import { useRef, useEffect, useState, useCallback  } from "react"
import { X, ChevronDown, MoreHorizontal, ExternalLink, RefreshCw, Bell, Plus, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { cn } from "~/lib/utils"
import { useMainStore } from '~/store/main'
import Loader from '~/components/atomic/loader'
import { getEthersProvider, modal } from '~/lib/wallet'
import { useWeb3ModalAccount, useWeb3Modal  } from '@web3modal/ethers/react'


type ClientContext = FrameHost['context']['client']
type LocationContext  = FrameHost['context']['location']


export interface ModalProps {
  homeUrl: string
  name: string
  splashImageUrl?: string
  iconUrl?: string
  isInstalled?: boolean
  isMinimized: boolean
  isOpen?: boolean
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  isMaxMinimizedReached?: boolean
  children?: React.ReactNode
  className?: string
  author?: {
    username: string
    avatarUrl: string
  }
}

const announceProvider = (endpoint: any) => {
  endpoint.emit({
    event: 'eip6963:announceProvider',
    info: {
      name: 'FC App',
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEBElEQVR4nO2bzUsbQRjGH9NUJRqMYoyVUBKKRYJ4K2gv9ZBLwQR6UwQv/gEW4jkHD54MNJqzYKQ3SyEplIIHpdCABSkiUiqSHIIaUjEhfrUNsYc1X+7O7iT7NVF/IC7vvjPvO88OM7M7k6br62vcZwx6J6A3DwLonYDe3HsBjELGfYuFpuwAgCEATgBPlEupJg4ApAB8A5CUcu7PZHg2QQEkGAPgvrmeqaO8GgRv/q8D+FRLwVoEGAAwCcAMdhpepDIfN4D3AL7TFKQV4BWAN2Cv4bepzM8EYFOqAI0AjdL4SipzFRVBSoAXaLzGFynmnALwk+QkNQ1OojEbX2QGXBuIiAkwpmwuumGGSFvEBHCjsZ9+kRmUp20eJAHs6uSiKwNCRpIAL3E3nn6RGXCrVh4kAWzq5aIbTiEjSYBnKiaiF4LvK/W8C1TREQigc2qq5nInS0vIzc2J+pj9fpg9HjQ7HCXbaTiMXCiErvl5tLvdVPWIIVsANTA4nehZXkbr4CDvXufUVF2CE2PJrSDr8yE1O0u8n/R6kbBacRoOU9fZvbhY1fjCxQWSXq9onHph7oOI2e+HaXi4yna1s4N8LIbLlRUULi4UjcecAB3j4zxb4eysfH1+rmg8pgRo8XhgtFo1jcmUAK2jo5rHZEqAx319msfUbBrM+nzI+nyiPsbeXo2yqYipeUQRjDbpFXjS5VI2pqK1EbDv7ZUGt4TGg5wUTI0BhrY2zWOq3gPskQi1r8FkUjETQkzNIzKG6gIkvV7k02kqX6WXuTQw1QOUXubSwJQAeqCJAEmXCwmrVXIKzKdSVPUZR0bgSKfhSKdh9vtl5cZUD8gfH1P5PeruViwmUwL8Ozyk8jN0dSkWkykBrjY2qPyah8pfuAvZrKyYTAnwJxqlmgpbnj8vXV/WsNASgikBACC7tsazGdrby9dOZ+mT2d9EAoV4XFY85gTIhUK8hVPr0BAMTm5fo2d5uewbjcqOJ1uAjkAAtoUF4n17JFLTVFWIx3E8PV0lgsFkwtOtLTjS6dLX4rP1dVn7AaW6ZdegAvlYDEmXC6fhMG9MuNrdxcnSEn5PTCgSq0norPC+xfIOd2tzFACC/ZnM29tGJnuAljwIQLAfaZqFNhwIGUkCyJtc2UTwTYskwA7Kx0/vAkFw54l5kAQgnqtrYAQPU4sNgl9wN3pBENwhakHEBPgMIKd4OvpAPEEuNQ2uorF7QRCA6MkMKQF+AfiIxhQhCOADgG0xJ5qNkcrT1o2yPC42/quUI+3O0CaqxwNWhQiCy3MVXO+VpJatse2bv9cVNlaEqPsnM6S3QZqydnBHam3Q72DlEbhV6w9QPHGhH00JCnCfeHgb1DsBvXkQQO8E9OY/OpX1l5WuDyYAAAAASUVORK5CYII=',
      rdns: 'dev.pages.fc-app',
      uuid: '8017453f-c0ba-4134-a722-008d1d0f76a2',
    },
  })
}

export function Modal({
  homeUrl,
  name,
  isOpen,
  splashImageUrl = "",
  isInstalled = false,
  iconUrl = "",
  author,
  isMinimized,
  onClose,
  onMinimize,
  onMaximize,
  isMaxMinimizedReached = false,
  children,
  className,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [showSplash, setShowSplash] = useState(true)
  const frameHostRef = useRef<FrameHost | null>(null)
  const frameEndpoint= useRef<ReturnType<typeof exposeToIframe> | null>(null)
  
  const { navigate, mainUserData, isUserLoggedIn } = useMainStore()
  const { open } = useWeb3Modal()
  const { isConnected } = useWeb3ModalAccount()

  const navigateToProfile = (authorUsername: string) => {
    onMinimize()
    navigate(`/${authorUsername}`)
  }

  const getWalletProvider = useCallback(async () => {
            if (!isConnected) {
                await open()
                let promiseClose: () => void = () => {}
                new Promise((resolve) => {
                    promiseClose = resolve as () => void
                })
                modal.subscribeState((state) => {
                    if (state.open === false) {
                        promiseClose()
                    }
                })
                promiseClose()
                if (!isConnected) {
                    return null as unknown as ReturnType<typeof getEthersProvider>
                }
            }
            const provider = getEthersProvider(modal.getWalletProvider()) as any
            
            return provider.provider
   }, [isConnected, open])

  const createOrModifyFrameHost = useCallback(async () => {
    if (!isUserLoggedIn) return
    if (!mainUserData?.fid) return
    if (!frameHostRef.current) {
      frameHostRef.current = {
        context: {
          location: null as unknown as LocationContext,
          client: null as unknown as ClientContext,
          user: {
            fid: mainUserData?.fid || 0,
            displayName: mainUserData?.displayName || "",
            pfpUrl: mainUserData?.avatar || "",
            username: mainUserData?.username || "",
            location: {
              description: "Anonymous",
              placeId: "Unknown",
            }
          }
        },
        ready: (options) => {
          console.log('Frame host ready', options)
          setShowSplash(false)
        },
        close: () => {
          console.log('Frame host close')
        },
        openUrl: (url) => {
          console.log('Frame host openUrl', url)
        },
        signIn: async() => {
          console.log('Frame host signIn')
          return 'later' as any
        },
        viewProfile: async (fid) => {
          console.log('Frame host viewProfile', fid)
        },
        addFrame: async () => {
          console.log('Frame host addFrame')
          return 'later' as any
        },
        setPrimaryButton: async (button) => {
          console.log('Frame host setPrimaryButton', button)
        },
        eip6963RequestProvider: () => {
          announceProvider(frameEndpoint.current)
          console.log('Frame host eip6963RequestProvider')
        },
        ethProviderRequest: async (request) => {
          console.log('Frame host ethProviderRequest', request)
          return 'later' as any
        },
        ethProviderRequestV2: async (request) => {
          console.log('Frame host ethProviderRequestV2', request)
          return 'later' as any
        },
        swap: async (swap) => {
          console.log('Frame host swap', swap)
          return 'later' as any
        },
        viewToken: async (token) => {
          console.log('Frame host viewToken', token)
          return 'later' as any
        },
        composeCast: async (cast) => {
          console.log('Frame host composeCast', cast)
          return 'later' as any
        }
      }
      console.log('Frame host created', frameHostRef.current)
      frameEndpoint.current = exposeToIframe({
        frameOrigin: window.location.origin,
        sdk: frameHostRef.current as any,
        iframe: iframeRef.current!,
        ethProvider: window.ethereum as any,
      })
   } else {
     if(mainUserData?.fid !== frameHostRef.current?.context.user.fid) {
      frameHostRef.current.context.user.fid = mainUserData?.fid
      frameHostRef.current.context.user.displayName = mainUserData?.displayName || ""
      frameHostRef.current.context.user.pfpUrl = mainUserData?.avatar || ""
      frameHostRef.current.context.user.username = mainUserData?.username || ""
     }
   }

  }, [isUserLoggedIn, mainUserData?.fid, mainUserData?.displayName, mainUserData?.avatar, mainUserData?.username])

  useEffect(() => {
    if(!isUserLoggedIn) return
    if (!iframeRef.current) return
    
    // setTimeout(() => {
    //   getWalletProvider()
    // }, 5000);
    createOrModifyFrameHost()
  }, [createOrModifyFrameHost, isUserLoggedIn, iframeRef])

  return (
    <>
      {!isMinimized && (
        <div
          className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/50", className)}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              // If we've reached the maximum number of minimized modals, close instead of minimize
              if (isMaxMinimizedReached) {
                onClose()
              } else {
                onMinimize()
              }
            }
          }}
        >
          <div
            ref={modalRef}
            className="w-full md:max-w-lg lg:max-w-xl rounded-lg bg-background shadow-lg flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between bg-neutral-900 text-white p-3 rounded-t-lg">
              <div className="flex items-center gap-2">
                <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>
                <button
                  onClick={onMinimize}
                  className={cn(
                    "text-white/80 hover:text-white transition-colors",
                    isMaxMinimizedReached && "opacity-50 cursor-not-allowed",
                  )}
                  disabled={isMaxMinimizedReached}
                  title={isMaxMinimizedReached ? "Maximum number of minimized apps reached" : "Minimize"}
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col items-center -ml-6">
                <h2 className="text-lg font-medium">{name}</h2>
                 {author?.username && <div className="flex items-center">
                 <p className="text-xs text-white/70 inline">
                 By <span className="text-white cursor-pointer" onClick={() => navigateToProfile(author?.username)} aria-hidden role='button'>{author?.username}</span></p>
                 <Image src={author?.avatarUrl as string} alt={author?.username} className="h-4 w-4 rounded-full ml-2 inline-block" />
                 </div>
                 }
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-white/80 hover:text-white transition-colors">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Copy link
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reload page
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    Turn on notifications
                  </DropdownMenuItem>
                  {isInstalled ? (
                    <DropdownMenuItem className="text-red-500">
                      <Trash className="mr-2 h-4 w-4" />
                      Remove Mini App
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Mini App
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-auto md:min-h-[30rem] lg:min-h-[50rem]">
                  {showSplash && <div className="relative w-full h-full flex items-center justify-center flex-col">
                    <Image src={iconUrl} alt={name} className="inset-0 object-cover w-14 h-14 mb-4 mt-14" />
                    <Loader />
                  </div>
                  }
                  <iframe ref={iframeRef} src={homeUrl} className="w-full h-full" title={name} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
