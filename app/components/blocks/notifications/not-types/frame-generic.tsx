import { Img as Image } from 'react-image'
import { timeAgo } from '~/lib/misc';
import type { TNotificationItem } from './notification-type'
import { useMainStore } from '~/store/main';


export function GenericFrameNotification({ notification }: {
    notification: TNotificationItem
}) {

        const { openMiniApp } = useMainStore()
    

    return (
      <div className="rounded-lg p-4 border-b-[1px] border-neutral-400/50 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer" onClick={() => {
        openMiniApp({
            homeUrl: notification?.previewItems?.[0]?.content?.frame?.homeUrl || '',
            iconUrl: notification?.previewItems?.[0]?.content?.frame?.iconUrl,
            name: notification?.previewItems?.[0]?.content?.frame?.name,
            splashImageUrl: notification?.previewItems?.[0]?.content?.frame?.splashImageUrl,
            author: {
                avatarUrl: notification?.previewItems?.[0]?.content?.frame?.author?.pfp?.url || '',
                username: notification?.previewItems?.[0]?.content?.frame?.author?.username || '',
            },
            isInstalled: notification?.previewItems?.[0]?.content?.frame?.viewerContext?.favorited
        })
        }} aria-hidden>
        <div className="flex gap-3">
          <div
            className={`h-10 w-10 rounded-md dark:bg-neutral-800 bg-neutral-300 flex items-center justify-center overflow-hidden flex-shrink-0`}
          >
            <Image
              src={notification?.previewItems?.[0]?.content?.frame?.iconUrl || "/placeholder.svg"}
              alt=""
              width={40}
              height={40}
              className="w-full h-full"
            />
          </div>
  
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <h3 className="font-bold dark:text-white">{notification?.previewItems?.[0]?.content?.title}</h3>
                <span className="text-neutral-400 text-sm">{timeAgo(notification?.latestTimestamp ?? 0)}</span>

              </div>
  
              {/* 
              // Not really useful just sends a signal to backend 
             <button className="text-neutral-400 hover:text-white">
                <MoreHorizontal className="h-5 w-5" />
              </button> */}
            </div>
  
            <p className="dark:text-neutral-300 text-neutral-800 text-sm mt-1">{notification?.previewItems?.[0]?.content?.body}</p>
          </div>
        </div>
      </div>
    )
  }