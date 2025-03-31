
import { Search,  } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { useMainStore } from "~/store/main"
import { StorageCard } from "~/components/blocks/right-sidebar/user-storage"
import { memo } from "react"
import { SuggestedChannels } from "~/components/blocks/right-sidebar/sugested-channels"
import { GithubIcon } from "~/components/icons/github"

export const RightSidebar = memo(function RightSidebar({ className = '' }: { className?: string }) {

    const { isMobile, isTablet, navigate, isRightSidebarVisible} = useMainStore()


      return (
      <>
          {/* Right Sidebar */}
            <aside className={`w-80 border-l border-neutral-400/50 p-4 sticky top-0 h-screen shrink-0 xl:w-[340px] overflow-y-auto scrollbar-hide ${isMobile || isTablet || !isRightSidebarVisible ? 'hidden' : ''} ${className}`}>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input type="search" placeholder="Search casts, channels and users" className="pl-10 mb-4" />
              </div>
              <div className="bg-gray-100 dark:bg-zinc-900 rounded-lg p-4 mb-4">
                <h2 className="font-semibold mb-2">FC - Farcaster App</h2>
                <p className="text-sm text-neutral-600 dark:text-gray-400 mb-2">This is an open-source clone of Warpcast, optimized for Web3 native people which allows you to use any wallet.</p>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={() => {  navigate('/~/about')  } }  >Read more</Button>
              </div>
              <StorageCard />

              <SuggestedChannels />

              <a href="https://https://github.com/andrei0x309/fc-app.pages.dev" className="flex content-end items-end text-neutral-600 dark:text-gray-400 -mt-2 text-[0.77rem] text-right">View the source code on GitHub<GithubIcon className="h-4 w-4 ml-1 mr-1 inline" /></a>

            </aside>

      </>)
  })
  




