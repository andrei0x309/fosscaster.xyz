"use client"

import * as React from "react"
import { Search, Users } from "lucide-react"

import { searchSummary } from  "~/lib/api"
import { Input } from "~/components/ui/input"
import type { TWCSearchSummary } from "~/types/wc-search-summary"
import { SimpleLoader } from "~/components/atomic/simple-loader"
import { useMainStore } from "~/store/main"

 
export function SearchSidebar() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [showResults, setShowResults] = React.useState(false)
  const [searchResults, setSearchResults] = React.useState<TWCSearchSummary>({} as TWCSearchSummary)
  const [isLoading, setIsLoading] = React.useState(false)

  const { navigate } = useMainStore()

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true)
    const value = e.target.value
    setSearchQuery(value)
    setShowResults(value.length > 0)
    try {
        const data = await searchSummary({query: value})
        setSearchResults(data)
    } catch (error) {
        console.error("Error fetching search results:", error)
    }
    setIsLoading(false)
  }

  const handleInputFocus = () => {
    if (searchQuery.length > 0) {
      setShowResults(true)
    }
  }

  // Close results when clicking outside
  const searchRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
        <div ref={searchRef} className="relative w-full">
                          <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input type="search" placeholder="Search casts, channels and users"  
                className="w-full pl-10 h-10 text-sm mb-4"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                />
              </div>
          { isLoading && 
          <div className="absolute top-full left-0 right-0 -mt-1 bg-sidebar-accent rounded-md overflow-hidden shadow-lg z-50 bg-gray-100 dark:dark:bg-zinc-900 border border-neutral-400/50 min-h-[26rem] justify-center content-center">
          <SimpleLoader /> 
          </div>
          }
          {showResults && !isLoading && (
            <div className="absolute top-full left-0 right-0 -mt-1 bg-sidebar-accent rounded-md overflow-hidden shadow-lg z-50 bg-gray-100 dark:dark:bg-zinc-900 border border-neutral-400/50">
              <div className="p-2">
                {searchQuery && (
                  <div className="flex items-center px-3 py-2 text-sm text-sidebar-foreground hover:dark:dark:bg-zinc-800 hover:bg-white rounded-md cursor-pointer" onClick={() => navigate(`/~/search/top?q=${searchQuery}`)} onKeyDown={() => {}} role="button" tabIndex={0}>
                    <Search className="h-4 w-4 mr-2" />
                    <span>{searchQuery}</span>
                  </div>
                )}

                <div className="mt-2">
                  <h3 className="text-xs font-medium px-3 py-1 text-sidebar-foreground/70">Users</h3>
                  {searchResults?.result?.users.length > 0 ? (
                    <div className="space-y-1">
                      {searchResults?.result?.users.map((user) => (
                        <div
                          key={user.fid}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-sidebar-accent/50 rounded-md cursor-pointer"
                        >
                          <div className="relative h-8 w-8 rounded-full overflow-hidden">
                            <img
                              src={user.pfp.url || "/placeholder.svg"}
                              alt={user?.username}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium truncate">{user?.username}</span>
                            <div className="flex items-center text-xs text-sidebar-foreground/70">
                              <span className="truncate">{user?.username}</span>
                              {user?.viewerContext?.following && user?.viewerContext?.followedBy && <span className="ml-1 truncate">· Following each other</span>}
                              {user?.viewerContext?.following && !user?.viewerContext?.followedBy && <span className="ml-1 truncate">· Following</span>}
                              {!user?.viewerContext?.following && user?.viewerContext?.followedBy && <span className="ml-1 truncate">· Followed by</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-3 py-2 text-sm text-sidebar-foreground/70">No users found</div>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="text-xs font-medium px-3 py-1 text-sidebar-foreground/70">Channels</h3>
                  {searchResults?.result?.channels.length > 0 ? (
                    <div className="space-y-1">
                      {searchResults?.result?.channels?.map((channel) => (
                        <div
                          key={channel.key}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-sidebar-accent/50 rounded-md cursor-pointer"
                        >
                          <div className="relative h-8 w-8 rounded-full overflow-hidden">
                            <img
                              src={channel?.fastImageUrl || channel?.imageUrl || "/placeholder.svg"}
                              alt={channel?.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium truncate">{channel.name}</span>
                            <div className="flex items-center text-xs text-sidebar-foreground/70">
                              <Users className="h-3 w-3 mr-1" />
                              <span>{channel?.followerCount} followers</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-3 py-2 text-sm text-sidebar-foreground/70">No channels found</div>
                  )}
                </div>

                <div className="mt-2">
                  <button className="w-full text-center text-xs text-sidebar-foreground/70 py-2 hover:text-sidebar-foreground">
                    Show more results
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
  )
}

