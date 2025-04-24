import { useState, useRef, useEffect, useCallback, useContext } from "react"
import { Search, ArrowLeft, MoreHorizontal, Bell, Archive, Pin, LogOut, RotateCcw, X } from "lucide-react"
import { useMainStore } from "~/store/main"
import { getDirectCastInbox, userByFid } from "~/lib/api"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { timeAgo } from "~/lib/misc"
import { useDebouncedCallback } from "~/hooks/use-debounced-callback"
import { ChatContext } from './chat-context'
import { UserIcon } from '~/components/icons/user'
import { GroupIcon } from '~/components/icons/group'
import { useLocation } from "react-router";
import { Conversation } from "~/types/wc-dc-inbox"
import { useNotifBadgeStore } from "~/store/notif-badge-store"
import { getNewAuthentificatedChat, sendConvoRead } from '~/lib/wc-socket'
import type { TWCDCMessages } from "~/types/wc-dc-messages"


type Chats = Awaited<ReturnType<typeof getDirectCastInbox>>
type Message = TWCDCMessages['result']['messages'][number]
 
export default function ChatSidebar() {

  const { setDcModalOpen, navigate, mainUserData } = useMainStore()
  const { setCurrentConversation, setMessages, messages } = useContext(ChatContext)

  const [showRequests, setShowRequests] = useState(false)
  const [hoveredChat, setHoveredChat] = useState<string | null>(null)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false)

  const chatsSockets = useRef<Record<string, any>>({})

 
  // Refs for scroll containers
  const regularChatsContainerRef = useRef<HTMLDivElement>(null)
  const requestChatsContainerRef = useRef<HTMLDivElement>(null)

  // State for loaded chats
  const [loadedRegularChats, setLoadedRegularChats] = useState<Chats>({} as Chats)
  const [loadedRequestChats, setLoadedRequestChats] = useState<Chats>({} as Chats)
  const [newConversation, setNewConversation] = useState({} as Conversation)

  // Loading states
  const [isLoadingRegular, setIsLoadingRegular] = useState(false)
  const [isLoadingRequests, setIsLoadingRequests] = useState(false)

  // Track if there are more chats to load
  const [hasMoreRegular, setHasMoreRegular] = useState(true)
  const [hasMoreRequests, setHasMoreRequests] = useState(true)
  const [activeChat, setActiveChat] = useState<string | null>('')
  const [initalRegularLoaded, setInitalRegularLoaded] = useState(false)
  
  const location = useLocation()

  const {  setNewDmsCount, newDmsCount } = useNotifBadgeStore()
  


    // useEffect(() => {
    //   (async () => {
    //   if(!activeChat) return
      
    //   const reciverFID = activeChat?.split('-')[1]
    //   if (!reciverFID) return
    //   const user = await userByFid(reciverFID)

    //   const newConvo = {
    //     isGroup: false,
    //     activeChat,
    //     viewerContext: {
    //       counterParty: user?.result?.user
    //     },
    //     adminFids: [] as number[],
    //     name: user?.result?.user?.displayName || '',
    //     photoUrl: user?.result?.user?.pfp?.url,
    //     createdAt: Date.now() - 3000
    //   } as unknown as Conversation

    //   setNewConversation(newConvo)
    //   setCurrentConversation(newConvo)
    // }
    // )()
    // }, [loadedRegularChats?.result?.conversations?.length, activeChat])

    useEffect( () => {
      (async () => {
      const conversationId = location?.pathname?.split('/inbox/')[1]
      if (!conversationId) return
      if (activeChat === conversationId) return
      if (!initalRegularLoaded) return
      setActiveChat(conversationId)
      const conversation = loadedRegularChats?.result?.conversations?.find((conversation: Conversation) => conversation.conversationId === conversationId)
      if(conversation) {
        setCurrentConversation(conversation)
          if(!chatsSockets.current[conversationId]) {
             chatsSockets.current[conversationId] = await getNewAuthentificatedChat({
              token: mainUserData?.authToken || '',
              conversationId,
              onMessage(message) {
                  try {
                    const data = JSON.parse(message)
                    if(data?.messageType === 'refresh-direct-cast-conversation') {
                      const messageObj = data?.payload?.message as Message
                      console.log('refresh-direct-cast-conversation', messageObj)
                      if(messageObj?.conversationId === conversation?.conversationId) {
                        messages.result?.messages?.push(messageObj)
                        setMessages(messages)
                      }
                      const convo = loadedRegularChats?.result?.conversations?.find((conversation: Conversation) => conversation.conversationId === conversation?.conversationId)
                      if(convo) {
                        convo.lastMessage = messageObj
                        convo.viewerContext.unreadCount = 0
                        setCurrentConversation(convo)
                        setLoadedRegularChats({
                          ...loadedRegularChats,
                          result: {
                            ...loadedRegularChats?.result,
                            conversations: loadedRegularChats?.result?.conversations?.map((conversation: Conversation) => {
                              if(conversation?.conversationId === conversationId) {
                                return {
                                  ...conversation,
                                  lastMessage: messageObj,
                                  viewerContext: {
                                    ...conversation?.viewerContext,
                                    unreadCount: 0
                                  }
                                }
                              }
                              return conversation
                            })
                          }
                        })
                      }
                      sendConvoRead({
                        socket: chatsSockets.current[conversationId],
                        conversationId
                      })
                    }
                  } catch (error) {
                    console.log(error)
                  }
              },
            })
          }
          conversation.viewerContext.unreadCount = 0
          setNewDmsCount(newDmsCount - 1)
        return
      } else {
        const reciverFID = conversationId?.split('-')[1]
        if (!reciverFID) return
        const user = await userByFid(reciverFID)

        const newConvo = {
          isGroup: false,
          conversationId,
          viewerContext: {
            counterParty: user?.result?.user
          },
          adminFids: [] as number[],
          name: user?.result?.user?.displayName || '',
          photoUrl: user?.result?.user?.pfp?.url,
          createdAt: Date.now() - 3000
        } as unknown as Conversation

        setNewConversation(newConvo)
        setCurrentConversation(newConvo)
      }
  
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location?.pathname, setCurrentConversation, initalRegularLoaded])

    const fetchInbox = useCallback(async (category: 'default' | 'request' = 'default') => {
      if (isLoadingRegular && category =='default') return
      if (isLoadingRequests && category =='request') return
      if (!hasMoreRegular && category =='default') return
      if (!hasMoreRequests && category =='request') return
      try {
      if (category === 'default') setIsLoadingRegular(true)
      if (category === 'request') setIsLoadingRequests(true)
      const cursor = category === 'default' ? loadedRegularChats?.next?.cursor : loadedRequestChats?.next?.cursor
      const inbox = await getDirectCastInbox({
        cursor,
        category
      })
      if (category === 'default') {
      const hasMore = inbox.next?.cursor ? true : false
      setHasMoreRegular(hasMore)
      const newInbox = {
        next: inbox.next,
        result: {
          ...inbox.result,
          conversations: [...(loadedRegularChats?.result?.conversations ?? []), ...inbox.result.conversations],
        }
      }
      setLoadedRegularChats(newInbox)
      setIsLoadingRegular(false)
      setInitalRegularLoaded(true)
      } else if (category === 'request') {
        const hasMore = inbox.next?.cursor ? true : false
        setHasMoreRequests(hasMore)
        const newInbox = {
          next: inbox.next,
          result: {
            ...inbox.result,
            conversations: [...(loadedRequestChats?.result?.conversations ?? []), ...inbox.result.conversations],
          }
        }
        setLoadedRequestChats(newInbox)
        setIsLoadingRequests(false)
      } 
     } catch (error) {
        category =='default' && setIsLoadingRegular(false)
        category =='request' && setIsLoadingRequests(false)
        setIsLoadingRegular(false)
        console.error("Error fetching default inbox:", error)
      }
    }, [hasMoreRegular, hasMoreRequests, isLoadingRegular, isLoadingRequests, loadedRegularChats, loadedRequestChats?.next?.cursor, loadedRequestChats?.result?.conversations])


  // Initialize with first batch of chats
  useEffect(() => {
      fetchInbox('default')
      fetchInbox('request')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle scroll for regular chats
  const handleRegularChatsScroll = useDebouncedCallback(() => {
    if (!regularChatsContainerRef.current || isLoadingRegular || !hasMoreRegular) return

    const { scrollTop, scrollHeight, clientHeight } = regularChatsContainerRef.current
 
    // If scrolled to bottom (with a small buffer)
    if (scrollHeight - scrollTop - clientHeight < 50 ) {
      fetchInbox('default')
    }
  })

  // Handle scroll for request chats
  const handleRequestChatsScroll = () => {
    if (!requestChatsContainerRef.current || isLoadingRequests || !hasMoreRequests) return

    const { scrollTop, scrollHeight, clientHeight } = requestChatsContainerRef.current

    // If scrolled to bottom (with a small buffer)
    if (scrollHeight - scrollTop - clientHeight < 50) {
       fetchInbox('request')
    }
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
              <button className="text-neutral-400 hover:text-white hover:scale-105" onClick={() => setDcModalOpen(true)}>
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 dark:text-neutral-400 text-neutral-500" size={18} />
              <input
                type="text"
                placeholder="Search"
                className="w-full dark:bg-neutral-800 dark:text-white bg-neutral-200 text-neutral-900 pl-10 pr-4 py-2 rounded-full focus:outline-none"
              />
            </div>
          </div>

          <div className="p-2 flex space-x-2 overflow-x-auto border-b border-neutral-700">
            <button className="px-4 py-1 dark:bg-neutral-800 bg-neutral-300 rounded-full text-sm font-medium">All</button>
            <button className="px-4 py-1 bg-transparent dark:text-neutral-400 text-neutral-500 rounded-full text-sm font-medium">Unread</button>
            <button className="px-4 py-1 bg-transparent dark:text-neutral-400 text-neutral-500 rounded-full text-sm font-medium">Groups</button>
            <button className="px-4 py-1 bg-transparent dark:text-neutral-400 text-neutral-500 rounded-full text-sm font-medium">1:1s</button>
          </div>

          <div
            aria-hidden
            className="p-4 border-b border-neutral-700 flex items-center justify-between cursor-pointer dark:hover:bg-neutral-800 hover:bg-neutral-300"
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
            {newConversation?.viewerContext?.counterParty?.username && 
            <div
            key={newConversation.conversationId}
            className={`p-4 dark:hover:bg-neutral-800 hover:bg-neutral-200 cursor-pointer flex items-start relative text-[0.9rem] ${activeChat === newConversation.conversationId ? 'dark:bg-neutral-800 bg-neutral-200 ' : ''}`}
            onMouseEnter={() => setHoveredChat(newConversation?.conversationId)}
            onMouseLeave={() => setHoveredChat(null)}
            onClick={() => {
              navigate(`/~/inbox/${newConversation?.conversationId}`)
            }}
            aria-hidden
          >                { newConversation?.viewerContext?.counterParty?.pfp?.url ?
            <Avatar className="hover:border-2">
                  <AvatarImage src={newConversation.viewerContext.counterParty.pfp.url} alt={`User ${newConversation?.viewerContext?.counterParty?.username}`} />
                  <AvatarFallback>{newConversation.viewerContext.counterParty.username.slice(0,2)}</AvatarFallback>
            </Avatar>   
            : <UserIcon className="w-8 h-8 ml-1" />}
                             <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between">
                    <span className="font-medium truncate">{ !newConversation?.isGroup ? newConversation?.viewerContext?.counterParty?.username : newConversation?.name}</span>
                    {hoveredChat === newConversation?.conversationId ? (
                      <button
                        onClick={(e) => handleChatMenuClick(newConversation?.conversationId, e)}
                        className="text-neutral-400 hover:text-white"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    ) : (
                      <span className="text-neutral-400 text-sm">{timeAgo(newConversation?.lastMessage?.serverTimestamp ?? 0, true)}</span>
                    )}
                  </div>
                  <p className="text-neutral-400 text-sm truncate">
                    {newConversation?.lastMessage?.type === 'text' && newConversation?.lastMessage?.message}
                    </p>
                </div>

            </div>
            }

            {loadedRegularChats?.result?.conversations.map((chat) => (
              <div
                key={chat.conversationId}
                className={`p-4 dark:hover:bg-neutral-800 hover:bg-neutral-200 cursor-pointer flex items-start relative text-[0.9rem] ${activeChat === chat.conversationId ? 'dark:bg-neutral-800 bg-neutral-200 ' : ''} `}
                onMouseEnter={() => setHoveredChat(chat?.conversationId)}
                onMouseLeave={() => setHoveredChat(null)}
                onClick={() => {
                  navigate(`/~/inbox/${chat?.conversationId}`)
                }}
                aria-hidden
              > 
                {!chat?.isGroup ?
                (chat?.viewerContext?.counterParty?.pfp?.url ?
                <Avatar className="hover:border-2">
                      <AvatarImage src={chat.viewerContext.counterParty.pfp.url} alt={`User ${chat?.viewerContext?.counterParty?.username}`} />
                      <AvatarFallback>{chat.viewerContext.counterParty.username.slice(0,2)}</AvatarFallback>
                </Avatar>   
                : <UserIcon className="w-8 h-8 ml-1" />)
                :
                ( chat.photoUrl ?
                <Avatar className="hover:border-2">
                      <AvatarImage src={chat.photoUrl} alt={`Group ${chat?.name}`} />
                      <AvatarFallback>{chat?.name}</AvatarFallback>
                </Avatar>
                : <GroupIcon className="w-8 h-8 ml-1" />
                )
                }
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between">
                    <span className="font-medium truncate">{ !chat?.isGroup ? chat?.viewerContext?.counterParty?.username : chat?.name}</span>
                    {hoveredChat === chat?.conversationId ? (
                      <button
                        onClick={(e) => handleChatMenuClick(chat?.conversationId, e)}
                        className="text-neutral-400 hover:text-white"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    ) : (
                      <span className="text-neutral-400 text-sm">{timeAgo(chat?.lastMessage?.serverTimestamp ?? 0, true)}</span>
                    )}
                  </div>
                  <p className="text-neutral-400 text-sm truncate">
                    {chat?.lastMessage?.type === 'group_membership_addition' ?
                    `${chat?.lastMessage?.senderContext?.username} has added ${chat?.lastMessage?.actionTargetUserContext?.username ?? `FID: ${chat?.lastMessage?.actionTargetUserContext?.fid}`} to the group`
                      : null}
                      {chat?.lastMessage?.type === 'group_membership_removal' ?
                    `${chat?.lastMessage?.senderContext?.username} has left the group`
                      : null}
                    {chat?.lastMessage?.type === 'text' && chat?.lastMessage?.message}
                    </p>
                  {/* small circle with unread count */}
                  {chat?.viewerContext?.unreadCount > 0 && (
                    <div className="absolute right-0 bottom-4 mt-1 mr-2 flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-xs">
                      {chat?.viewerContext?.unreadCount}
                    </div>
                  )}
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
                      <span className="text-neutral-400 text-sm">{timeAgo(chat?.lastMessage?.serverTimestamp ?? 0, true)}</span>
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

