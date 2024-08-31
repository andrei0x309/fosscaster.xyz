'use client'

import { useEffect } from 'react'
import { Bell, Home, Search, MessageCircle, Users, Bookmark, Zap, User, Settings, ChevronDown, Heart, Repeat2, Share2, MoreHorizontal, PenSquare, Sun, Moon, Hash, Music, Tv, Zap as ZapIcon, Bookmark as BookmarkIcon, MoreVertical, Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet"
import { useMainStore, setInitialState } from "~/store/main"

export function WarpcastClone() {
  const { isDarkMode, isMobile, toggleDarkMode, isTablet, setIsTablet, setIsMobile  } = useMainStore()


  useEffect(() => {
    setInitialState()
    const checkSize = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches)
      setIsTablet(window.matchMedia('(max-width: 1024px)').matches)
    }
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const toggleTheme = () => toggleDarkMode()

  const SidebarContent = () => (
    <>
      <div className="mb-8 flex items-center">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold mr-2">W</div>
        <div className="ml-auto flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <Button variant="ghost" className="justify-start mb-2 font-semibold w-full">
        <Home className="h-5 w-5 mr-3" />
        Home
      </Button>
      <Button variant="ghost" className="justify-start mb-2 w-full">
        <Bell className="h-5 w-5 mr-3" />
        Notifications
      </Button>
      <Button variant="ghost" className="justify-start mb-2 w-full">
        <MessageCircle className="h-5 w-5 mr-3" />
        Direct Casts
      </Button>
      <Button variant="ghost" className="justify-start mb-2 w-full">
        <Search className="h-5 w-5 mr-3" />
        Explore
      </Button>
      <Button variant="ghost" className="justify-start mb-2 w-full">
        <Users className="h-5 w-5 mr-3" />
        Invite
      </Button>
      <Button variant="ghost" className="justify-start mb-2 w-full">
        <Bookmark className="h-5 w-5 mr-3" />
        Bookmarks
      </Button>
      <Button variant="ghost" className="justify-start mb-2 w-full">
        <Zap className="h-5 w-5 mr-3" />
        Warps
      </Button>
      <Button variant="ghost" className="justify-start mb-2 w-full">
        <User className="h-5 w-5 mr-3" />
        Profile
      </Button>
      <div className="mt-4 font-semibold text-sm text-gray-500">Favorites</div>
      <Button variant="ghost" className="justify-start mt-2 text-sm w-full">
        <Hash className="h-4 w-4 mr-2" />
        founders
      </Button>
      <Button variant="ghost" className="justify-start mt-1 text-sm w-full">
        <Music className="h-4 w-4 mr-2" />
        frogfm
      </Button>
      <Button variant="ghost" className="justify-start mt-1 text-sm w-full">
        <Tv className="h-4 w-4 mr-2" />
        technology
      </Button>
      <Button variant="ghost" className="justify-start mt-1 text-sm w-full">
        <User className="h-4 w-4 mr-2" />
        dalechyn
      </Button>
      <Button variant="ghost" className="justify-start mt-1 text-sm w-full">
        <ZapIcon className="h-4 w-4 mr-2" />
        warpcast
      </Button>
      <div className="mt-4 font-semibold text-sm text-gray-500 flex items-center">
        Recent
        <ChevronDown className="w-4 h-4 ml-1" />
      </div>
      <Button variant="ghost" className="justify-start mt-2 text-sm w-full">
        <Hash className="h-4 w-4 mr-2" />
        dev
      </Button>
      <Button variant="ghost" className="justify-start mt-4 text-purple-600 hover:bg-purple-100 w-full">
        Create a channel
      </Button>
    </>
  )

  return (
    <div className={`flex h-screen bg-white dark:bg-gray-900 ${isMobile ? 'flex-col' : ''} overflow-hidden`}>
      {/* Left Sidebar */}
      {!isMobile && (
        <nav className="w-64 border-r border-gray-200 dark:border-gray-700 flex flex-col p-4">
          <ScrollArea className="flex-1">
            <SidebarContent />
          </ScrollArea>
        </nav>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="max-w-2xl mx-auto w-full flex flex-col h-full">
          <div className="sticky top-0 bg-white dark:bg-gray-900 z-10">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-bold">Home</h1>
              <div className="flex items-center space-x-2">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <PenSquare className="h-4 w-4 mr-2" />
                  Cast
                </Button>
                {isMobile && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Menu className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                      <ScrollArea className="h-full">
                        <SidebarContent />
                      </ScrollArea>
                    </SheetContent>
                  </Sheet>
                )}
              </div>
            </div>
            <Tabs defaultValue="home" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="home">Home</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="frames">Frames</TabsTrigger>
                <TabsTrigger value="channels">All Channels</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Feed */}
          <ScrollArea className="flex-1">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="p-4">
                  <div className="flex space-x-4">
                    <Avatar>
                      <AvatarImage src={`/placeholder.svg?height=40&width=40&text=U${i+1}`} alt={`User ${i+1}`} />
                      <AvatarFallback>U{i+1}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold">User {i+1}</span>
                          <span className="text-gray-500 ml-2">@user{i+1}.eth · 5h</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </div>
                      <p className="mt-2">This is sample post #{i+1} on our Warpcast clone. Exciting times in web3!</p>
                      {i % 3 === 0 && (
                        <img src={`/placeholder.svg?height=300&width=500&text=Sample+Image+${i+1}`} alt={`Sample post image ${i+1}`} className="mt-2 rounded-lg w-full" />
                      )}
                      <div className="mt-2 flex items-center justify-between text-gray-500">
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" className="text-gray-500">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            <span>{i + 2}</span>
                            <span className="sr-only">Comments</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-500">
                            <Repeat2 className="h-4 w-4 mr-1" />
                            <span>{i + 5}</span>
                            <span className="sr-only">Recasts</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-500">
                            <Heart className="h-4 w-4 mr-1" />
                            <span>{i + 10}</span>
                            <span className="sr-only">Likes</span>
                          </Button>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" className="text-gray-500">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More actions</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-500">
                            <BookmarkIcon className="h-4 w-4" />
                            <span className="sr-only">Bookmark</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-500">
                            <Share2 className="h-4 w-4" />
                            <span className="sr-only">Share</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </main>

      {/* Right Sidebar */}
      {!isTablet && (
        <aside className={`w-80 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto ${isMobile ? 'hidden' : ''}`}>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Input type="search" placeholder="Search casts, channels and users" className="pl-8 mb-4" />
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <h2 className="font-semibold mb-2">Invite friends, earn warps</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">You and your friend each get 50 warps if they sign up using your invite link.</p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Get Invite Link</Button>
          </div>
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Suggested Follows</h2>
            {['welter', 'tldr', 'Marcela'].map((user, i) => (
              <div key={user} className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Avatar className="w-10 h-10 mr-2">
                    <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${user}`} alt={user} />
                    <AvatarFallback>{user[0]}</AvatarFallback>
                  </Avatar>
                  <div className={isMobile ? 'hidden' : ''}>
                    <div className="font-semibold">{user}</div>
                    <div className="text-sm text-gray-500">@{user.toLowerCase()}</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Follow</Button>
              </div>
            ))}
            <Button variant="link" className="text-purple-600 p-0">Show more</Button>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Suggested Channels</h2>
            {['Web3', 'NFTs', 'DeFi'].map((channel, i) => (
              <div key={channel} className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center mr-2">
                    <Hash className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <div className="font-semibold">{channel}</div>
                    <div className="text-sm text-gray-500">{1000 + i * 500} members</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Join</Button>
              </div>
            ))}
            <Button variant="link" className="text-purple-600 p-0">Discover more</Button>
          </div>
        </aside>
      )}
    </div>
  )
}