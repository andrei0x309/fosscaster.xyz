import { useState, useRef, useEffect, useCallback  } from "react"
import { Send } from "lucide-react"
import ChatSidebar from "./chat-sidebar"
import ChatMessages from "./chat-messages"
import ExpandingTextarea from "./expanding-textarea"
import { useMainStore } from "~/store/main"
import { Button } from "~/components/ui/button"
import { Conversation } from '~/types/wc-dc-inbox'
import { ChatContext } from "./chat-context"
import { dcGetMessages, sendDirectCast } from '~/lib/api'
import type { TWCDCMessages } from "~/types/wc-dc-messages"
import { useLocation } from '@remix-run/react'
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { UserIcon } from '~/components/icons/user'
import { GroupIcon } from '~/components/icons/group'

export default function ChatInterface() {
  
  const { setDcModalOpen, mainUserData } = useMainStore()
  const [currentConversation, setCurrentConversation] = useState<Conversation>({} as Conversation)
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const [openedChat, setOpenedChat] = useState('')
  const [prevOpenedChat, setPrevOpenedChat] = useState('')

  
  
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState({} as TWCDCMessages)

  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  

  const fetchMessages = useCallback(async () => {
    const conversationId = location?.pathname?.split('/inbox/')[1]
    setOpenedChat(conversationId ?? '')
    if(!conversationId) return
    const isNewChat = conversationId !== prevOpenedChat
    if(isNewChat) {
      setMessages({} as TWCDCMessages)
      setHasMoreMessages(true)
      setPrevOpenedChat(conversationId)
    }
 
    const cursor = messages?.next?.cursor ?? ''
    
    const fetchedMessages = await dcGetMessages({
      conversationId,
      cursor,
    })
    if (!fetchedMessages?.next?.cursor) {
      setHasMoreMessages(false)
    }
     setMessages(messages?.result?.messages && !isNewChat ? ({
      ...fetchedMessages,
      result: {
        ...fetchedMessages.result,
        messages: [...fetchedMessages.result.messages.reverse(), ...messages.result.messages],
      }
    }): {
      ...fetchedMessages,
      result: {
        ...fetchedMessages.result,
        messages: fetchedMessages.result.messages.reverse(),
      }
    })
  }, [location?.pathname, messages?.next?.cursor, messages?.result?.messages, prevOpenedChat])
  
  const loadMoreMessages = () => {
    fetchMessages()
  }
 
  useEffect( () => {
    fetchMessages()
   }, [location.pathname])

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        conversationId: currentConversation.conversationId,
        message: message,
        serverTimestamp: Date.now(),
        senderContext: {
           displayName: mainUserData?.displayName || '',
           fid: mainUserData?.fid || '',
           pfp: {
            url: mainUserData?.avatar || '',
            verified: false,
           },
           username: mainUserData?.username || ''
        },
        type: 'text',
        senderFid: mainUserData?.fid || '',
        messageId: `${Date.now()}`,
        hasMention: false,
        reactions: [],
        isPinned: false,
        isDeleted: false,
        viewerContext: {
           focused: false,
           isLastReadMessage: false,
           reactions: [],
        }
      } as TWCDCMessages['result']['messages'][0]

      setMessages({
        ...messages,
        result: {
          ...messages.result,
          messages: [...messages.result.messages, newMessage]
        },
      })

      await sendDirectCast({
        conversationId: currentConversation.conversationId,
        message,
      })

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
      <ChatContext.Provider 
      value={{ 
        currentConversation,
        setCurrentConversation,
        messages,
        setMessages,
        hasMoreMessages,
        setHasMoreMessages
        }}>
      <ChatSidebar />
      {openedChat !== '' ? 
      (<div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center p-4 border-b border-neutral-700">
          <div className="flex items-center">
          {!currentConversation?.isGroup ?
                (currentConversation?.viewerContext?.counterParty?.pfp?.url ?
                <Avatar className="hover:border-2">
                      <AvatarImage src={currentConversation.viewerContext.counterParty.pfp.url} alt={`User ${currentConversation?.viewerContext?.counterParty?.username}`} />
                      <AvatarFallback>{currentConversation.viewerContext.counterParty.username.slice(0,2)}</AvatarFallback>
                </Avatar>   
                : <UserIcon className="w-8 h-8 ml-1" />)
                :
                ( currentConversation.photoUrl ?
                <Avatar className="hover:border-2">
                      <AvatarImage src={currentConversation.photoUrl} alt={`Group ${currentConversation?.name}`} />
                      <AvatarFallback>{currentConversation?.name}</AvatarFallback>
                </Avatar>
                : <GroupIcon className="w-8 h-8 ml-1" />
                )
                }
            <span className="font-bold ml-2">{currentConversation?.isGroup ? currentConversation?.name : currentConversation?.viewerContext?.counterParty?.username }</span>
            <span className="ml-2 font-semibold"></span>
          </div>
          <div className="ml-auto flex gap-2">
            <button className="text-neutral-400 hover:text-white">
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
            <button className="text-neutral-400 hover:text-white">
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
          <ChatMessages ref={messagesContainerRef} loadMoreMessages={loadMoreMessages} />
        </div>

        <div className="p-4 border-t dark:border-neutral-700 border-neutral-300">
          <div className="flex items-end dark:bg-neutral-800 rounded-lg bg-zinc-300 ">
            <ExpandingTextarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message..."
              className="min-h-[40px] max-h-[200px] dark:bg-neutral-800 bg-neutral-300 dark:text-white placeholder-neutral-400 p-3 rounded-lg flex-1 resize-none"
            />
            <button
              onClick={handleSendMessage}
              className="p-3 -mt-2 text-white rounded-r-lg hover:bg-neutral-700 transition-colors"
              disabled={!message.trim()}
            >
              <Send size={20} className={message.trim() ? "text-neutral-500" : "text-neutral-500"} />
            </button>
          </div>
        </div>
      </div>
      ) : 
      <div className="flex-1 flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold mb-4">Select a conversation</h2>
      <Button className="bg-red-600 hover:bg-red-700" onClick={() => setDcModalOpen(true)}>New direct cast</Button>
    </div>
    }
    </ChatContext.Provider>
    </div>
  )
}

