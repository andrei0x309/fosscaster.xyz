import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { useState, useEffect, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { MessageSquare, Repeat2, Heart, Users, MoreHorizontal, Bookmark, Share2, UserPlus } from "lucide-react"
import { CastHeader } from "~/components/blocks/header/cast-header"
import { getNotifsByTab } from '~/lib/api'
import { useImmer } from 'use-immer'
import { NotificationItem } from '~/components/blocks/notifications/notification-item'

export default function NotificationsUI({className = ''}: {className?: string}) {

  const [activeTab, setActiveTab] = useState('priority')
  const [notifs, setNotifs] = useImmer({} as Awaited<ReturnType<typeof getNotifsByTab>>)

  const handleTabChange = useCallback(async (tab: string) => {
    setActiveTab(tab)
    const notifs = await getNotifsByTab({tab})
    setNotifs(notifs)
    console.log(notifs)
  }, [setActiveTab, setNotifs])


  useEffect(() => {
    handleTabChange(activeTab)
  }, [activeTab, handleTabChange])

  return (
    <main className={`h-full w-full shrink-0 justify-center sm:w-[540px] lg:w-[680px] ${className}`}>
        <div className="h-full min-h-screen">

      <div className="sticky bg-white dark:bg-neutral-950 top-0 z-10 flex-col border-b-0 bg-app border-default h-26 p-2">
      <CastHeader title="Notifications" />
      <Tabs className="w-full" value={activeTab}>
          <TabsList className="grid w-full grid-cols-6 bg-zinc-800">
            <TabsTrigger value="priority" onClick={() => handleTabChange('priority')}>Priority</TabsTrigger>
            <TabsTrigger value="channels" onClick={() => handleTabChange('channels')}>Channels</TabsTrigger>
            <TabsTrigger value="mentions" onClick={() => handleTabChange('mentions')}>Mentions</TabsTrigger>
            <TabsTrigger value="likes" onClick={() => handleTabChange('likes')}>Likes</TabsTrigger>
            <TabsTrigger value="follows" onClick={() => handleTabChange('follows')}>Follows</TabsTrigger>
            <TabsTrigger value="other" onClick={() => handleTabChange('other')}>Other</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

 
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="priority" className="mt-4 space-y-4">
            {notifs?.result?.notifications?.map((notification, index) => (
              <NotificationItem key={index} notification={notification} />
            ))}
          </TabsContent>
          <TabsContent value="mentions" className="mt-4 space-y-4">
            <MentionItem
              avatar="/placeholder.svg?height=40&width=40"
              username="koisose.lol"
              handle="@koisose"
              time="12h"
              content="thanks for your hardwork man, my lazy arse now can login on desktop without scanning qr code lol"
              likes={1}
              replyTo="@andrei0x309"
              extraInfo="/base"
            />
            <MentionItem
              avatar="/placeholder.svg?height=40&width=40"
              username="3d1t"
              handle="@3d1t"
              time="13h"
              content="The tipped amount of 330 is more than the remaining tips of 1."
              replyTo="@andrei0x309"
              embeddedContent={{
                title: "Degen Lotto",
                subtitle: "frames.baby",
                buttonText: "View"
              }}
            />
            <MentionItem
              avatar="/placeholder.svg?height=40&width=40"
              username="kk"
              handle="@king"
              time="1d"
              content="I love you too"
              likes={1}
              replyTo="@andrei0x309"
            />
            <MentionItem
              avatar="/placeholder.svg?height=40&width=40"
              username="J. Valeska 🃏"
              handle="@j-valeska"
              time="1d"
              content="got it, I should not operate a wallet, but I am doing it, so.. triple eye..

at least with the wallet cannot hurt others like a drunk driver.."
              likes={1}
              replies={1}
              replyTo="@andrei0x309"
            />
            <MentionItem
              avatar="/placeholder.svg?height=40&width=40"
              username="agusti 🧠"
              handle="@bleu.eth"
              time="1d"
              content="DON'T TRANSACT 😺"
              likes={1}
              replyTo="@andrei0x309"
            />
          </TabsContent>
          <TabsContent value="likes" className="mt-4 space-y-4">
            <LikeItem
              avatars={["/placeholder.svg?height=40&width=40", "/placeholder.svg?height=40&width=40"]}
              username="Edmund Edgar (goat/acc)"
              content="Hmm no safety check before sending... What probably happened the number was initialized with 0, query to get the count failed to set to a new number but execution continued, no check the number was positive before sending, hence 0 followers."
            />
            <LikeItem
              avatars={["/placeholder.svg?height=40&width=40", "/placeholder.svg?height=40&width=40", "/placeholder.svg?height=40&width=40"]}
              username="Jiro and 2 others"
              content="I learned that operating a wallet is pretty much very similar to operating a car, don't do it if you're drunk don't do it if you lack too much sleep, like your car, when you're in those states it's better to keep it locked...."
            />
            <LikeItem
              avatars={["/placeholder.svg?height=40&width=40"]}
              username="agusti 🧠"
              content="That sounds like Bryan Johnson type of thing, but I am sure he didn't get drunk in the last 5 years at least. 🙂"
              showViewCast={true}
            />
            <LikeItem
              avatars={["/placeholder.svg?height=40&width=40", "/placeholder.svg?height=40&width=40", "/placeholder.svg?height=40&width=40", "/placeholder.svg?height=40&width=40", "/placeholder.svg?height=40&width=40"]}
              username="Haole and 4 others"
              content="I heard that @warpcast finally wants to allow any farcaster user that was not created with Warpcast to use the client. Here is a chart flow of what Warpcast must do to allow that, I already use Warpcast this way by modifying its behavior with the accou..."
            />
            <LikeItem
              avatars={["/placeholder.svg?height=40&width=40"]}
              username="downshift"
              content="Yes, the signature must come from a wallet that has ownership of the FID, this can be done both on mobile & web. You can't generate a warpcast auth token without the owner's signature, also you can't add delete signers without the signature from the..."
            />
            <LikeItem
              avatars={["/placeholder.svg?height=40&width=40", "/placeholder.svg?height=40&width=40"]}
              username="tradehigher.base.eth and 1 other"
              content="I mean followings and followers can be slightly wrong at Neynar they said is a cache"
            />
          </TabsContent>
          <TabsContent value="follows" className="mt-4 space-y-4">
            <FollowItem
              avatars={["/placeholder.svg?height=40&width=40", "/placeholder.svg?height=40&width=40", "/placeholder.svg?height=40&width=40"]}
              username="Leshka [MEME IN BIO] and 1 other"
            />
            <FollowItem
              avatars={["/placeholder.svg?height=40&width=40"]}
              username="borst ↑"
            />
            <FollowItem
              avatars={["/placeholder.svg?height=40&width=40"]}
              username="ccarella"
            />
            <FollowItem
              avatars={["/placeholder.svg?height=40&width=40"]}
              username="tradehigher.base.eth"
              showFollowBack={true}
            />
            <FollowItem
              avatars={["/placeholder.svg?height=40&width=40"]}
              username="Erick"
              showFollowBack={true}
            />
            <FollowItem
              avatars={["/placeholder.svg?height=40&width=40", "/placeholder.svg?height=40&width=40", "/placeholder.svg?height=40&width=40"]}
              username="{*_*} !. Christwin 🦁 and 2 others"
            />
            <FollowItem
              avatars={["/placeholder.svg?height=40&width=40"]}
              username="Stef (M)"
            />
            <FollowItem
              avatars={["/placeholder.svg?height=40&width=40"]}
              username="3070 ✅"
            />
            <FollowItem
              avatars={["/placeholder.svg?height=40&width=40", "/placeholder.svg?height=40&width=40", "/placeholder.svg?height=40&width=40"]}
              username="downshift and 2 others"
            />
          </TabsContent>
          <TabsContent value="other" className="mt-4 space-y-4">
            <p className="text-zinc-400">Other notifications will appear here.</p>
          </TabsContent>
        </Tabs>
    </div>
    </main>
  )
}

// function NotificationItem({ avatar, username, content, subContent, likes, replies, isReply, isLike, isRecast }) {
//   return (
//     <div className="flex items-start space-x-4 pb-4 border-b border-zinc-800">
//       <Avatar className="w-10 h-10">
//         <AvatarImage src={avatar} />
//         <AvatarFallback>UN</AvatarFallback>
//       </Avatar>
//       <div className="flex-1 space-y-1">
//         <p className="text-sm font-medium">{username} {isLike && <Heart className="inline w-4 h-4 text-red-500" />} {isRecast && <Repeat2 className="inline w-4 h-4 text-green-500" />}</p>
//         <p className="text-sm text-zinc-400">{content}</p>
//         {subContent && <p className="text-xs text-zinc-500">{subContent}</p>}
//         {(likes || replies || isReply) && (
//           <div className="flex items-center space-x-4 text-xs text-zinc-500">
//             {isReply && <MessageSquare className="w-4 h-4" />}
//             {likes && <><Heart className="w-4 h-4" /> {likes} like</>}
//             {replies && <><MessageSquare className="w-4 h-4" /> {replies} reply</>}
//           </div>
//         )}
//       </div>
//       <div className="flex items-center space-x-2">
//         <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white">
//           <Users className="h-4 w-4" />
//         </Button>
//         <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white">
//           <Bookmark className="h-4 w-4" />
//         </Button>
//         <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white">
//           <Share2 className="h-4 w-4" />
//         </Button>
//         <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white">
//           <MoreHorizontal className="h-4 w-4" />
//         </Button>
//       </div>
//     </div>
//   )
// }

function MentionItem({ avatar, username, handle, time, content, likes, replies, replyTo, extraInfo, embeddedContent }) {
  return (
    <div className="flex items-start space-x-4 pb-4 border-b border-zinc-800">
      <Avatar className="w-10 h-10">
        <AvatarImage src={avatar} />
        <AvatarFallback>{username[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium">{username}</span>
            <span className="text-zinc-500"> {handle} · {time}</span>
          </div>
          <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-zinc-400">Replying to <span className="text-purple-400">{replyTo}</span></p>
        <p className="text-sm">{content}</p>
        {embeddedContent && (
          <div className="mt-2 border border-zinc-700 rounded-md p-2 flex items-center justify-between">
            <div>
              <p className="font-medium">{embeddedContent.title}</p>
              <p className="text-sm text-zinc-500">{embeddedContent.subtitle}</p>
            </div>
            <Button variant="secondary" size="sm">{embeddedContent.buttonText}</Button>
          </div>
        )}
        <div className="flex items-center space-x-4 mt-2">
          <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white">
            <MessageSquare className="h-4 w-4 mr-1" />
            {replies && replies}
          </Button>
          <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white">
            <Repeat2 className="h-4 w-4 mr-1" />
          </Button>
          <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white">
            <Heart className="h-4 w-4 mr-1" />
            {likes && likes}
          </Button>
          <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white">
            <Bookmark className="h-4 w-4 mr-1" />
          </Button>
          <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white">
            <Share2 className="h-4 w-4 mr-1" />
          </Button>
        </div>
        {extraInfo && <p className="text-xs text-zinotificationsnc-500 mt-1">{extraInfo}</p>}
      </div>
    </div>
  )
}

function LikeItem({ avatars, username, content, showViewCast = false }) {
  return (
    <div className="flex items-start space-x-4 pb-4 border-b border-zinc-800">
      <div className="flex -space-x-2 overflow-hidden">
        {avatars.map((avatar, index) => (
          <Avatar key={index} className="w-10 h-10 border-2 border-zinc-900">
            <AvatarImage src={avatar} />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
        ))}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            {username} <span className="text-zinc-500">liked your cast</span>
          </p>
          <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-zinc-400 line-clamp-2">{content}</p>
        {showViewCast && (
          <Button variant="outline" size="sm" className="mt-2">
            View cast
          </Button>
        )}
      </div>
    </div>
  )
}

function FollowItem({ avatars, username, showFollowBack = false }) {
  return (
    <div className="flex items-center space-x-4 pb-4 border-b border-zinc-800">
      <UserPlus className="w-4 h-4 text-zinc-500" />
      <div className="flex -space-x-2 overflow-hidden">
        {avatars.map((avatar, index) => (
          <Avatar key={index} className="w-10 h-10 border-2 border-zinc-900">
            <AvatarImage src={avatar} />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
        ))}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">
          {username} <span className="text-zinc-500">followed you</span>
        </p>
      </div>
      {showFollowBack && (
        <Button variant="outline" size="sm">
          Follow back
        </Button>
      )}
    </div>
  )
}