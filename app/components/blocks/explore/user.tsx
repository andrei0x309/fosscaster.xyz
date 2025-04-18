
import type { T_RESP_SUGGESTED_USERS } from '~/types/wc-mod'
import { follow, unfollow } from "~/lib/api"
import { useState, } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"

export function UserItem ({ user, className = '' }: { user: T_RESP_SUGGESTED_USERS['result']['users'][number], className?: string }) {

    const [stateUser, setStateUser] = useState(user)

    const handleFollowUser = async () => {
        try {
            await follow(String(user.fid))
          setStateUser({
                ...user,
                viewerContext: {
                    ...user.viewerContext,
                    following: true
                }
            })
        }
        catch (error) {
            console.error(error)
        }
    }

 const handleUnfollowUser = async () => {
        try {
            await unfollow(String(user.fid))
            setStateUser({
                ...user,
                viewerContext: {
                    ...user.viewerContext,
                    following: false
                }
            })
        }
        catch (error) {
            console.error(error)
        }
    }

    return (
        <div key={stateUser.fid} className={`flex items-start space-x-4 mb-6 ${className}`}>
        <Avatar className="w-10 h-10">
          <AvatarImage src={stateUser.pfp.url} alt={stateUser.username} />
          <AvatarFallback>{stateUser.username}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-semibold flex items-center">
                {stateUser.username}
              </h2>
              <p className="text-neutral-400 text-sm">{stateUser.username}</p>
            </div>
            {!stateUser.viewerContext.following ? (
                <Button variant="secondary" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleFollowUser()}>
                    Follow
                </Button>
            ) : (
                <Button variant="secondary" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleUnfollowUser()}>
                    Unfollow
                </Button>
            )}
          </div>
          <p className="text-sm mt-1">
            {user?.profile?.bio?.text}
          </p>
        </div>
      </div>
    )

}