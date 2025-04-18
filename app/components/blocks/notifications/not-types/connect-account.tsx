import type { TNotificationItem } from './notification-type'
import { useMemo } from 'react';
import { GenericIcon } from '~/components/icons/generic'


export function ConnectAccount({ notification }: {
    notification: TNotificationItem
}) {


    const platform = useMemo(() => {
        return notification?.previewItems?.[0]?.content?.platform || "Unknown"
    }, [notification])

    return (
      <div className="rounded-lg p-4 border-b-[1px] border-neutral-400/50 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer" aria-hidden>
        <div className="flex gap-3">
          <div
            className={`h-10 w-10 rounded-md dark:bg-neutral-800 bg-neutral-300 flex items-center justify-center overflow-hidden flex-shrink-0 action`}
          >
            <GenericIcon
              className="h-6 w-6"
            />
          </div>
  
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <h3 className="font-bold dark:text-white">
                    Connect to {platform}</h3>
              </div>
            </div>
            <p className="dark:text-neutral-300 text-neutral-800 text-sm mt-1">Warpcast wants you to connect to {platform}</p>
          </div>
        </div>
      </div>
    )
  }

