import ChatInterface from "~/components/blocks/direct-casts/chat-interface"
import { DirectCastModal } from "~/components/functional/modals/direct-cast-modal"

export default function DirectCastInbox({ className = ''}: { className?: string}) {
    
  return (

       <div className={`flex h-screen overflow-hidden w-full shrink-0 justify-center min-w-9 md:w-[600px] lg:w-[1040px] ${className}`}>
        <ChatInterface/>
        <DirectCastModal />
      </div>
  )
}