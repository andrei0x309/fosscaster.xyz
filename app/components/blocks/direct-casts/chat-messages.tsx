import { useState, useRef, useEffect, forwardRef, useContext } from "react"
import { MoreHorizontal, ThumbsUp, Heart, Plus, Copy, Reply, Smile } from "lucide-react"
// import { dcGetMessages } from '~/lib/api'
import { ChatContext } from './chat-context'
import type { TWCDCMessages } from "~/types/wc-dc-messages"
import { useMainStore } from "~/store/main"
import { timeAgo } from "~/lib/misc"
import { Conversation } from "~/types/wc-dc-inbox"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Link } from "react-router";
import { Img as Image } from 'react-image'


interface ChatMessagesProps {
  loadMoreMessages: () => void
}

// Use forwardRef to accept the ref from parent
// eslint-disable-next-line no-empty-pattern
const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(({ loadMoreMessages }, ref) => {
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null)
  const [showMenu, setShowMenu] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const messagesContainerRef = ref as React.RefObject<HTMLDivElement>
  const loadingRef = useRef<HTMLDivElement>(null)
  const hasInitialScrolledRef = useRef(false)
  const shouldCheckScrollRef = useRef(false)
  const [prevConversation, setPrevConversation] = useState({} as Conversation)

  const { currentConversation, messages, hasMoreMessages } = useContext(ChatContext)
  const [allMessages, setAllMessages] = useState<TWCDCMessages>(messages)

  const { mainUserData } = useMainStore()

  const {setLightBoxOpen, setLightBoxSrc } = useMainStore()

  const onImageClick = (src: string) => {
    setLightBoxSrc(src)
    setLightBoxOpen(true)
  }


  // Initialize with the provided messages
  useEffect(() => {
    if(!messagesContainerRef?.current) return
    if(prevConversation?.conversationId !== currentConversation?.conversationId) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
      setPrevConversation(currentConversation)
    } else {
      setIsLoading(true)
      const scrollContainer = messagesContainerRef.current
      const prevScrollHeight = scrollContainer?.scrollHeight || 0
      const prevScrollTop = scrollContainer?.scrollTop || 0
 
      requestAnimationFrame(() => {
        if (scrollContainer) {
          const newScrollHeight = scrollContainer.scrollHeight
          scrollContainer.scrollTop = prevScrollTop + (newScrollHeight - prevScrollHeight)
        }
        setIsLoading(false)
      })

    }

    setAllMessages(messages)
    // Scroll to the bottom of the container
    
  }, [currentConversation, messages, messagesContainerRef, prevConversation?.conversationId])
  

  // Scroll to bottom on initial load and when new messages are added
  useEffect(() => {
    if (messagesContainerRef.current && !hasInitialScrolledRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
      hasInitialScrolledRef.current = true
      // Wait a bit before enabling scroll checks to prevent immediate loading
      setTimeout(() => {
        shouldCheckScrollRef.current = true
      }, 1000)
    }
  }, [allMessages, messagesContainerRef])

  // Handle scroll event to detect when user scrolls to top
  const handleScroll = () => {
    if (!shouldCheckScrollRef.current || isLoading) return

    const container = messagesContainerRef.current
    if (container && container.scrollTop < 50) {
      loadOlderMessages()
    }
  }

  const loadOlderMessages = () => {
      if (!hasMoreMessages) {
          setIsLoading(false)
          return
        }
        loadMoreMessages()
  }

  const handleReactionClick = (messageId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setShowEmojiPicker(showEmojiPicker === messageId ? null : messageId)
    setShowMenu(null)
  }

  const handleMenuClick = (messageId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(showMenu === messageId ? null : messageId)
    setShowEmojiPicker(null)
  }

  const handleAddReaction = (messageId: string, emoji: string) => {
    // Here you would add the reaction to the message
    console.log(`Added ${emoji} reaction to message ${messageId}`)
    setShowEmojiPicker(null)
  }

  const handleMenuAction = (action: string, messageId: number) => {
    console.log(`Performed ${action} on message ${messageId}`)
    setShowMenu(null)
  }

  // Close menus when clicking outside
  const handleClickOutside = () => {
    setShowEmojiPicker(null)
    setShowMenu(null)
  }

  return (
    <div
      ref={messagesContainerRef as React.RefObject<HTMLDivElement>}
      className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin"
      onClick={handleClickOutside}
      onScroll={handleScroll}
      style={{ maxHeight: "calc(100vh - 140px)" }}
      aria-hidden
    >
      {/* Loading indicator at the top */}
      <div ref={loadingRef} className="py-2 text-center">
        {isLoading && (
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] text-neutral-400"></div>
        )}
      </div>

      {/* Messages */}
      {allMessages?.result?.messages.map((message, index) => (
        <>
    { message?.type === "group_membership_addition" && (
      <div className="mb-2 mx-auto">
        <div className="rounded-[11px] px-2.5 py-1 shadow-sm dark:bg-neutral-700/40 bg-neutral-300/40 mx-auto max-w-fit">
          <div className="line-clamp-2 text-center text-[11px]">
        <span className="flex flex-row gap-x-1 justify-center content-center">
        <span><Link to={`/${message?.senderContext?.username ?? `!${message?.actionTargetUserContext?.fid}`}`} className="relative hover:underline keychainify-checked">{message?.senderContext?.username}</Link></span> has added
        <Link className="relative hover:underline keychainify-checked" title="" to={`/${message?.message}`}>
        {message?.actionTargetUserContext?.username ?? `FID: ${message?.actionTargetUserContext?.fid}`}
        </Link></span>
      </div></div></div>
    )}

    { message?.type === "group_membership_removal" && (
      <div className="mb-2 mx-auto">
        <div className="rounded-[11px] px-2.5 py-1 shadow-sm dark:bg-neutral-700/40 bg-neutral-300/40 mx-auto max-w-fit">
          <div className="line-clamp-2 text-center text-[11px]">
        <span className="flex flex-row gap-x-1 justify-center content-center">
        <span><Link to={`/${message?.senderContext?.username ?? `!${message?.actionTargetUserContext?.fid}`}`} className="relative hover:underline keychainify-checked">{message?.senderContext?.username}</Link></span> has left
        </span>
      </div></div></div>
    )}


    { message?.type === "text" && 
    <div
          key={message.messageId}
          className={`flex flex-col ${message.senderFid === mainUserData?.fid ? "" : ""} items-start relative max-w-full`}
          onMouseEnter={() => setHoveredMessage(message.messageId)}
          onMouseLeave={() => setHoveredMessage(null)}
        >
          {message?.senderFid !== allMessages?.result?.messages?.[index - 1]?.senderFid && (
            <div className="flex items-center dark:bg-neutral-900 bg-zinc-300 rounded-t-lg p-2"
            style={{ maxWidth: "calc(100% - 50px)" }} 
            >
                <Link to={`/${message?.senderContext?.username}`} className="flex items-center">
                <Avatar className="hover:border-2 h-8 w-8">
                      <AvatarImage src={message?.senderContext?.pfp?.url} alt={`User ${message?.senderContext?.username}`} />
                      <AvatarFallback>{message?.senderContext?.username.slice(0,2)}</AvatarFallback>
                </Avatar>
                </Link>
              <div className="ml-2 flex flex-col">
              <span className="font-medium dark:text-neutral-200 text-neutral-900">{message?.senderContext?.username}</span>
              <span className="dark:text-neutral-400 text-neutral-700 text-xs ml-2">{timeAgo(message?.serverTimestamp ?? 0)}</span>
              </div>
            </div>
          )}

          <div className="flex items-end">
            {/* Message bubble with fixed width to prevent shifting */}
            <div
              className={`rounded-lg px-4 py-2 break-words break-all rounded-tl-none ${
                message.senderFid === mainUserData?.fid ? "dark:bg-indigo-800 dark:text-white bg-indigo-300 text-neutral-900" : "dark:bg-neutral-800 dark:text-white text-neutral-900 bg-neutral-200 border-neutral-400/40 border-[1px]"
              }`}
              style={{ maxWidth: "calc(100vw - 50px)" }} // Reserve space for icons
            >
              
              {message?.inReplyTo && <div className="relative mb-2 flex w-full flex-row rounded-md cursor-pointer bg-reply-direct-cast dark:bg-neutral-900 bg-neutral-100 border-neutral-400/40 border-[1px]">
                <div className="w-2 rounded-l-md bg-reply-direct-cast-left-wrapper bg-reply-direct-cast border-[1px] border-neutral-400/40 dark:bg-indigo-800 bg-indigo-300"></div>
                <div className="flex w-full flex-col justify-start p-2"><div className="mb-1 flex flex-row gap-x-1 text-xs font-semibold text-default">
                  <Link className="relative inline-block h-min shrink-0 keychainify-checked" to="/mjc716">
                  <div className="flex flex-none items-center justify-center rounded-full bg-gradient-to-b from-[#DEAEEB] to-[#6944BA] relative mr-1" 
                  style={{width: '16px', height: '16px', minWidth: '16px', minHeight: '16px'}}>
                    
                    <Avatar className="hover:border-2 h-5 w-5 aspect-square shrink-0 rounded-full object-cover">
                      <AvatarImage src={message?.inReplyTo?.senderContext?.pfp?.url} alt={`User ${message?.senderContext?.username}`} />
                      <AvatarFallback>{message?.senderContext?.username.slice(0,2)}</AvatarFallback>
                </Avatar>

                    </div></Link><div className="opacity-75">{message?.inReplyTo?.senderContext?.username}</div>
                    <div className="text-xs opacity-75 text-default">·</div><div className="text-xs opacity-75 text-default">{timeAgo(message?.inReplyTo?.serverTimestamp ?? 0)}</div></div>
                    <div className="line-clamp-2 break-gracefully text-default max-w-[24rem]">
                {message?.inReplyTo?.message}
                </div></div></div>
                  }
              
              {message.message}
              {(message?.metadata?.medias ?? []).map((media, index) => (
                <div key={index} className="mt-2">
                  {media.mimeType?.includes("image") && (
                    <Image
                      src={media?.staticRaster}
                      alt={`Media ${index}`}
                      className="max-w-full max-h-60 object-contain cursor-pointer"
                      onClick={() => onImageClick(media?.staticRaster)}
                    />
                  )}
                </div>
              ))}
             <div className="text-xs text-neutral-400 mx-auto text-right">
              {timeAgo(message?.serverTimestamp ?? 0)}
            </div>
            </div>

            {/* Action buttons with fixed width space */}
            <div
              className={`ml-2 flex space-x-1 w-[50px] transition-opacity duration-200 ${
                hoveredMessage === message.messageId ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <button
                onClick={(e) => handleReactionClick(message.messageId, e)}
                className="p-1 rounded-full hover:bg-neutral-700 text-neutral-400 hover:text-white"
              >
                <Smile size={16} />
              </button>
              <button
                onClick={(e) => handleMenuClick(message.messageId, e)}
                className="p-1 rounded-full hover:bg-neutral-700 text-neutral-400 hover:text-white"
              >
                <MoreHorizontal size={16} />
              </button>
            </div>
            {/* Small time stamp */}
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker === message.messageId && (
            <div
              className="absolute mt-2 bg-neutral-800 rounded-full p-1 flex space-x-2 z-10"
              style={{
                [message.senderFid === mainUserData?.fid ? "right" : "left"]: "0",
                top: message.senderFid === mainUserData?.fid ? "auto" : "100%",
              }}
              onClick={(e) => e.stopPropagation()}
              aria-hidden
            >
              <button
                onClick={() => handleAddReaction(message.messageId, "👍")}
                className="p-1 hover:bg-neutral-700 rounded-full text-yellow-500"
              >
                <ThumbsUp size={18} />
              </button>
              <button
                onClick={() => handleAddReaction(message.messageId, "❤️")}
                className="p-1 hover:bg-neutral-700 rounded-full text-red-500"
              >
                <Heart size={18} />
              </button>
              <button
                onClick={() => handleAddReaction(message.messageId, "➕")}
                className="p-1 hover:bg-neutral-700 rounded-full text-neutral-400"
              >
                <Plus size={18} />
              </button>
              <button
                onClick={() => handleAddReaction(message.messageId, "😂")}
                className="p-1 hover:bg-neutral-700 rounded-full text-yellow-500"
              >
                <span className="text-lg">😂</span>
              </button>
              <button
                onClick={() => handleAddReaction(message.messageId, "😮")}
                className="p-1 hover:bg-neutral-700 rounded-full text-yellow-500"
              >
                <span className="text-lg">😮</span>
              </button>
              <button
                onClick={() => handleAddReaction(message.messageId, "➕")}
                className="p-1 hover:bg-neutral-700 rounded-full text-neutral-400"
              >
                <Plus size={18} />
              </button>
            </div>
          )}

          {/* Context Menu */}
          {showMenu === message.messageId && (
            <div
              className="absolute mt-2 bg-neutral-800 rounded-lg py-1 z-10 w-36 shadow-lg"
              style={{
                [message.senderFid === mainUserData?.fid ? "right" : "left"]: "0",
                top:message.senderFid === mainUserData?.fid ? "auto" : "100%",
              }}
              onClick={(e) => e.stopPropagation()}
              aria-hidden
            >
              <button
                onClick={() => handleMenuAction("reply", message.messageId)}
                className="w-full px-4 py-2 text-left flex items-center hover:bg-neutral-700"
              >
                <Reply size={16} className="mr-2" />
                <span>Reply</span>
              </button>
              <button
                onClick={() => handleMenuAction("copy", message.messageId)}
                className="w-full px-4 py-2 text-left flex items-center hover:bg-neutral-700"
              >
                <Copy size={16} className="mr-2" />
                <span>Copy</span>
              </button>
              <button
                onClick={() => {
                  handleMenuAction("reactions", message.messageId)
                  handleReactionClick(message.messageId, new MouseEvent("click") as any)
                }}
                className="w-full px-4 py-2 text-left flex items-center hover:bg-neutral-700"
              >
                <Smile size={16} className="mr-2" />
                <span>Reactions</span>
              </button>
            </div>
          )}

          {message.reactions && message.reactions.length > 0 && (
            <div className="mt-1 flex">
              {message.reactions.map((reaction, index) => (
                <div key={index} className="flex items-center dark:bg-neutral-800 bg-neutral-200 rounded-full px-2 py-1 text-sm">
                  <span>{reaction.reaction}</span>
                  <span className="ml-1 text-neutral-400">{reaction.count}</span>
                </div>
              ))}
            </div>
          )}

        </div>}
        </>
      ))}
    </div>
  )
})

// Add display name
ChatMessages.displayName = "ChatMessages"

export default ChatMessages

