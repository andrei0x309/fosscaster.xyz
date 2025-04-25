import { Button } from "~/components/ui/button"
// import { useMainStore } from "~/store/main"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { MoreHorizontal, MessageSquare, Repeat2, Heart, Share2, Grid } from "lucide-react"
import { searchSummary, searcUsers, searchCasts, searchChannels } from "~/lib/api"
import { useState, useEffect, useCallback } from "react"
import { Link } from 'react-router';
import { SearchSidebar } from '~/components/blocks/right-sidebar/search-bar'
import type { TWCSearchCasts } from '~/types/wc-search-casts'
import type { TWCSearchUsers } from '~/types/wc-search-users'
import type { TWCSearchChannels } from '~/types/wc-search-channels'
import type { TWCSearchSummary } from '~/types/wc-search-summary'
import { T_USER } from '~/types/wc-mod'
import { UserItem } from '~/components/blocks/explore/user'
import { ChannelItem } from '~/components/blocks/explore/channel'
import { Post } from "~/components/blocks/post"
import { SimpleLoader } from "~/components/atomic/simple-loader"
import InfiniteScroll from "../ui/extension/infinte-scroll"

// export const NotFoundPage = () => {
//     const { navigate } = useMainStore()

//     return (
// <section >
//     <div className="h-full w-full shrink-0 justify-center sm:w-[540px] lg:w-[680px] py-8 mt-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
//         <div className="mx-auto max-w-screen-sm text-center">
//             <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-6xl text-primary-600 dark:text-primary-500">404</h1>
//             <p className="mb-4 text-3xl tracking-tight font-bold text-neutral-900 md:text-4xl dark:text-white">Something&apos;s missing.</p>
//             <p className="mb-4 text-lg font-light text-neutral-500 dark:text-neutral-400">Sorry, page cannot be found. You&apos;ll find lots to explore on the home page. </p>
//             <Button className="w-full max-w-40 bg-red-600 hover:bg-red-700 text-white" onClick={() => {  navigate('/home')  } }  >Go back</Button>
//         </div>   
//     </div>
// </section>
//     );
// }

// export default NotFoundPage;

type ChannelType = TWCSearchSummary['result']['channels'][0] | any

export default function SearchPage ({ query, searchType = 'top', className = '' }: { query: string, searchType?: string, className?: string }) {
  const [activeTab, setActiveTab] = useState(searchType)
  const [searchResults, setSearchResults] = useState<TWCSearchSummary | null>(null)
  const [searchCastsResults, setSearchCastsResults] = useState<TWCSearchCasts | null>(null)
  const [searchChannelsResults, setSearchChannelsResults] = useState<TWCSearchChannels | null>(null)
  const [searchUsersResults, setSearchUsersResults] = useState<TWCSearchUsers | null>(null)
  const [intitialSearchChannelsLoaded, setIntitialSearchChannelsLoaded] = useState(false)
  const [intitialSearchUsersLoaded, setIntitialSearchUsersLoaded] = useState(false)
  const [intitialSearchCastsLoaded, setIntitialSearchCastsLoaded] = useState(false)
  const [intitialSearchSummaryLoaded, setIntitialSearchSummaryLoaded] = useState(false)
  const [hasMoreChannels, setHasMoreChannels] = useState(true)
  const [hasMoreUsers, setHasMoreUsers] = useState(true)

  const [loading, setLoading] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    if (loading) {
      return
    }
    try {
      if (activeTab === "top") {
        const data = await searchSummary({ query, maxChannels: 4 })
        setSearchResults(data)
        if (!intitialSearchSummaryLoaded) {
          setIntitialSearchSummaryLoaded(true)
        }
      } else if (activeTab === "casts") {
        const data = await searchCasts({ query })
        setSearchCastsResults(data)
        if (!intitialSearchCastsLoaded) {
          setIntitialSearchCastsLoaded(true)
        }
      } else if (activeTab === "channels") {
        const cursor = searchChannelsResults?.next?.cursor || ''
        const data = await searchChannels({ query, cursor })
        if (!data?.next?.cursor) {
          setHasMoreChannels(false)
        }
        if (!intitialSearchChannelsLoaded) {
          setIntitialSearchChannelsLoaded(true)
        }
        setSearchChannelsResults({
          next: {
            cursor: cursor,
          },
          result: {
            ...data.result,
            channels: [
              ...(searchChannelsResults?.result?.channels || []),
              ...(data?.result?.channels || []),
            ],
          }
        })
      } else if (activeTab === "users") {
        const cursor = searchUsersResults?.next?.cursor || ''
        const data = await searcUsers({ query, cursor })
        if (!data?.next?.cursor) {
          setHasMoreUsers(false)
        }
        setSearchUsersResults({
          next: {
            cursor: cursor,
          },
          result: {
            ...data.result,
            users: [
              ...(searchUsersResults?.result?.users || []),
              ...(data?.result?.users || []),
            ],
          }
        })
      }
      if (!intitialSearchUsersLoaded) {
        setIntitialSearchUsersLoaded(true)
      }
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
    setLoading(false)
  }, [loading, activeTab, intitialSearchUsersLoaded, query, intitialSearchSummaryLoaded, intitialSearchCastsLoaded, searchChannelsResults?.next?.cursor, searchChannelsResults?.result?.channels, intitialSearchChannelsLoaded, searchUsersResults?.next?.cursor, searchUsersResults?.result?.users])


  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  useEffect(() => {
    if (query) {
      loadData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return (
      <div className={`h-full w-full shrink-0 justify-center sm:w-[540px] lg:w-[680px] ${className}`}>
        <div className="sticky top-0 z-10 dark:bg-neutral-950 bg-white">
          {/* Search Bar */}
          <div className="flex items-center justify-between px-4 py-2">
            <SearchSidebar />
          </div>
          {/* Tabs */}
          <div className="flex border-b border-neutral-800">
            {["Top", "Casts", "Channels", "Users"].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-3 text-sm font-medium ${activeTab === tab.toLowerCase() ? "text-white border-b-2 border-red-600" : "text-neutral-400 hover:text-neutral-300"
                  }`}
                onClick={() => setActiveTab(tab.toLowerCase())}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading && <SimpleLoader />}

        {/* Tab Content */}
        {!loading && activeTab === "top" && (
          <div className="py-4">
            <h2 className="px-4 text-xl font-bold mb-4 border-b-[1px] border-neutral-400/40 pb-4">Users</h2>
            {searchResults?.result?.users?.length === 0 ? (
              <p className="text-neutral-400 p-4">No users found.</p>
            ) : (
              <div className="space-y-4">
                {searchResults?.result?.users?.map((user) => (
                  <UserItem key={user?.fid} user={user as T_USER} className={' border-b-[1px] border-neutral-400/40 pb-2 px-4'} />
                ))}
              </div>
            )}

            <h2 className="px-4 text-xl font-bold mb-4 border-b-[1px] border-neutral-400/40 pb-4 pt-6">Channels</h2>
            {searchResults?.result?.channels?.length === 0 ? (
              <p className="text-neutral-400 p-4">No channel found.</p>
            ) : (
              <div className="space-y-4">
                {searchResults?.result?.channels?.map((channel) => (
                  <ChannelItem key={channel?.key} channel={channel as ChannelType} className={' border-b-[1px] border-neutral-400/40 pb-2 px-4'} />
                ))}
              </div>
            )}


          </div>
        )}

        {/* Recent Tab Content */}
        {!loading && activeTab === "casts" && (
          <div className="py-4">
            {searchCastsResults?.result?.casts?.length === 0 ? (
              <p className="text-neutral-400 p-4">No casts found.</p>
            ) : (
              <div className="space-y-4">
                {searchCastsResults?.result?.casts?.map((cast) => (
                  <Post key={cast?.hash} item={{ cast: cast }} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Channels Tab Content */}
        {(!loading || intitialSearchChannelsLoaded) && activeTab === "channels" && (
          <div>
            <h2 className="px-4 text-xl font-bold mb-4 border-b-[1px] border-neutral-400/40 pb-4 pt-6">Channels</h2>
            {searchChannelsResults?.result?.channels?.length === 0 ? (
              <p className="text-neutral-400 p-4">No channel found.</p>
            ) : (
              <div className="space-y-4">
                {searchChannelsResults?.result?.channels?.map((channel) => (
                  <ChannelItem key={channel?.key} channel={channel as ChannelType} className={' border-b-[1px] border-neutral-400/40 pb-2 px-4'} />
                ))}


                {intitialSearchChannelsLoaded && <InfiniteScroll hasMore={hasMoreChannels} isLoading={loading} threshold={0.3} next={loadData} >
                  <div className="my-2"></div>
                </InfiniteScroll>
                }

              </div>
            )}


          </div>
        )}

        {/* Users Tab Content */}
        {(!loading || intitialSearchUsersLoaded) && activeTab === 'users' && (
          <div>
            <h2 className="px-4 text-xl font-bold mb-4 border-b-[1px] border-neutral-400/40 pb-4 pt-6">Users</h2>
            {searchUsersResults?.result?.users?.length === 0 ? (
              <p className="text-neutral-400 p-4">No users found.</p>
            ) : (
              <div className="space-y-4">
                {searchUsersResults?.result?.users.map((user, index) => (
                  <UserItem key={index} user={user as T_USER} className={' border-b-[1px] border-neutral-400/40 pb-2 px-4'} />
                ))}

                {intitialSearchUsersLoaded && <InfiniteScroll hasMore={hasMoreUsers} isLoading={loading} threshold={0.3} next={loadData} >
                  <div className="my-2"></div>
                </InfiniteScroll>
                }


              </div>


            )
            }


          </div>
        )}

      </div>
  )
}
