import { UserPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { Link } from "@remix-run/react"
import { useState } from "react"
import { follow } from '~/lib/api'

import type { TNotificationItem } from './notification-type'

export function FollowNotification({ notification }: { notification: TNotificationItem }) {
    const [didFollow, setDidFollow] = useState(false)

    const doFollow = () => {
        setDidFollow(true)
        follow(String(notification?.previewItems?.[0]?.actor?.fid))
    }

    return (
      <div className="flex items-center space-x-4 pb-4 border-b border-zinc-800 p-4">
        <UserPlus className="w-4 h-4 text-zinc-500" />
        <div className="flex -space-x-2 overflow-hidden">
          {(notification?.previewItems ?? []).map((notif, index) => (
            <Avatar key={index} className="w-10 h-10 border-2 border-zinc-900">
              <AvatarImage src={notif?.actor?.pfp?.url || "/placeholder.svg"} alt="" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
          ))}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">
            <Link className="hover:underline" to={`/${notification?.previewItems?.[0]?.actor?.username}`}>{notification?.previewItems?.[0]?.actor?.username}</Link> <span className="text-zinc-500">followed you</span>
          </p>
        </div>
        {!notification?.previewItems?.[0]?.actor?.viewerContext?.following && !didFollow && (
          <Button variant="outline" size="sm" onClick={doFollow}>
            Follow back
          </Button>
        )}
      </div>
    )
  }