// import { Heart, MessageCircle, Repeat2, Share2, MoreHorizontal, Bookmark, BarChart2, UserRoundPlus } from "lucide-react"
// import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
// import { Button } from "~/components/ui/button"
// import { timeAgo } from '~/lib/misc';
import type { TNotificationItem } from './not-types/notification-type'
import { ReactionNotification } from './not-types/reaction'
import { MiniAppNotification } from "./not-types/mini-app";
import { FollowNotification } from "./not-types/follow";
import { TrendingToken } from './not-types/trending-token'
import { WalletActivityNotification } from './not-types/wallet-activity';
import { Post } from "../post";
import { ChannelRoleInviteNotification } from "./not-types/channel-role-invite";
import { GenericNotification } from "./not-types/warpcast-generic";
import { ConnectAccount } from "./not-types/connect-account";
import { TipNotification } from "./not-types/tip";

export const NotificationItem = ({ notification, onInviteResolved }: { notification: TNotificationItem, onInviteResolved: () => void }) => {

  return (
    <>
      {notification.type === 'cast-reply' || notification.type === 'cast-mention' ?
        <Post item={notification.previewItems[0].content} showReplyTo={true} /> : ''}

      {notification.type === 'cast-reaction' ?
        <ReactionNotification notification={notification} />
        : ''}

      {notification.type === 'mini-app' ?
      <MiniAppNotification notification={notification} />
      : ''}

      {notification.type === 'channel-role-invite' ?
      <ChannelRoleInviteNotification notification={notification} onResolved={onInviteResolved} />
      : ''}

      {notification.type === 'channel-pinned-cast' ?
      <Post item={notification.previewItems[0].content} isAnnouncement={true} />
      : ''}

      {notification.type === 'follow' ?
      <FollowNotification notification={notification} />
      : ''}

      {notification.type === 'wallet-activity' ?
      <WalletActivityNotification notification={notification} />
      : ''}

      {notification.type === 'tip-received' ? 
      <TipNotification notification={notification} /> 
      : ''}

      {notification.type === 'trending-token' ?
      <TrendingToken notification={notification} />
      : ''}
      
      {notification.type === 'generic' ?
      <GenericNotification notification={notification} />
      : ''}

    {notification.type === 'connect-account' ?
      <ConnectAccount notification={notification} />
      : ''}
    
    </>)

}