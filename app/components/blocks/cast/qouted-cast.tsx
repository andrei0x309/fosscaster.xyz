import type { ItemCast } from "~/types/wc-feed-items"
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { timeAgo } from "~/lib/misc";
// import { MoreHorizontal,  } from 'lucide-react';
// import { Button } from '~/components/ui/button';
import { ImageEmbeds} from './images-embeds'
import { useMainStore } from "~/store/main";
import { Link, useLocation } from 'react-router';

const acctionClasses = ['qouted-action']

export const QoutedCast = ({cast, noNavigation = false} : { cast: ItemCast, noNavigation?: boolean }) => {

  const { navigate } = useMainStore()
  const location = useLocation()

  const goToQoutedCast = (e: React.MouseEvent) => {
    if (noNavigation) return
    if (e.target instanceof HTMLAnchorElement) return
    if (e.target instanceof HTMLImageElement) return
    if (location?.pathname?.includes(`/${cast.author.username}/${cast.hash?.slice(0,10)}`)) return
    // check if target has a parent anchor
    const target = e.target as HTMLElement
    const parents = [] as HTMLElement[]
    let parent = target.parentElement
    for (let i = 0; i < 3; i++) {
      if (parent) {
        parents.push(parent)
        parent = parent.parentElement
      }
    }
    if (parents.find((parent) => acctionClasses.some((className) => parent.classList.contains(className)))) return

    navigate(`/${cast.author.username}/${cast.hash?.slice(0,10)}`)
  }

  return (
    <div className="w-full mt-2 max-w-xl dark:bg-neutral-800 dark:text-white bg-neutral-200 rounded-lg overflow-hidden action" style={{ maxWidth: '100%' }} onClick={goToQoutedCast} aria-hidden>
       <div className="p-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Link to={`/${cast.author.username}`} className="flex items-center gap-2">
            <Avatar className="h-6 w-6 lg:h-10 lg:w-10 border border-neutral-700 hover:scale-105 transition-transform">
              <AvatarImage src={cast.author?.pfp?.url} alt={cast.author?.displayName} />
              <AvatarFallback>{cast.author?.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            </Link>
            <div>
              <div className="flex items-center gap-2">
              <Link to={`/${cast.author.username}`} className="font-semibold hover:underline">
              <span className="font-semibold">{cast?.author?.username}</span>
              </Link>
                {cast?.tags?.[0] && (
                  <>
                  <span className="text-neutral-400 text-sm">in</span>
                  <div className="flex items-center gap-1 dark:bg-neutral-600 bg-neutral-300 rounded-full px-2 py-0.5 text-sm">
                    {cast?.tags?.[0].imageUrl && (
                      <span className="h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-xs">
                        <img src={cast?.tags?.[0].imageUrl} alt={cast?.tags?.[0].name} className="h-full w-full object-cover rounded-full" />
                      </span>
                    )}
                    <span>{cast?.tags?.[0].name}</span>
                  </div>
                  </>
                )}
                <span className="text-neutral-400 text-sm">{timeAgo(cast?.timestamp)}</span>
              </div>
            </div>
          </div>
          {/* <Button variant="ghost" size="icon" className="text-neutral-400">
            <MoreHorizontal size={18} />
          </Button> */}
        </div>
        <div className="mt-3">
            <p>{cast?.text}</p>
            
            <ImageEmbeds images={cast?.embeds?.images ?? []} />

        </div>
      </div>
      </div>
  );
};