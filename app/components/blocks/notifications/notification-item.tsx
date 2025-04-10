import type { TWCNotifByType } from '~/types/wc-notifications-by-tab'
import { Heart, MessageCircle, Repeat2, Share2, MoreHorizontal, Bookmark, BarChart2, UserRoundPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { timeAgo } from '~/lib/misc';


type NotificationItem = TWCNotifByType['result']['notifications'][0]

export const NotificationItem = ({ notification }: { notification: NotificationItem }) => {

     return (
        <>
    { notification.type === 'cast-reply' || notification.type === 'cast-mention' ? 
        <div className="w-full mx-auto px-4 border-b-[1px] border-neutral-400/50 pb-2">
      <div className="flex items-start space-x-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={`${notification.previewItems[0].actor.pfp.url ?? '/placeholder.svg?height=40&width=40'}`} alt={notification.previewItems[0].actor.username} />
          <AvatarFallback>{notification.previewItems[0].actor.username.slice(0,2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold">{notification?.previewItems?.[0]?.actor?.username}</span>
              <span className="text-neutral-500 mx-1">·</span>
              <span className="text-neutral-500">{timeAgo(notification?.previewItems?.[0]?.timestamp as unknown as string ?? notification.latestTimestamp as unknown as string )}</span>
            </div>
            <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-white">
              <MoreHorizontal className="h-5 w-5" />
              <span className="sr-only">More options</span>
            </Button>
          </div>
          {notification.type === 'cast-mention' ? null : 
          <div className="text-neutral-500 text-sm mt-1">
            Replying to <span className="text-red-400">@{ notification?.previewItems?.[0]?.content?.cast?.parentAuthor?.username}</span>
          </div>
          }
          <p className="mt-1">{
            notification?.previewItems?.[0]?.content?.cast?.text
            }</p>
          <div className="flex items-center justify-between mt-3 text-neutral-500">
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="hover:text-white p-0">
                <MessageCircle className="h-5 w-5 mr-2" />
                <span>1</span>
              </Button>
              <Button variant="ghost" size="sm" className="hover:text-white p-0">
                <Repeat2 className="h-5 w-5 mr-2" />
                <span>0</span>
              </Button>
              <Button variant="ghost" size="sm" className="hover:text-white p-0">
                <Heart className="h-5 w-5 mr-2" />
                <span>1</span>
              </Button>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="hover:text-white p-0">
                <BarChart2 className="h-5 w-5" />
                <span className="sr-only">View stats</span>
              </Button>
              <Button variant="ghost" size="sm" className="hover:text-white p-0">
                <Bookmark className="h-5 w-5" />
                <span className="sr-only">Bookmark</span>
              </Button>
              <Button variant="ghost" size="sm" className="hover:text-white p-0">
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>: ''}

{ notification.type === 'cast-reaction' ?

<div className="w-full mx-auto px-4 border-b-[1px] border-neutral-400/50 pb-2">
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

    <Avatar className="w-8 h-8">
      <AvatarImage src={`${notification.previewItems[0].actor.pfp.url ?? '/placeholder.svg?height=40&width=40'}`} alt={notification.previewItems[0].actor.username} />
      <AvatarFallback>{notification.previewItems[0].actor.username.slice(0,2)}</AvatarFallback>
    </Avatar>
    <div className="flex-grow">
      <p className="font-semibold">
        {notification.previewItems[0].actor.username} <span className="font-normal">{ notification?.previewItems?.[0]?.content?.reaction?.type === 'like' ? 'liked' : 'recasted' } your cast</span>
      </p>
    </div>
    <Button 
      variant="outline" 
      size="sm" 
      className="bg-transparent text-white border-neutral-600 hover:bg-neutral-800 hover:text-white"
    >
      <UserRoundPlus className="w-4 h-4 mr-2" />
    </Button>
  </div>
  <p className="text-sm text-neutral-400 pl-11">
     { notification?.previewItems?.[0]?.content?.cast?.text}
  </p>
</div>
</div>: ''}

     </>)

    }