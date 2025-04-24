import { useState, useEffect, useCallback } from 'react'
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { CastHeader } from "~/components/blocks/header/cast-header"
import { getNotifsByTab, markNotifsSeen } from '~/lib/api'
import { useImmer } from 'use-immer'
import { NotificationItem } from '~/components/blocks/notifications/notification-item'
import { SimpleLoader } from "~/components/atomic/simple-loader"

const allowedTabs = ['priority', 'mentions', 'replies', 'likes', 'follows', 'other', 'channels']

export default function NotificationsUI({className = '', page = 'priority'}: {className?: string, page?: string}) {

  const [activeTab, setActiveTab] = useState(!allowedTabs.includes(page) ? 'priority' : page)
  const [notifs, setNotifs] = useImmer({} as Awaited<ReturnType<typeof getNotifsByTab>>)
  const [loading, setLoading] = useState(false)
  const [initalLoad, setInitialLoad] = useState(false)


  const handleTabChange = useCallback(async (tab: string) => {
    if(loading) return
    if(!allowedTabs.includes(tab)) tab = 'priority'
    setActiveTab(tab)
    setLoading(true)
    try {
    window.history.replaceState(null, '', `/~/notifications/${tab}`)
    const notifs = await getNotifsByTab({tab})
    setNotifs(notifs)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }, [loading, setNotifs])

  useEffect(() => {
      markNotifsSeen()
   }, [])

  useEffect(() => {
    if(!initalLoad) {
      setInitialLoad(true)
      handleTabChange(activeTab)
    }
  }, [activeTab, handleTabChange, initalLoad])

  return (
    <div className={`h-full w-full shrink-0 justify-center sm:w-[540px] lg:w-[680px] ${className}`}>
        <div className="h-full min-h-screen">

      <div className="sticky bg-white dark:bg-neutral-950 top-0 z-10 flex-col border-b-0 bg-app border-default h-26 p-2">
      <CastHeader title="Notifications" />
      <Tabs className="w-full" value={activeTab} onValueChange={(e) => handleTabChange(e)}>
          <TabsList className="grid-cols-2 h-fit grid w-full md:grid-cols-6 dark:bg-zinc-800 text-[0.92rem] mt-2 ">
            <TabsTrigger disabled={loading} className={`${loading ? 'cursor-wait': 'cursor-pointer'}`} value="priority">Priority</TabsTrigger>
            <TabsTrigger disabled={loading} className={`${loading ? 'cursor-wait': 'cursor-pointer'}`} value="channels">Channels</TabsTrigger>
            <TabsTrigger disabled={loading} className={`${loading ? 'cursor-wait': 'cursor-pointer'}`} value="mentions">Mentions</TabsTrigger>
            <TabsTrigger disabled={loading} className={`${loading ? 'cursor-wait': 'cursor-pointer'}`} value="likes">Likes</TabsTrigger>
            <TabsTrigger disabled={loading} className={`${loading ? 'cursor-wait': 'cursor-pointer'}`} value="follows">Follows</TabsTrigger>
            <TabsTrigger disabled={loading} className={`${loading ? 'cursor-wait': 'cursor-pointer'}`} value="other">Other</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

 
        {/* <Tabs value={activeTab} className="w-full">
          <TabsContent value="priority" className="mt-1 space-y-4">

          </TabsContent>
          <TabsContent value="mentions" className="mt-4 space-y-4">
             
          </TabsContent>
          <TabsContent value="other" className="mt-4 space-y-4">
            <p className="text-zinc-400">Other notifications will appear here.</p>
          </TabsContent>
        </Tabs> */}

            {loading && <SimpleLoader />}
            {!notifs?.result?.notifications?.length && !loading && <p className="dark:text-zinc-400 text-zinc-600 p-4">No notifications yet.</p>}
            {notifs?.result?.notifications?.map((notification, index) => (
              <NotificationItem key={index} notification={notification} onInviteResolved={() => handleTabChange(activeTab)} />
            ))}
    </div>
    </div>
  )
}
