import { Img as Image } from 'react-image'
import { timeAgo } from '~/lib/misc';
import type { TNotificationItem } from './notification-type'
import { useMemo } from 'react';
import { Link } from 'react-router';


export function TipNotification({ notification }: {
    notification: TNotificationItem
}) {


    const username = useMemo(() => {
        return notification?.previewItems?.[0]?.content?.fromUser?.username || notification?.previewItems?.[0]?.content?.fromIdentity?.user?.username
    }, [notification])

    const time = useMemo(() => {
        return timeAgo(notification?.latestTimestamp ?? 0)
    }, [notification])

    const amount = useMemo(() => {
        return (Number(notification?.previewItems?.[0]?.content?.amount) || 0) / (10 ** notification?.previewItems?.[0]?.content?.token?.decimals || 1)
    }, [notification])

    const useAvatar = useMemo(() => {
        return notification?.previewItems?.[0]?.content?.fromIdentity?.user?.pfp?.url || notification?.previewItems?.[0]?.content?.fromUser?.pfp?.url || "/placeholder.svg"
    }, [notification])

    const tokenSymbol = useMemo(() => {
        return notification?.previewItems?.[0]?.content?.ticker || "Unknown"
    }, [notification])

    return (
      <div className="rounded-lg p-4 border-b-[1px] border-neutral-400/50 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer" aria-hidden>
        <div className="flex gap-3">
          <div
            className={`h-10 w-10 rounded-md dark:bg-neutral-800 bg-neutral-300 flex items-center justify-center overflow-hidden flex-shrink-0`}
          >
            <Image
              src={useAvatar}
              alt=""
              width={40}
              height={40}
              className="w-full h-full"
            />
          </div>
  
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <h3 className="font-bold dark:text-white">
                    <Link className='hover:underline' to={`/${username}`}>{username}</Link> has sent you {amount} {tokenSymbol}</h3>
                <span className="text-neutral-400 text-sm">{time}</span>

              </div>
            </div>
            <p className="dark:text-neutral-300 text-neutral-800 text-sm mt-1">Funds are available in your wallet.</p>
          </div>
        </div>
      </div>
    )
  }