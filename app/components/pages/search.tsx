import { Button } from "~/components/ui/button"
// import { useMainStore } from "~/store/main"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { MoreHorizontal, MessageSquare, Repeat2, Heart, Share2, Grid } from "lucide-react"
import { searchSummary, searcUsers, searchCasts, searchChannels } from "~/lib/api"
import { useState,useEffect, useCallback } from "react"
import { Link } from '@remix-run/react'
import { SearchSidebar } from '~/components/blocks/right-sidebar/search-bar'
import type { TWCSearchCasts} from '~/types/wc-search-casts'
import type { TWCSearchUsers} from '~/types/wc-search-users'
import type { TWCSearchChannels} from '~/types/wc-search-channels'
import type { TWCSearchSummary } from '~/types/wc-search-summary'

// export const NotFoundPage = () => {
//     const { navigate } = useMainStore()

//     return (
// <section >
//     <div className="h-full w-full shrink-0 justify-center sm:w-[540px] lg:w-[680px] py-8 mt-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
//         <div className="mx-auto max-w-screen-sm text-center">
//             <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-6xl text-primary-600 dark:text-primary-500">404</h1>
//             <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something&apos;s missing.</p>
//             <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, page cannot be found. You&apos;ll find lots to explore on the home page. </p>
//             <Button className="w-full max-w-40 bg-red-600 hover:bg-red-700 text-white" onClick={() => {  navigate('/home')  } }  >Go back</Button>
//         </div>   
//     </div>
// </section>
//     );
// }

// export default NotFoundPage;

export default function SearchPage({query, searchType = 'top', className = ''}: {query: string, searchType?: string, className?: string}) {
  const [activeTab, setActiveTab] = useState(searchType)
  const [searchResults, setSearchResults] = useState<TWCSearchSummary | null>(null)
  const [searchCastsResults, setSearchCastsResults] = useState<TWCSearchCasts | null>(null)
  const [searchChannelsResults, setSearchChannelsResults] = useState<TWCSearchChannels | null>(null)
  const [searchUsersResults, setSearchUsersResults] = useState<TWCSearchUsers | null>(null)

  const [loading, setLoading] = useState(false)

  const handleSearch = useCallback(async () => {
    setLoading(true)
    try {
      if (activeTab === "top") {
        const data = await searchSummary({query})
        setSearchResults(data)
      } else if (activeTab === "casts") {
        const data = await searchCasts({query})
        setSearchCastsResults(data)
      } else if (activeTab === "channels") {
        const data = await searchChannels({query})
        setSearchChannelsResults(data)
      } else if (activeTab === "users") {
        const data = await searcUsers({query})
        setSearchUsersResults(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [activeTab, query])

  useEffect(() => {
    if (query) {
      handleSearch()
    }
  }, [query, activeTab, handleSearch])

  return (
    <main className={`h-full w-full shrink-0 justify-center sm:w-[540px] lg:w-[680px] ${className}`}>
      {/* Search Bar */}
      <div className="flex items-center justify-between px-4 py-2">
      <SearchSidebar />
      </div>
      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        {["Top", "Casts", "Channels", "Users"].map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === tab.toLowerCase() ? "text-white border-b-2 border-red-600" : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab(tab.toLowerCase())}
          >
            {tab}
          </button>
        ))}
      </div>
        
        {/* Search Results */}
 
      {/* Tab Content */}
      {activeTab === "top" && (
        <div className="py-4">
          <h2 className="px-4 text-xl font-bold mb-4">Users</h2>

          {/* User Item */}
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border border-gray-700">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="fff" />
                <AvatarFallback className="bg-purple-900">fff</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">fff</span>
                </div>
                <div className="text-sm text-gray-400">@fff</div>
                <div className="text-sm text-gray-400">gn</div>
              </div>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-md px-5">Follow</Button>
          </div>

          {/* User Item */}
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border border-gray-700">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="FLOOD" />
                <AvatarFallback className="bg-blue-900">FL</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">FLOOD</span>
                </div>
                <div className="text-sm text-gray-400">@fffflood</div>
                <div className="text-sm text-gray-400">
                  founder{" "}
                  <Link href="#" className="text-purple-500">
                    operatingsystem.io
                  </Link>{" "}
                  | eth c/o 2015 |{" "}
                  <Link href="#" className="text-purple-500">
                    @ganbrood
                  </Link>
                </div>
                <div className="text-sm text-gray-400">hoarder</div>
              </div>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-md px-5">Follow</Button>
          </div>

          <div className="px-4 mt-2">
            <Link href="#" className="text-purple-500 text-sm">
              View all
            </Link>
          </div>

          {/* Channels Section */}
          <div className="py-4 border-t border-gray-800 mt-4">
            <h2 className="px-4 text-xl font-bold mb-4">Channels</h2>

            {/* Channel Item */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border border-gray-700 bg-gray-800 flex items-center justify-center text-white font-bold">
                  <AvatarFallback>0x</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">0xfff</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400 gap-2">
                    /0xfff <span className="text-gray-500">•</span>{" "}
                    <span className="flex items-center gap-1">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-gray-400"
                      >
                        <path
                          d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="9"
                          cy="7"
                          r="4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      7
                    </span>
                  </div>
                </div>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-md px-5">Follow</Button>
            </div>

            {/* Channel Item */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border border-gray-700">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="i'm in" />
                  <AvatarFallback>IM</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">i'm in</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400 gap-2">
                    /in <span className="text-gray-500">•</span>{" "}
                    <span className="flex items-center gap-1">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-gray-400"
                      >
                        <path
                          d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="9"
                          cy="7"
                          r="4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      2.7K
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    <Link href="#" className="text-purple-500">
                      www.clanker.world/clanker/0x1b...
                    </Link>
                  </div>
                </div>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-md px-5">Follow</Button>
            </div>

            <div className="px-4 mt-2">
              <Link href="#" className="text-purple-500 text-sm">
                View all
              </Link>
            </div>
          </div>

          {/* Casts Section */}
          <div className="py-4 border-t border-gray-800">
            <h2 className="px-4 text-xl font-bold mb-4">Casts</h2>

            {/* Cast Item */}
            <div className="px-4 py-3">
              <div className="flex gap-3">
                <Avatar className="w-10 h-10 border border-gray-700">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="goffyygod" />
                  <AvatarFallback>GO</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">goffyygod</span> <span className="text-gray-400">in</span>{" "}
                      <span className="text-green-500">✳️ socialsummer</span> <span className="text-gray-400">8mo</span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-300">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    <Avatar className="w-4 h-4">
                      <AvatarFallback className="bg-gray-700 text-[8px]">fff</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-400">fff</span>
                  </div>
                  <div className="flex justify-between mt-3">
                    <button className="text-gray-400 hover:text-gray-300">
                      <MessageSquare size={18} />
                    </button>
                    <button className="text-gray-400 hover:text-gray-300">
                      <Repeat2 size={18} />
                    </button>
                    <button className="text-gray-400 hover:text-gray-300">
                      <Heart size={18} />
                    </button>
                    <button className="text-gray-400 hover:text-gray-300">
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Tab Content */}
      {activeTab === "casts" && (
        <div className="py-4">
          {/* Cast Item */}
          <div className="px-4 py-3 border-b border-gray-800">
            <div className="flex gap-3">
              <Avatar className="w-10 h-10 border border-gray-700">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="spadegueye9s" />
                <AvatarFallback>SP</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">spadegueye9s</span> <span className="text-gray-400">1m</span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-300">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-white">
                    Climbing is a personal quest, a journey to test and improve oneself against the backdrop of nature.
                  </p>
                </div>
                <div className="flex justify-between mt-3">
                  <button className="text-gray-400 hover:text-gray-300">
                    <MessageSquare size={18} />
                  </button>
                  <button className="text-gray-400 hover:text-gray-300">
                    <Repeat2 size={18} />
                  </button>
                  <button className="text-gray-400 hover:text-gray-300">
                    <Heart size={18} />
                  </button>
                  <button className="text-gray-400 hover:text-gray-300">
                    <Grid size={18} />
                  </button>
                  <button className="text-gray-400 hover:text-gray-300">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Cast Item with Reply */}
          <div className="px-4 py-3 border-b border-gray-800">
            <div className="flex gap-3">
              <Avatar className="w-10 h-10 border border-gray-700">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="aethernet" />
                <AvatarFallback>AE</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">aethernet</span> <span className="text-gray-400">1m</span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-300">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
                <div className="mt-1 text-sm text-gray-400">
                  Replying to{" "}
                  <Link href="#" className="text-purple-500">
                    @siablo.eth
                  </Link>
                </div>
                <div className="mt-2">
                  <p className="text-white">before resetting, let's try a systematic approach:</p>
                  <ol className="list-decimal pl-6 mt-2 space-y-1">
                    <li>check filter media - might be releasing stored nutrients</li>
                    <li>vacuum substrate deeply, especially corners</li>
                    <li>reduce feeding temporarily</li>
                    <li>test source water for baseline readings</li>
                    <li>add fast-growing plants like hornwort to absorb excess nutrients</li>
                  </ol>
                  <p className="mt-2">
                    high nitrites are m... <span className="text-purple-500">Show more</span>
                  </p>
                </div>
                <div className="flex justify-between mt-3">
                  <button className="text-gray-400 hover:text-gray-300">
                    <MessageSquare size={18} />
                  </button>
                  <button className="text-gray-400 hover:text-gray-300">
                    <Repeat2 size={18} />
                  </button>
                  <button className="text-gray-400 hover:text-gray-300">
                    <Heart size={18} className="text-purple-500 fill-purple-500" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-300">
                    <Grid size={18} />
                  </button>
                  <button className="text-gray-400 hover:text-gray-300">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Cast Item with Reply */}
          <div className="px-4 py-3 border-b border-gray-800">
            <div className="flex gap-3">
              <Avatar className="w-10 h-10 border border-gray-700">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="siablo.eth" />
                <AvatarFallback>SI</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">siablo.eth</span> <span className="text-gray-400">2m</span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-300">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
                <div className="mt-1 text-sm text-gray-400">
                  Replying to{" "}
                  <Link href="#" className="text-purple-500">
                    @aethernet
                  </Link>
                </div>
                <div className="mt-2">
                  <p className="text-white">
                    I think it's under 40 — the test strip shows a very light pink color. But in the fry tank, both
                    nitrate and nitrite levels are super high, and no matter how many water changes I do, the numbers
                    just won't go down. I think I might have to reset the whole tank 😔
                  </p>
                </div>
                <div className="flex justify-between mt-3">
                  <button className="text-gray-400 hover:text-gray-300 flex items-center gap-1">
                    <MessageSquare size={18} />
                    <span className="text-xs">1</span>
                  </button>
                  <button className="text-gray-400 hover:text-gray-300">
                    <Repeat2 size={18} />
                  </button>
                  <button className="text-gray-400 hover:text-gray-300">
                    <Heart size={18} />
                  </button>
                  <button className="text-gray-400 hover:text-gray-300">
                    <Grid size={18} />
                  </button>
                  <button className="text-gray-400 hover:text-gray-300">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* More Cast Items */}
          <div className="px-4 py-3 border-b border-gray-800">
            <div className="flex gap-3">
              <Avatar className="w-10 h-10 border border-gray-700">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="samuelhuber.eth" />
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">samuelhuber.eth</span> <span className="text-gray-400">in</span>{" "}
                    <span className="text-blue-500">🔵 base</span> <span className="text-gray-400">2m</span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-300">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
                <div className="mt-1 text-sm text-gray-400">
                  Replying to{" "}
                  <Link href="#" className="text-purple-500">
                    @wonns
                  </Link>
                </div>
                <div className="mt-2">
                  <p className="text-white">
                    reporting back, chainlink fills in the 3rd block consistently over my testing so far. Meaning
                    setting minRequestConfirmations to 0 does in fact not lead to next or in same block callbacks
                  </p>
                </div>
                <div className="flex justify-between mt-3">
                  <button className="text-gray-400 hover:text-gray-300">
                    <MessageSquare size={18} />
                  </button>
                  <button className="text-gray-400 hover:text-gray-300">
                    <Repeat2 size={18} />
                  </button>
                  <button className="text-gray-400 hover:text-gray-300">
                    <Heart size={18} />
                  </button>
                  <button className="text-gray-400 hover:text-gray-300">
                    <Grid size={18} />
                  </button>
                  <button className="text-gray-400 hover:text-gray-300">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Channels Tab Content */}
      {activeTab === "channels" && (
        <div className="py-4">
          {/* Channel Item */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border border-gray-700 bg-red-900 flex items-center justify-center text-white font-bold">
                <AvatarFallback>Te</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">test</span>
                </div>
                <div className="flex items-center text-sm text-gray-400 gap-2">
                  /test <span className="text-gray-500">•</span>{" "}
                  <span className="flex items-center gap-1">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-gray-400"
                    >
                      <path
                        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="9"
                        cy="7"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    63
                  </span>
                </div>
              </div>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-md px-5">Follow</Button>
          </div>

          {/* Channel Item */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border border-gray-700">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="test" />
                <AvatarFallback>TE</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">test</span>
                </div>
                <div className="flex items-center text-sm text-gray-400 gap-2">
                  /countdown <span className="text-gray-500">•</span>{" "}
                  <span className="flex items-center gap-1">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-gray-400"
                    >
                      <path
                        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="9"
                        cy="7"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    139
                  </span>
                </div>
                <div className="text-sm text-gray-400">test</div>
              </div>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-md px-5">Follow</Button>
          </div>

          {/* Channel Item */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border border-gray-700 bg-teal-900">
                <AvatarFallback>TH</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">test</span>
                </div>
                <div className="flex items-center text-sm text-gray-400 gap-2">
                  /thevoid <span className="text-gray-500">•</span>{" "}
                  <span className="flex items-center gap-1">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-gray-400"
                    >
                      <path
                        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="9"
                        cy="7"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    31
                  </span>
                </div>
              </div>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-md px-5">Follow</Button>
          </div>

          {/* Channel Item */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border border-gray-700 bg-blue-600">
                <AvatarFallback>SE</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">test</span>
                </div>
                <div className="flex items-center text-sm text-gray-400 gap-2">
                  /selflove <span className="text-gray-500">•</span>{" "}
                  <span className="flex items-center gap-1">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-gray-400"
                    >
                      <path
                        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="9"
                        cy="7"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    28
                  </span>
                </div>
              </div>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-md px-5">Follow</Button>
          </div>

          {/* More Channel Items */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border border-gray-700">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="test" />
                <AvatarFallback>LO</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">test</span>
                </div>
                <div className="flex items-center text-sm text-gray-400 gap-2">
                  /longcaster <span className="text-gray-500">•</span>{" "}
                  <span className="flex items-center gap-1">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-gray-400"
                    >
                      <path
                        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="9"
                        cy="7"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    13
                  </span>
                </div>
                <div className="text-sm text-gray-400">We went far. Now we go long ———</div>
              </div>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-md px-5">Follow</Button>
          </div>

          {/* More Channel Items */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border border-gray-700 bg-gray-200">
                <AvatarFallback className="text-gray-800">CR</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">test</span>
                </div>
                <div className="flex items-center text-sm text-gray-400 gap-2">
                  /creators-hub <span className="text-gray-500">•</span>{" "}
                  <span className="flex items-center gap-1">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-gray-400"
                    >
                      <path
                        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="9"
                        cy="7"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    8
                  </span>
                </div>
              </div>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-md px-5">Follow</Button>
          </div>
        </div>
      )}

      {/* Users Tab Content */}
      {activeTab === 'users' && (
         <div className="px-4 py-3 items-center justify-between border-b border-gray-800">
          { searchUsersResults?.result?.users.map((user, index) => (
            <div key={index} className="flex items-start space-x-4 mb-6">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.pfp.url} alt={user.username} />
                <AvatarFallback>{user.username}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold flex items-center">
                      {user.username}
                    </h2>
                    <p className="text-gray-400 text-sm">{user.username}</p>
                  </div>
                  <Button variant="secondary" className="bg-red-600 hover:bg-red-700 text-white">
                    Follow
                  </Button>
                </div>
                <p className="text-sm mt-1">
                  {user?.profile?.bio?.text}
                </p>
              </div>
            </div>
          )) }
          </div>
        )}

    </main>
  )
}

