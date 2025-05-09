import type { ItemCast } from "~/types/wc-feed-items"
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { timeAgo } from "~/lib/misc";
// import { MoreHorizontal,  } from 'lucide-react';
// import { Button } from '~/components/ui/button';
import { ImageEmbeds} from '../images-embeds'
import { useMainStore } from "~/store/main";
import { Link, useLocation } from 'react-router';
import type { TweetString } from "~/types/cast/tweet";
import { XIcon } from "~/components/icons/x";
import { TwitterVerifiedIcon } from "~/components/icons/twitter-verified";

const acctionClasses = ['tweet-action']

export const TwitterEmbed = ({tweet, noNavigation = false} : { tweet: TweetString, noNavigation?: boolean }) => {

  const { navigate } = useMainStore()
  const location = useLocation()

  const images = tweet?.photos

  const goToQoutedCast = (e: React.MouseEvent) => {
    if (noNavigation) return
    // if (e.target instanceof HTMLAnchorElement) return
    // if (e.target instanceof HTMLImageElement) return
    // if (location?.pathname?.includes(`/${cast.author.username}/${cast.hash.slice(0,10)}`)) return
    // // check if target has a parent anchor
    // const target = e.target as HTMLElement
    // const parents = [] as HTMLElement[]
    // let parent = target.parentElement
    // for (let i = 0; i < 3; i++) {
    //   if (parent) {
    //     parents.push(parent)
    //     parent = parent.parentElement
    //   }
    // }
    // if (parents.find((parent) => acctionClasses.some((className) => parent.classList.contains(className)))) return

    // navigate(`/${cast.author.username}/${cast.hash.slice(0,10)}`)
  }

  return (
    <div className="w-full mt-2 max-w-xl dark:bg-neutral-800 dark:text-white bg-neutral-200 rounded-lg overflow-hidden action" style={{ maxWidth: '100%' }} onClick={goToQoutedCast} aria-hidden>
       <div className="p-4">
        <div className="block">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-2">
            <Avatar className="h-6 w-6 lg:h-10 lg:w-10 border border-neutral-700 hover:scale-105 transition-transform">
              <AvatarImage src={tweet?.user?.profile_image_url_https} alt={tweet?.user?.name} />
              <AvatarFallback>{tweet?.user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            </span>
            <div className="flex-grow">
              <div className="flex items-center gap-2 relative w-full">
              <span className="font-semibold">{tweet?.user?.screen_name}</span>
                {tweet?.user?.verified && <TwitterVerifiedIcon className="w-4 h-4" /> }
                <span className="text-neutral-400 text-sm">{timeAgo(tweet?.created_at)}</span>
                <XIcon className="absolute right-[-2px] w-4 h-4" />
              </div>
            </div>
          </div>
          {/* <Button variant="ghost" size="icon" className="text-neutral-400">
            <MoreHorizontal size={18} />
          </Button> */}
        </div>
        <div className="mt-3">
            <p>{tweet?.text}</p>
            
            {/* <ImageEmbeds images={ ?? []} /> */}

        </div>
      </div>
      </div>
  );
};