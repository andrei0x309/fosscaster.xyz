import { useState, useRef, useEffect, useCallback } from "react"
import { Search, ArrowLeft, MoreHorizontal, Bell, Archive, Pin, LogOut, RotateCcw, X } from "lucide-react"
import { useMainStore } from "~/store/main"
import { getDirectCastInbox  } from "~/lib/api"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { timeAgo } from "~/lib/misc"

type Chats = Awaited<ReturnType<typeof getDirectCastInbox>>
 
export default function ChatSidebar() {

  const { setDcModalOpen, isUserLoggedIn } = useMainStore()

  const [showRequests, setShowRequests] = useState(false)
  const [hoveredChat, setHoveredChat] = useState<string | null>(null)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false)

  // Refs for scroll containers
  const regularChatsContainerRef = useRef<HTMLDivElement>(null)
  const requestChatsContainerRef = useRef<HTMLDivElement>(null)

  // State for loaded chats
  const [loadedRegularChats, setLoadedRegularChats] = useState<Chats>({} as Chats)
  const [loadedRequestChats, setLoadedRequestChats] = useState<Chats>({} as Chats)

  // Loading states
  const [isLoadingRegular, setIsLoadingRegular] = useState(false)
  const [isLoadingRequests, setIsLoadingRequests] = useState(false)

  // Track if there are more chats to load
  const [hasMoreRegular, setHasMoreRegular] = useState(true)
  const [hasMoreRequests, setHasMoreRequests] = useState(true)

  const [initialRegularChatsLoaded, setInitialRegularChatsLoaded] = useState(false)
  const [initialRequestChatsLoaded, setInitialRequestChatsLoaded] = useState(false)

  // Page tracking
  const regularPageRef = useRef(1)
  const requestPageRef = useRef(1)

//   // Initial chat data
//   const initialRegularChats: RegularChat[] = [
//     { id: 1, name: "dddddddii", message: "You: test", time: "7:10 PM" },
//     { id: 2, name: "geoffgolberg", message: "This dude gets it", time: "3/28/25" },
//     {
//       id: 3,
//       name: "Devs: Composer Actions",
//       message: "You: @horsefacts.eth @deodad Is there any reason why...",
//       time: "3/27/25",
//     },
//     { id: 4, name: "ccarella.eth", message: "awesome thanks", time: "3/12/25" },
//     {
//       id: 5,
//       name: "Devs: Channel API Preview",
//       message: "dwr.eth: https://warpcast.com/dwr.eth/0xe3f18321...",
//       time: "2/15/25",
//     },
//     { id: 6, name: "airstack.eth", message: "You: https://moxie-frames.airstack.xyz/mb", time: "2/15/25" },
//     { id: 7, name: "Scout Cast x Andrei0x309", message: "", time: "12/6/24" },
//     { id: 8, name: "v", message: "", time: "1/23/25" },
//     {
//       id: 9,
//       name: "samuelhuber.eth",
//       message: "You: Merry Christmas, may you have a much better...",
//       time: "12/26/24",
//     },
//     {
//       id: 10,
//       name: "sunlight = the best disinfectant",
//       message: "geoffgolberg: Hope Zinger accepts the challenge..",
//       time: "12/6/24",
//     },
//   ]

    const fetchInbox = useCallback(async (category: 'default' | 'request' = 'default') => {
      console.log('fetchInbox', category)
      if (isLoadingRegular && category =='default') return
      if (isLoadingRequests && category =='request') return
      try {
      category =='default' && setIsLoadingRegular(true)
      category =='request' && setIsLoadingRequests(true)
      const cursor = category =='default' ? loadedRegularChats?.next?.cursor : loadedRequestChats?.next?.cursor
      const inbox = await getDirectCastInbox({
        cursor,
        category
      })
      if (category =='default') {
      setLoadedRegularChats( (prev) => {
           if (!inbox.next) {
              setHasMoreRegular(false)
            }
            setIsLoadingRegular(false)
            return {
              next: inbox.next,
              result: {
                ...inbox.result,
                conversations: [...(prev?.result?.conversations ?? []), ...inbox.result.conversations],
              }
            }
          })
      } else {
        setLoadedRequestChats( (prev) => {
          if (!inbox.next) {
            setHasMoreRequests(false)
          }
          setIsLoadingRequests(false)
          return {
            next: inbox.next,
            result: {
              ...inbox.result,
              conversations: [...(prev?.result?.conversations ?? []), ...inbox.result.conversations],
            }
          }
        })
      } 
     } catch (error) {
        category =='default' && setIsLoadingRegular(false)
        category =='request' && setIsLoadingRequests(false)
        console.error("Error fetching default inbox:", error)
      }
      finally {
        category =='default' && setIsLoadingRegular(false)
        category =='request' && setIsLoadingRequests(false)
        setIsLoadingRegular(false)
      }
    }, [isLoadingRegular, isLoadingRequests, loadedRegularChats?.next?.cursor, loadedRequestChats?.next?.cursor])

//   const initialRequestChats: RequestChat[] = [
//     { id: 101, name: "tesseractx", message: "", time: "", followers: 0 },
//     { id: 102, name: "rhodelle", message: "", time: "", followers: 3 },
//     { id: 103, name: "tanukipay", message: "", time: "2/24/25", followers: 3 },
//     { id: 104, name: "tozya89", message: "", time: "2/23/25", followers: 0 },
//     { id: 105, name: "hyperbot", message: "", time: "1/16/25", followers: 24, automated: true },
//     { id: 106, name: "event", message: "", time: "1/7/25", followers: 66, automated: true },
//     { id: 107, name: "wira.eth", message: "", time: "12/19/24", followers: 21 },
//     { id: 108, name: "spotlight", message: "", time: "12/16/24", followers: 82, automated: true },
//     { id: 109, name: "0xbcd", message: "", time: "12/12/24", followers: 8, automated: true },
//     { id: 110, name: "openion", message: "", time: "11/26/24", followers: 0 },
//   ]

  // Initialize with first batch of chats
  useEffect(() => {
    if(!isUserLoggedIn) return
    if(!loadedRegularChats?.result?.conversations.length && !initialRegularChatsLoaded) {
      setInitialRegularChatsLoaded(true)
      fetchInbox('default')
    }
    if(!loadedRequestChats?.result?.conversations.length  && !initialRequestChatsLoaded) {
      setInitialRequestChatsLoaded(true)
      fetchInbox('request')
    }
  }, [fetchInbox, initialRegularChatsLoaded, initialRequestChatsLoaded, isUserLoggedIn, loadedRegularChats, loadedRequestChats])

  // Handle scroll for regular chats
  const handleRegularChatsScroll = () => {
    if (!regularChatsContainerRef.current || isLoadingRegular || !hasMoreRegular) return

    const { scrollTop, scrollHeight, clientHeight } = regularChatsContainerRef.current

    // If scrolled to bottom (with a small buffer)
    if (scrollHeight - scrollTop - clientHeight < 50) {
      loadMoreRegularChats()
    }
  }

  // Handle scroll for request chats
  const handleRequestChatsScroll = () => {
    if (!requestChatsContainerRef.current || isLoadingRequests || !hasMoreRequests) return

    const { scrollTop, scrollHeight, clientHeight } = requestChatsContainerRef.current

    // If scrolled to bottom (with a small buffer)
    if (scrollHeight - scrollTop - clientHeight < 50) {
      loadMoreRequestChats()
    }
  }

  // Load more regular chats
  const loadMoreRegularChats = () => {
    if (isLoadingRegular) return
    setIsLoadingRegular(true)
    fetchInbox('default')
  }

  // Load more request chats
  const loadMoreRequestChats = () => {
    if (isLoadingRequests) return
    setIsLoadingRequests(true)
    // fetchInbox('request')
  }

  const handleChatMenuClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveMenu(activeMenu === id ? null : id)
  }

  const handleMenuAction = (action: string, chatId: string) => {
    console.log(`Performed ${action} on chat ${chatId}`)
    setActiveMenu(null)
  }

  // Close menu when clicking outside
  const handleClickOutside = () => {
    setActiveMenu(null)
    setHeaderMenuOpen(false)
  }

  return (
    <div className="w-80 border-r border-neutral-700 flex flex-col h-full overflow-hidden">
      {!showRequests ? (
        <>
          <div className="p-4 flex items-center justify-between border-b border-neutral-700 relative">
            <h1 className="text-xl font-bold">Direct casts</h1>
            <div className="flex gap-2">
              <button
                className="text-neutral-400 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation()
                  setHeaderMenuOpen(!headerMenuOpen)
                }}
              >
                <MoreHorizontal size={20} />
              </button>
              <button className="text-neutral-400 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>

            {/* Header Menu */}
            {headerMenuOpen && (
              <div className="absolute right-4 top-12 bg-neutral-800 rounded-md shadow-lg z-10 w-48 overflow-hidden">
                <button
                  onClick={() => {
                    handleMenuAction("archived", "0")
                    setHeaderMenuOpen(false)
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-neutral-700 border-b border-neutral-700"
                >
                  Archived
                </button>
                <button
                  onClick={() => {
                    handleMenuAction("settings", "0")
                    setHeaderMenuOpen(false)
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-neutral-700"
                >
                  Settings
                </button>
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-neutral-800 text-white pl-10 pr-4 py-2 rounded-full focus:outline-none"
              />
            </div>
          </div>

          <div className="p-2 flex space-x-2 overflow-x-auto border-b border-neutral-700">
            <button className="px-4 py-1 bg-neutral-800 rounded-full text-sm font-medium">All</button>
            <button className="px-4 py-1 bg-transparent text-neutral-400 rounded-full text-sm font-medium">Unread</button>
            <button className="px-4 py-1 bg-transparent text-neutral-400 rounded-full text-sm font-medium">Groups</button>
            <button className="px-4 py-1 bg-transparent text-neutral-400 rounded-full text-sm font-medium">1:1s</button>
          </div>

          <div
            aria-hidden
            className="p-4 border-b border-neutral-700 flex items-center justify-between cursor-pointer hover:bg-neutral-800"
            onClick={() => setShowRequests(true)}
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M7 10h10" />
                <path d="M7 14h10" />
              </svg>
              <span className="font-medium">Requests</span>
            </div>
            <span className="text-neutral-400">{loadedRegularChats?.result?.requestsCount || 0}</span>
          </div>

          <div
            aria-hidden
            ref={regularChatsContainerRef}
            className="overflow-y-auto flex-1 scrollbar-thin"
            onClick={handleClickOutside}
            onScroll={handleRegularChatsScroll}
          >
            {loadedRegularChats?.result?.conversations.map((chat) => (
              <div
                key={chat.conversationId}
                className="p-4 hover:bg-neutral-800 cursor-pointer flex items-start relative"
                onMouseEnter={() => setHoveredChat(chat?.conversationId)}
                onMouseLeave={() => setHoveredChat(null)}
              >
                <Avatar className="hover:border-2">
                      <AvatarImage src={chat?.viewerContext?.counterParty?.pfp?.url} alt={`User ${chat?.viewerContext?.counterParty?.username}`} />
                      <AvatarFallback>{chat?.viewerContext?.counterParty?.username.slice(0,2)}</AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between">
                    <span className="font-medium truncate">{chat?.viewerContext?.counterParty?.username}</span>
                    {hoveredChat === chat?.conversationId ? (
                      <button
                        onClick={(e) => handleChatMenuClick(chat?.conversationId, e)}
                        className="text-neutral-400 hover:text-white"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    ) : (
                      <span className="text-neutral-400 text-sm">{timeAgo(new Date(chat?.lastMessage?.serverTimestamp ?? chat.createdAt).toISOString())}</span>
                    )}
                  </div>
                  <p className="text-neutral-400 text-sm truncate">{chat?.lastMessage?.message}</p>
                </div>

                {/* Regular Chat Menu */}
                {activeMenu === chat.conversationId && (
                  <div className="absolute right-4 top-12 bg-neutral-800 rounded-md shadow-lg z-10 w-48 overflow-hidden">
                    <button
                      onClick={() => handleMenuAction("pin", chat.conversationId)}
                      className="w-full px-4 py-3 text-left flex items-center hover:bg-neutral-700 border-b border-neutral-700"
                    >
                      <Pin size={16} className="mr-2" />
                      <span>Pin</span>
                    </button>
                    <button
                      onClick={() => handleMenuAction("archive", chat.conversationId)}
                      className="w-full px-4 py-3 text-left flex items-center hover:bg-neutral-700 border-b border-neutral-700"
                    >
                      <Archive size={16} className="mr-2" />
                      <span>Archive</span>
                    </button>
                    <button
                      onClick={() => handleMenuAction("mute", chat.conversationId)}
                      className="w-full px-4 py-3 text-left flex items-center hover:bg-neutral-700 border-b border-neutral-700"
                    >
                      <Bell size={16} className="mr-2" />
                      <span>Mute chat</span>
                    </button>
                    <button
                      onClick={() => handleMenuAction("mark-unread", chat.conversationId)}
                      className="w-full px-4 py-3 text-left flex items-center hover:bg-neutral-700 border-b border-neutral-700"
                    >
                      <RotateCcw size={16} className="mr-2" />
                      <span>Mark unread</span>
                    </button>
                    <button
                      onClick={() => handleMenuAction("leave", chat.conversationId)}
                      className="w-full px-4 py-3 text-left flex items-center hover:bg-neutral-700 text-red-500"
                    >
                      <LogOut size={16} className="mr-2" />
                      <span>Leave</span>
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator for regular chats */}
            {isLoadingRegular && (
              <div className="p-4 text-center">
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] text-neutral-400"></div>
              </div>
            )}

            {/* End of list message */}
            {!hasMoreRegular && !isLoadingRegular && (
              <div className="p-4 text-center text-neutral-500 text-sm">No more chats to load</div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="p-4 flex items-center justify-between border-b border-neutral-700">
            <div className="flex items-center">
              <button className="mr-2 text-white hover:text-neutral-300" onClick={() => setShowRequests(false)}>
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-bold">Requests</h1>
            </div>
            <div className="flex gap-2">
              <button className="text-neutral-400 hover:text-white">
                <MoreHorizontal size={20} />
              </button>
              <button className="text-neutral-400 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>
          </div>

          <div
            aria-hidden
            ref={requestChatsContainerRef}
            className="overflow-y-auto flex-1 scrollbar-thin"
            onClick={handleClickOutside}
            onScroll={handleRequestChatsScroll}
          >
            {loadedRequestChats?.result?.conversations.map((chat) => (
              <div
                key={chat.conversationId}
                className="p-4 hover:bg-neutral-800 cursor-pointer flex items-start relative"
                onMouseEnter={() => setHoveredChat(chat.conversationId)}
                onMouseLeave={() => setHoveredChat(null)}
              >
                <Avatar className="hover:border-2">
                      <AvatarImage src={chat?.viewerContext?.counterParty?.pfp?.url} alt={`User ${chat?.viewerContext?.counterParty?.username}`} />
                      <AvatarFallback>{chat?.viewerContext?.counterParty?.username.slice(0,2)}</AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between">
                    <span className="font-medium truncate">{chat.viewerContext.counterParty.username}</span>
                    {hoveredChat === chat.conversationId ? (
                      <button
                        onClick={(e) => handleChatMenuClick(chat.conversationId, e)}
                        className="text-neutral-400 hover:text-white"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    ) : (
                      <span className="text-neutral-400 text-sm">{timeAgo(new Date(chat?.lastMessage?.serverTimestamp ?? chat.createdAt).toISOString())}</span>
                    )}
                  </div>
                  {chat.viewerContext?.counterParty?.viewerContext?.followersYouKnow?.totalCount > 0 && (
                    <div className="flex items-center mt-1">
                      <div className="flex -space-x-1 mr-2">
                        <div className="w-4 h-4 rounded-full bg-purple-500 border border-neutral-800"></div>
                        <div className="w-4 h-4 rounded-full bg-blue-500 border border-neutral-800"></div>
                      </div>
                      <p className="text-neutral-400 text-xs">{chat.viewerContext?.counterParty?.viewerContext?.followersYouKnow?.totalCount} mutual followers</p>
                    </div>
                  )}
                  {chat?.viewerContext?.tag === "automated" && (
                    <div className="mt-1">
                      <span className="bg-neutral-700 text-xs px-2 py-0.5 rounded-full text-neutral-300">Automated</span>
                    </div>
                  )}
                </div>

                {/* Request Chat Menu */}
                {activeMenu === chat.conversationId && (
                  <div className="absolute right-4 top-12 bg-neutral-800 rounded-md shadow-lg z-10 w-48 overflow-hidden">
                    <button
                      onClick={() => handleMenuAction("delete", chat.conversationId)}
                      className="w-full px-4 py-3 text-left flex items-center hover:bg-neutral-700 text-red-500"
                    >
                      <X size={16} className="mr-2" />
                      <span>Delete</span>
                    </button>
                    <button
                      onClick={() => handleMenuAction("mute-user", chat.conversationId)}
                      className="w-full px-4 py-3 text-left flex items-center hover:bg-neutral-700 text-red-500"
                    >
                      <Bell size={16} className="mr-2" />
                      <span>Mute user</span>
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator for request chats */}
            {isLoadingRequests && (
              <div className="p-4 text-center">
                <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] text-neutral-400"></div>
              </div>
            )}

            {/* End of list message */}
            {!hasMoreRequests && !isLoadingRequests && (
              <div className="p-4 text-center text-neutral-500 text-sm">No more requests to load</div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

