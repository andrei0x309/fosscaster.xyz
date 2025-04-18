import { ArrowLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { UserIcon } from "~/components/icons/user"
import { Modal } from "~/components/functional/modals/modal"
import { useState } from "react"
import { channelRespondToInvite } from "~/lib/api"

import type { TNotificationItem } from './notification-type'

export function ChannelRoleInviteNotification({ notification, onResolved }: { notification: TNotificationItem, onResolved: () => void }) {


    const [resolved, setResolved] = useState([] as string[])
    const [channelInvites, setChannelInvites] = useState(notification.previewItems)

    const checkResolved = (index: number) => {
        const hasResolvedAll = notification.previewItems?.length === (resolved.length + 1)
        setResolved([...resolved, notification.previewItems?.[index]?.content?.channel?.key])
        setChannelInvites(channelInvites.filter(c => !resolved.includes(c.content.channel.key)))
        if(hasResolvedAll) {
            setShowModal(false)
        }
        onResolved()
    }

    const handleInvite = async ({accept, index}: {accept: boolean, index: number}) => {
        await channelRespondToInvite({
            channelKey: notification.previewItems?.[index]?.content?.channel?.key,
            accept,
            role: notification.previewItems?.[index]?.content?.role
        })
        checkResolved(index)
    }

    const [showModal, setShowModal] = useState(false)
  
    return (
        <>
        <div className="rounded-lg p-4 cursor-pointer" onClick={() => {setShowModal(true)}} aria-hidden>
        <div className="flex items-center gap-3 mb-3">
          <UserIcon className="h-8 w-8 rounded-full overflow-hidden" />
          <div className="flex-1">
            <p className="dark:text-white">
              You are invited to become a member of <span className="font-bold">/{ notification?.previewItems?.[0]?.id }</span> 
              { (notification?.totalItemCount || 0) - 1 > 0 ?<>
              and {(notification?.totalItemCount || 0) - 1} other channels.
              </> : ''}
            </p>
          </div>
        </div>

        <div className="dark:bg-zinc-900 bg-zinc-200 rounded-lg p-4 relative">
          { (notification?.totalItemCount - 1) > 0 && <div className="absolute top-2 right-2 dark:bg-zinc-800 bg-zinc-400 dark:text-white text-xs font-bold rounded-full px-2 py-0.5">
            +{notification?.totalItemCount - 1}
          </div>
          }

          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                <AvatarImage src={notification?.previewItems?.[0]?.content?.channel?.fastImageUrl ?? '/placeholder.svg?height=40&width=40'} alt={notification?.previewItems?.[0]?.content?.channel?.name} />
                <AvatarFallback>T</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h3 className="font-bold dark:text-white">/{notification?.previewItems?.[0]?.content?.channel?.key}</h3>
              <p className="text-neutral-400 text-sm">{notification?.previewItems?.[0]?.content?.channel?.followerCount} followers</p>

              <p className="dark:text-blue-200 text-sm mt-2">
                 {notification?.previewItems?.[0]?.content?.channel?.description}
              </p>

              <div className="flex items-center gap-2 mt-3">
                <div className="flex -space-x-2">
                {(notification?.previewItems?.[0]?.content?.channel?.viewerContext?.membersYouKnow?.users ?? []).map((user, index) => (
                  <Avatar className="h-6 w-6 border-2 border-[#18161D] rounded-full overflow-hidden" key={index}>
                    <AvatarImage src={user?.pfp?.url} alt="Avatar" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  ))}
                </div>
                <span className="text-neutral-400 text-xs">{(notification?.previewItems?.[0]?.content?.channel?.viewerContext?.membersYouKnow?.totalCount ?? 0)} members you know</span>
              </div>
            </div>
          </div>
        </div>
      </div>

<Modal isOpen={showModal} setIsOpen={setShowModal}>
<div className="max-h-[70vh] overflow-y-auto">
<div className="max-w-2xl mx-auto p-4">
<div className="flex items-center gap-3 mb-6">
    <ArrowLeft className="h-5 w-5 cursor-pointer hover:scale-105" onClick={() => {setShowModal(false)}} aria-hidden></ArrowLeft>
  <h1 className="text-2xl font-bold">Member Invites</h1>
</div>

<div className="space-y-4">
  {(channelInvites ?? []).map((invite, index) => (
    <div key={index} className="dark:bg-zinc-900 bg-zinc-100 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-full overflow-hidden">
          <AvatarImage src={invite?.content?.channel?.fastImageUrl ?? '/placeholder.svg?height=40&width=40'} alt={invite?.content?.channel?.name} />
          <AvatarFallback>T</AvatarFallback>
          </Avatar>

          <div>
            <p className="font-bold">{invite?.content?.channel?.name}</p>
            <p className="text-sm text-neutral-400">{invite?.actor?.username} invited you</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="bg-[#2D2A33] text-white border-none hover:bg-[#3D3A43]" onClick={() => handleInvite({accept: false, index})}>
            Decline
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleInvite({accept: true, index})}
          >Accept</Button>
        </div>
      </div>
    </div>
  ))}
</div>
</div>
</div>

</Modal>
</>
    )
}