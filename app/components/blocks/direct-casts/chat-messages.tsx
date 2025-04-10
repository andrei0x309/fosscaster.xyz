import { useState, useRef, useEffect, forwardRef } from "react"
import { MoreHorizontal, ThumbsUp, Heart, Plus, Copy, Reply, Smile } from "lucide-react"

interface Message {
  id: number
  sender: string
  content: string
  timestamp: string
  reactions?: { emoji: string; count: number }[]
}

interface ChatMessagesProps {
  messages: Message[]
}

// Use forwardRef to accept the ref from parent
const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(({ messages }, ref) => {
  const [hoveredMessage, setHoveredMessage] = useState<number | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState<number | null>(null)
  const [showMenu, setShowMenu] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [allMessages, setAllMessages] = useState<Message[]>(messages)

  const internalRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = ref || internalRef
  const loadingRef = useRef<HTMLDivElement>(null)
  const hasInitialScrolledRef = useRef(false)
  const shouldCheckScrollRef = useRef(false)

  // Initialize with the provided messages
  useEffect(() => {
    setAllMessages(messages)
  }, [messages])

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
  }, [allMessages])

  // Handle scroll event to detect when user scrolls to top
  const handleScroll = () => {
    if (!shouldCheckScrollRef.current || isLoading) return

    const container = messagesContainerRef.current
    if (container && container.scrollTop < 50) {
      loadOlderMessages()
    }
  }

  const loadOlderMessages = () => {
    setIsLoading(true)

    // Simulate loading older messages
    setTimeout(() => {
      const oldestId = allMessages.length > 0 ? allMessages[0].id : 0
      const olderMessages: Message[] = [
        {
          id: oldestId - 1,
          sender: "geoffgolberg",
          content: "This is an older message that was loaded when scrolling up.",
          timestamp: "30d",
        },
        {
          id: oldestId - 2,
          sender: "You",
          content: "Here's another older message that was loaded.",
          timestamp: "30d",
        },
        {
          id: oldestId - 3,
          sender: "geoffgolberg",
          content: "Scrolling up loads older messages in the conversation history.",
          timestamp: "31d",
        },
      ]

      // Get current scroll height and position
      const scrollContainer = messagesContainerRef.current
      const prevScrollHeight = scrollContainer?.scrollHeight || 0
      const prevScrollTop = scrollContainer?.scrollTop || 0

      setAllMessages((prev) => [...olderMessages, ...prev])

      // Maintain scroll position after new content is added
      requestAnimationFrame(() => {
        if (scrollContainer) {
          const newScrollHeight = scrollContainer.scrollHeight
          scrollContainer.scrollTop = prevScrollTop + (newScrollHeight - prevScrollHeight)
        }
      })

      setIsLoading(false)
    }, 1000)
  }

  const handleReactionClick = (messageId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setShowEmojiPicker(showEmojiPicker === messageId ? null : messageId)
    setShowMenu(null)
  }

  const handleMenuClick = (messageId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(showMenu === messageId ? null : messageId)
    setShowEmojiPicker(null)
  }

  const handleAddReaction = (messageId: number, emoji: string) => {
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
    >
      {/* Loading indicator at the top */}
      <div ref={loadingRef} className="py-2 text-center">
        {isLoading && (
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] text-gray-400"></div>
        )}
      </div>

      {/* Messages */}
      {allMessages.map((message) => (
        <div
          key={message.id}
          className={`flex flex-col ${message.sender === "You" ? "items-end" : "items-start"} relative max-w-full`}
          onMouseEnter={() => setHoveredMessage(message.id)}
          onMouseLeave={() => setHoveredMessage(null)}
        >
          {message.sender !== "You" && (
            <div className="flex items-center mb-1">
              <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold mr-2">
                G
              </div>
              <span className="font-medium">{message.sender}</span>
              <span className="text-gray-400 text-xs ml-2">{message.timestamp}</span>
            </div>
          )}

          <div className="flex items-end">
            {/* Message bubble with fixed width to prevent shifting */}
            <div
              className={`rounded-lg px-4 py-2 break-words ${
                message.sender === "You" ? "bg-indigo-600 text-white" : "bg-gray-700 text-white"
              }`}
              style={{ maxWidth: "calc(80% - 50px)" }} // Reserve space for icons
            >
              {message.content}
            </div>

            {/* Action buttons with fixed width space */}
            <div
              className={`ml-2 flex space-x-1 w-[50px] transition-opacity duration-200 ${
                hoveredMessage === message.id ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <button
                onClick={(e) => handleReactionClick(message.id, e)}
                className="p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
              >
                <Smile size={16} />
              </button>
              <button
                onClick={(e) => handleMenuClick(message.id, e)}
                className="p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
              >
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker === message.id && (
            <div
              className="absolute mt-2 bg-gray-800 rounded-full p-1 flex space-x-2 z-10"
              style={{
                [message.sender === "You" ? "right" : "left"]: "0",
                top: message.sender === "You" ? "auto" : "100%",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => handleAddReaction(message.id, "👍")}
                className="p-1 hover:bg-gray-700 rounded-full text-yellow-500"
              >
                <ThumbsUp size={18} />
              </button>
              <button
                onClick={() => handleAddReaction(message.id, "❤️")}
                className="p-1 hover:bg-gray-700 rounded-full text-red-500"
              >
                <Heart size={18} />
              </button>
              <button
                onClick={() => handleAddReaction(message.id, "➕")}
                className="p-1 hover:bg-gray-700 rounded-full text-gray-400"
              >
                <Plus size={18} />
              </button>
              <button
                onClick={() => handleAddReaction(message.id, "😂")}
                className="p-1 hover:bg-gray-700 rounded-full text-yellow-500"
              >
                <span className="text-lg">😂</span>
              </button>
              <button
                onClick={() => handleAddReaction(message.id, "😮")}
                className="p-1 hover:bg-gray-700 rounded-full text-yellow-500"
              >
                <span className="text-lg">😮</span>
              </button>
              <button
                onClick={() => handleAddReaction(message.id, "➕")}
                className="p-1 hover:bg-gray-700 rounded-full text-gray-400"
              >
                <Plus size={18} />
              </button>
            </div>
          )}

          {/* Context Menu */}
          {showMenu === message.id && (
            <div
              className="absolute mt-2 bg-gray-800 rounded-lg py-1 z-10 w-36 shadow-lg"
              style={{
                [message.sender === "You" ? "right" : "left"]: "0",
                top: message.sender === "You" ? "auto" : "100%",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => handleMenuAction("reply", message.id)}
                className="w-full px-4 py-2 text-left flex items-center hover:bg-gray-700"
              >
                <Reply size={16} className="mr-2" />
                <span>Reply</span>
              </button>
              <button
                onClick={() => handleMenuAction("copy", message.id)}
                className="w-full px-4 py-2 text-left flex items-center hover:bg-gray-700"
              >
                <Copy size={16} className="mr-2" />
                <span>Copy</span>
              </button>
              <button
                onClick={() => {
                  handleMenuAction("reactions", message.id)
                  handleReactionClick(message.id, new MouseEvent("click") as any)
                }}
                className="w-full px-4 py-2 text-left flex items-center hover:bg-gray-700"
              >
                <Smile size={16} className="mr-2" />
                <span>Reactions</span>
              </button>
            </div>
          )}

          {message.reactions && message.reactions.length > 0 && (
            <div className="mt-1 flex">
              {message.reactions.map((reaction, index) => (
                <div key={index} className="flex items-center bg-gray-800 rounded-full px-2 py-1 text-sm">
                  <span>{reaction.emoji}</span>
                  <span className="ml-1 text-gray-400">{reaction.count}</span>
                </div>
              ))}
            </div>
          )}

          {message.sender === "You" && <div className="text-gray-400 text-xs mt-1">{message.timestamp}</div>}
        </div>
      ))}
    </div>
  )
})

// Add display name
ChatMessages.displayName = "ChatMessages"

export default ChatMessages

