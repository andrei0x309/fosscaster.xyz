import type { CastElement } from "~/types/wc-feed-items"
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { timeAgo } from "~/lib/misc";
// import { MoreHorizontal,  } from 'lucide-react';
// import { Button } from '~/components/ui/button';
import { ImageEmbeds} from './images-embeds'

export const QoutedCast = ({cast} : { cast: CastElement}) => {

  return (
    <div className="w-full mt-2 max-w-xl dark:bg-neutral-800 dark:text-white bg-neutral-200 rounded-lg overflow-hidden">
       <div className="p-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10 border border-neutral-700">
              <AvatarImage src={cast.author?.pfp?.url} alt={cast.author?.displayName} />
              <AvatarFallback>{cast.author?.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{cast?.author?.username}</span>
                <span className="text-neutral-400 text-sm">in</span>
                {cast?.tags?.[0] && (
                  <div className="flex items-center gap-1 dark:bg-neutral-600 bg-neutral-300 rounded-full px-2 py-0.5 text-sm">
                    {cast?.tags?.[0].imageUrl && (
                      <span className="h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-xs">
                        <img src={cast?.tags?.[0].imageUrl} alt={cast?.tags?.[0].name} className="h-full w-full object-cover rounded-full" />
                      </span>
                    )}
                    <span>{cast?.tags?.[0].name}</span>
                  </div>
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