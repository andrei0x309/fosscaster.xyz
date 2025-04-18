import { createContext } from "react"
import { Conversation } from '~/types/wc-dc-inbox'
import type React from "react"
import type { TWCDCMessages } from "~/types/wc-dc-messages"

type ContextType = {
    currentConversation: Conversation
    setCurrentConversation: React.Dispatch<React.SetStateAction<Conversation>>
    messages: TWCDCMessages
    setMessages: React.Dispatch<React.SetStateAction<TWCDCMessages>>
    hasMoreMessages: boolean
    setHasMoreMessages: React.Dispatch<React.SetStateAction<boolean>>
}

export const ChatContext = createContext(null as unknown as
    ContextType
)

