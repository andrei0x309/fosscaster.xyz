import ChatInterface from "~/components/blocks/direct-casts/chat-interface"
import { DirectCastModal } from "~/components/functional/modals/direct-cast-modal"
import { useMainStore } from "~/store/main"


export default function DirectCastInbox({ className = '', openChat ='' }: { className?: string, openChat?: string }) {

      const { isRightSidebarVisible } = useMainStore()
    
  return (
   <>
       <DirectCastModal />
       { isRightSidebarVisible ? null :
   
       <div className={`flex h-screen overflow-hidden w-full shrink-0 justify-center sm:w-[600px] lg:w-[1000px] ${className}`}>
      <ChatInterface openChat={openChat} />
   </div>
   }
   </>
  )
}