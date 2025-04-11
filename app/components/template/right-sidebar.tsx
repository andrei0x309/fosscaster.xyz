

import { Button } from "~/components/ui/button"
import { SearchSidebar } from '~/components/blocks/right-sidebar/search-bar'
import { useMainStore } from "~/store/main"
import { StorageCard } from "~/components/blocks/right-sidebar/user-storage"
import { MiniAppsSidebar } from "~/components/blocks/right-sidebar/mini-apps"
import { memo } from "react"
import { SuggestedChannels } from "~/components/blocks/right-sidebar/sugested-channels"
import { GithubIcon } from "~/components/icons/github"
import { VerifiedIcon } from "~/components/icons/verified"
import { GIT_COMMIT_SHA } from '~/lib/git-commit'

if (process.env.NODE_ENV === 'development') {
   // In production this will be set by the CI/CD pipeline
   process.env.GIT_HASH_COMMIT ='1337/development'
} else {
   process.env.GIT_HASH_COMMIT = GIT_COMMIT_SHA
}

export const RightSidebar = memo(function RightSidebar({ className = '' }: { className?: string }) {

    const { isMobile, isTablet, navigate, isRightSidebarVisible, isUserLoggedIn} = useMainStore()


      return (
      <>
          {/* Right Sidebar */}
            <aside className={`w-80 border-l border-neutral-400/50 pt-4 px-4 sticky top-0 h-screen shrink-0 xl:w-[340px] overflow-y-auto scrollbar-hide ${isMobile || isTablet || !isRightSidebarVisible ? 'hidden' : ''} ${className}`}>
              <SearchSidebar />
              <div className="bg-gray-100 dark:bg-zinc-900 rounded-lg p-4 mb-4">
                <h2 className="font-semibold mb-2">FC - Farcaster App</h2>
                <p className="text-sm text-neutral-600 dark:text-gray-400 mb-2">This is an open-source clone of Warpcast, optimized for Web3 native people which allows you to use any wallet.</p>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={() => {  navigate('/~/about')  } }  >Read more</Button>
              </div>
              <StorageCard />
              
              {isUserLoggedIn && <MiniAppsSidebar />}
              {!isUserLoggedIn && <SuggestedChannels />}

              <a href="https://github.com/andrei0x309/fc-app.pages.dev" className="flex content-end items-end text-neutral-600 dark:text-gray-400 -mt-2 text-[0.77rem] text-right">View the source code on GitHub<GithubIcon className="h-4 w-4 ml-1 mr-1 inline" /></a>
              {process.env.GIT_HASH_COMMIT
              && <a href={`${process.env.GIT_HASH_COMMIT?.includes('development') ? '#' : `https://github.com/andrei0x309/fc-app.pages.dev/commit/${process.env.GIT_HASH_COMMIT}`}`} className="flex content-end items-end text-neutral-600 dark:text-gray-400 mt-1 text-[0.77rem] text-right">
                Commit attestaion {process.env.GIT_HASH_COMMIT.slice(0, 8)} <VerifiedIcon className="h-4 w-4 ml-1 mr-1 inline" />
                </a>
              }
            </aside>

      </>)
  })
  




