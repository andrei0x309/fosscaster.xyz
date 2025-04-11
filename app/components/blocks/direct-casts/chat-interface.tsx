import { useState, useRef } from "react"
import { Send } from "lucide-react"
import ChatSidebar from "./chat-sidebar"
import ChatMessages from "./chat-messages"
import ExpandingTextarea from "./expanding-textarea"

export default function ChatInterface({openChat = ''}: {openChat?: string}) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<
    {
      id: number
      sender: string
      content: string
      timestamp: string
      reactions?: { emoji: string; count: number }[]
    }[]
  >([
    {
      id: 1,
      sender: "geoffgolberg",
      content:
        "Self-issued signers mean accounts that were not created via Warpcast or any other client They were created via a script or specialized software One man's slop is another man's DAU https://warpcast.com/geoffg...",
      timestamp: "25d",
    },
    {
      id: 2,
      sender: "You",
      content: "more I look under the hood, the worse it gets https://warpcast.com/geoffgolberg/0x2b363d18",
      timestamp: "11:28 AM",
    },
    {
      id: 3,
      sender: "geoffgolberg",
      content: "more I look under the hood, the worse it gets https://warpcast.com/geoffgolberg/0x2b363d18",
      timestamp: "25d",
    },
    {
      id: 4,
      sender: "You",
      content:
        "I did a reply to this cast. So yeah probably most automated accounts did not use clients to execute actions because is harder than using hubs API.",
      timestamp: "12:05 PM",
      reactions: [{ emoji: "👍", count: 1 }],
    },
    {
      id: 5,
      sender: "You",
      content: "It was a great response, and very much appreciated",
      timestamp: "12:18 PM",
      reactions: [{ emoji: "👍", count: 1 }],
    },
    {
      id: 6,
      sender: "geoffgolberg",
      content: "Meet Jesse Bullock https://warpcast.com/jesseb...",
      timestamp: "8d",
    },
    {
      id: 7,
      sender: "You",
      content: "This dude gets it https://warpcast.com/geoffgolberg/0xc5af0c37",
      timestamp: "6:45 PM",
      reactions: [{ emoji: "😊", count: 1 }],
    },
  ])

  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "You",
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages([...messages, newMessage])
      setMessage("")

      // Scroll to bottom after sending a new message
      setTimeout(() => {
        const chatContainer = messagesContainerRef.current
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight
        }
      }, 100)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex w-full h-full overflow-hidden">
      <ChatSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center p-4 border-b border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
              G
            </div>
            <span className="ml-2 font-semibold">geoffgolberg</span>
          </div>
          <div className="ml-auto flex gap-2">
            <button className="text-gray-400 hover:text-white">
              <span className="sr-only">Clock</span>
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
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </button>
            <button className="text-gray-400 hover:text-white">
              <span className="sr-only">More</span>
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
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </button>
          </div>
        </div>

        <div className="chat-messages flex-1 overflow-hidden">
          <ChatMessages messages={messages} ref={messagesContainerRef} />
        </div>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-end bg-gray-800 rounded-lg">
            <ExpandingTextarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message..."
              className="min-h-[40px] max-h-[200px] bg-gray-800 text-white placeholder-gray-400 p-3 rounded-lg flex-1 resize-none"
            />
            <button
              onClick={handleSendMessage}
              className="p-3 text-white rounded-r-lg hover:bg-indigo-700 transition-colors"
              disabled={!message.trim()}
            >
              <Send size={20} className={message.trim() ? "text-indigo-500" : "text-gray-500"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

