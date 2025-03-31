import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Search, Plus, ChevronDown } from "lucide-react"
import { getDirectCastInbox } from "~/lib/api"
import { useMainStore } from "~/store/main"

///  getDirectCastInbox

{/* <main className={`h-full w-full shrink-0 justify-center sm:mr-4 sm:w-[540px] lg:w-[680px] ${className}`}> */}


export function DirectCastInbox({ className = '' }: { className?: string }) {

  const { isRightSidebarVisible } = useMainStore()


  return (
    <>
    { isRightSidebarVisible ? null :

    <div className={`flex h-full w-full shrink-0 justify-center sm:w-[600px] lg:w-[1000px] ${className}`}>
      {/* Sidebar */}
      <div className="w-80 border-r-[1px] border-neutral-400/50 border-gray-800 flex flex-col">
        <div className="p-4">
          <h2 className="text-xl font-semibold flex justify-between items-center">
            Direct casts
            <Button variant="ghost" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </h2>
          <div className="relative mt-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Search..." className="pl-8 bg-neutral-800 border-neutral-700" />
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="secondary" size="sm" className="bg-red-600 text-white">All</Button>
            <Button variant="ghost" size="sm">Unread</Button>
            <Button variant="ghost" size="sm">Groups</Button>
          </div>
        </div>
        <div className="px-4 py-2 border-solid border-[1px] border-neutral-400/50">
          <div className="flex items-center gap-2 py-2">
            <div className="w-6 h-6 bg-neutral-700 border-solid border-2 border-neutral-400 rounded-full flex items-center justify-center flex-shrink-0">
              <Plus className="h-4 w-4" />
            </div>
            <span className="truncate">Requests</span>
            <span className="ml-auto text-sm text-neutral-400">13</span>
          </div>
        </div>
        <ScrollArea className="flex">
          <div className="p-4">
            {[
              { name: "Matty.eth", message: "You: hi", time: "4:11 PM" },
              { name: "sunlight = the best disinfectant", message: "karan 👑: By issuing a app session token", time: "11:33 AM" },
              { name: "Airstack", message: "https://moxie-frames.airstack.xyz/mps?t=fid_1791", time: "12:23 AM" },
              { name: "Devs: Composer Actions", message: "shipstone-labs: How long does approval for a mini-app take after submission?", time: "Yesterday" },
              { name: "Holmes", message: "Wow, it's working normally now! Thank you very much!", time: "Monday" },
              { name: "YupTester", message: "You: https://warpcast.com/~/composer-action?...", time: "Monday" },
              { name: "Matthew Fox", message: "Thanks for checking out flappycaster! We're super excited about Mini apps on...", time: "18d" },
              { name: "Grit_⚡️.eth", message: "You: The embed string is limited to 256 bytes so you can put anyhing there link...", time: "20d" },
              { name: "Samuel", message: "You: anyway sorry for too much text :)", time: "23d" },
              { name: "Geoff Golberg", message: "You and I are very aligned sir ha", time: "1mth" },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-2 py-2 hover:bg-gray-800 rounded cursor-pointer mb-2">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="font-medium truncate mr-2">{item.name}</span>
                    <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">{item.time}</span>
                  </div>
                  <p className="text-sm text-gray-400 break-all overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {item.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4">Select a conversation</h2>
        <Button className="bg-red-600 hover:bg-red-700">New direct cast</Button>
      </div>
    </div>
} </>
  )
}

export default DirectCastInbox