import ChatInterface from "~/components/blocks/direct-casts/chat-interface"
import { DirectCastModal } from "~/components/functional/modals/direct-cast-modal"
// import { useMainStore } from "~/store/main"


export default function DirectCastInbox({ className = ''}: { className?: string}) {

      // const { isRightSidebarVisible } = useMainStore()
    
  return (
   <>
       <DirectCastModal />
       <div className={`flex h-screen overflow-hidden w-full shrink-0 justify-center min-w-9 md:max-w-[600px] lg:max-w-[1000px] ${className}`}>
        <ChatInterface/>
      </div>
 
   </>
  )
}