import { Img as Image } from 'react-image'
import type { TNotificationItem } from './notification-type'
import { useMemo } from 'react';

const acctionClasses = ['action']


export function TrendingToken({ notification }: {
    notification: TNotificationItem
}) {

    const seeTx = (e: Event) => {
        const target = e.target as HTMLElement
        const parents = [] as HTMLElement[]
        let parent = target.parentElement
        for (let i = 0; i < 4; i++) {
          if (parent) {
            parents.push(parent)
            parent = parent.parentElement
          }
        }
    
        if (parents.find((parent) => acctionClasses.some((className) => parent.classList.contains(className)))) return
    
        window.open(`https://basescan.org/tx/${notification?.previewItems?.[0]?.content?.hash}` || '', '_blank')
     }
  
    
    const tokenSymbol = useMemo(() => {
        return notification?.previewItems?.[0]?.content?.token?.ticker || "Unknown"
    }, [notification])

    const tokenImage = useMemo(() => {
        return notification?.previewItems?.[0]?.content?.token?.imageUrl || "/placeholder.svg"
    }, [notification])

    const buyers = useMemo(() => {
        return notification?.previewItems?.[0]?.content?.buyers || []
    }, [notification])

    return (
      <div className="rounded-lg p-4 border-b-[1px] border-neutral-400/50 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer" onClick={() => {
        (e: Event) => seeTx(e)
        }} aria-hidden>
        <div className="flex gap-3">
          <div
            className={`h-10 w-10 rounded-md dark:bg-neutral-800 bg-neutral-300 flex items-center justify-center overflow-hidden flex-shrink-0 action`}
          >
            <Image
              src={tokenImage}
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
                    {`$${tokenSymbol}`} is trending</h3>
              </div>
            </div>
            <p className="dark:text-neutral-300 text-neutral-800 text-sm mt-1">{buyers} farcaster bought within the hour</p>
          </div>
        </div>
      </div>
    )
  }