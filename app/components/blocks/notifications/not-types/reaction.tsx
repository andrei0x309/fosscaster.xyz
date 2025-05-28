import { Heart, Repeat2, UserRoundPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"

import type { TNotificationItem } from './notification-type'


export function ReactionNotification({notification}: {notification: TNotificationItem}) {

return (
<div className="w-full mx-auto border-b-[1px] border-neutral-400/50 p-4 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer">
<div className="flex flex-col space-y-3">
  <div className="flex items-center space-x-3">
    {notification?.previewItems?.[0]?.content?.reaction?.type === 'like' ? 
    <div className="flex-shrink-0 w-8 h-8 bg-red-200 rounded-full flex items-center justify-center">
      <Heart className="w-5 h-5 text-red-600 " fill="currentColor" />
    </div>
    :
    <div className="flex-shrink-0 w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
      <Repeat2 className="w-5 h-5 text-green-600" fill="currentColor" />
    </div>
    }
    {notification.previewItems?.slice(0, 6).map((item, index) => (
    <Avatar className={`w-7 h-7`} style={index > 0 ? { marginLeft: '-0.5rem' }: {}} key={index}>
    <AvatarImage src={`${item?.actor.pfp?.url ?? '/placeholder.svg?height=40&width=40'}`} alt={notification.previewItems[0].actor.username} />
    <AvatarFallback>{item?.actor.username?.slice(0,2)}</AvatarFallback>
  </Avatar>
    ))}
    <div className="flex-grow">
      <p className="font-semibold">
        {notification.previewItems[0].actor.username}&nbsp;
        {notification?.previewItems?.length > 1 && <span>and {notification.previewItems.length - 1} others </span>}
        <span className="font-normal">{ notification?.previewItems?.[0]?.content?.reaction?.type === 'like' ? 'liked' : 'recasted' } your cast</span>
      </p>
    </div>
    {notification?.previewItems?.length === 1 && !notification?.previewItems?.[0]?.actor?.viewerContext?.following && <Button 
      variant="outline" 
      size="sm" 
      className="bg-transparent dark:text-white border-neutral-600 hover:bg-neutral-800 hover:text-white"
    >
      <UserRoundPlus className="w-4 h-4 mr-2" />
    </Button> }
  </div>
  <p className="text-sm text-neutral-400 pl-11">
     { notification?.previewItems?.[0]?.content?.cast?.text?.slice(0, 200) } {notification?.previewItems?.[0]?.content?.cast?.text?.length > 320 ? '...' : ''}
  </p>
</div>
</div>
)
}