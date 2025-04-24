import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { MoreHorizontal, MessageCircle, Repeat2, Heart, MoreVertical, BookmarkIcon, Share2, Delete, ExternalLink } from 'lucide-react';
import { timeAgo } from '~/lib/misc';
import { Link } from 'react-router';
import { PopOverMenu, PopOverMenuItem } from "~/components/blocks/drop-menu"
import { useState, useEffect } from 'react';
import { useMainStore } from '~/store/main';
import { useDeleteCastEvent } from '~/store/events/delete-cast';
import type { Item, ItemCast } from '~/types/wc-feed-items';
import { 
  deleteCast as apiDeleteCast,
  deleteLike,
  likeCast,
  addToBookmark,
  removeFromBookmark,
  recast,
  undoRecast
 } from '~/lib/api';
import { Badge } from '~/components/ui/badge';
import { VideoJS } from '~/components/blocks/video'
import { MiniAppInCast } from '~/components/blocks/cast/mini-app-in-cast';
import { QoutedCast } from '~/components/blocks/cast/qouted-cast';
import { ImageEmbeds } from '~/components/blocks/cast/images-embeds';
import { PinIcon } from '~/components/icons/pin';
import { AnnouncementIcon } from '~/components/icons/announcement';
import { KeyIcon } from '~/components/icons/key';
import { useToast } from '~/hooks/use-toast';

type TCast = Item | Record<string, any>

const acctionClasses = ['action', 'video-js']

export const Post = (
  { item,
    isComposeReply = false,
    isAnnouncement = false,
    showReplyTo = false,
    noNavigate = false,
  } : 
  { 
    item: TCast,
    isComposeReply?: boolean,
    isAnnouncement?: boolean
    showReplyTo?: boolean
    noNavigate?: boolean
  }) => {
  const { mainUserData, navigate, setComposeModalData, isUserLoggedIn, setConnectModalOpen, setComposeModalOpen } = useMainStore()
  const { toast } = useToast()

  const { sendDeleteCast } = useDeleteCastEvent()
 
  const [isOwnCast, setIsOwnCast] = useState(false)
  const [cast, setCast] = useState(item.cast) as [Item["cast"] , React.Dispatch<React.SetStateAction<TCast>>]
  
  const [isLiked, setIsLiked] = useState(cast?.viewerContext?.reacted)
  const [isLikeLoading, setIsLikeLoading] = useState(false)

  const [isBookmarked, setIsBookmarked] = useState(cast?.viewerContext?.bookmarked)
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false)

  const [isRecasted, setIsRecasted] = useState(cast?.viewerContext?.recast)
  const [isRecastLoading, setIsRecastLoading] = useState(false)

  

  const [miniApps, setMiniApps] = useState([] as Item['cast']['embeds']['urls'][number]['openGraph']['frameEmbedNext'][])
  const [qoutedCasts, setQoutedCasts] = useState([] as Item['cast']['embeds']['casts'])
 
  const deleteCast = async () => {
    const deletedCast = await apiDeleteCast(cast.hash)
    if (deletedCast) {
      sendDeleteCast({ hash: cast.hash })
      toast({
        title: 'Cast deleted',
        description: 'Your cast has been deleted',
        variant: 'default'
      })
    } else {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive'
      })
    }
  }

  const goToWarpcast = () => {
    window.open(`https://warpcast.com/${cast.author.username}/${cast.hash.slice(0,10)}`, '_blank')
  }

  useEffect(() => {
    emptyEmbeds()
    setCast(item.cast)
    parseEmbeds(item?.cast?.embeds)
    if (mainUserData?.username && cast?.author?.username === mainUserData?.username) {
      setIsOwnCast(true)
    }
  }, [cast, item, mainUserData?.username])

  const emptyEmbeds = () => {
    setMiniApps([])
    setQoutedCasts([])
  }

  const parseText = (text: string) => {
    if(!text) return null
    let parseKeyCounter = 0
    const renderElements = [] as JSX.Element[]
    let remaingText = text
    const regex = /(?:^|\s)(@[a-zA-Z-.0-9]+)(?!\S)/g
    const mentions = text.match(regex)
    if (mentions) {
      mentions.forEach((mention) => {
        parseKeyCounter++
        const index = remaingText.indexOf(mention)
        const before = remaingText.slice(0, index)
        const after = remaingText.slice(index + mention.length)
        renderElements.push(<span key={`s${parseKeyCounter}-${mention}`}>{before}</span>)
        renderElements.push(<Link key={`l${parseKeyCounter}-${mention}`} to={`/${mention.slice(1)}`} className="text-red-600 hover:text-red-700">{mention}</Link>)
        remaingText = after
      })
    } else {
      parseKeyCounter++
      remaingText = ''
      renderElements.push(<span key={`s${parseKeyCounter}`}>{text}</span>)
    }
    if (remaingText) {
      parseKeyCounter++
      renderElements.push(<span key={`s${parseKeyCounter}`}>{remaingText}</span>)
    }
    // Parse links 
    const newRenderElements = [] as JSX.Element[]
    const linkRegex = /.*?(https?:\/\/[a-zA-Z0-9./\-?&%:=_#@]+).*?/g
    renderElements.forEach((element) => {
      parseKeyCounter++
      if(element.type !== 'span') {
        newRenderElements.push(element)
        return
      }
      let text = element.props.children
      const links = Array.from(text.matchAll(linkRegex)).map((match) => (match as string)?.[1]).filter(Boolean)
      if(links?.length) {
        links.forEach((link) => {
          parseKeyCounter++
          const index = text.indexOf(link)
          const before = text.slice(0, index)
          const after = text.slice(index + link.length)
          newRenderElements.push(<span key={`s${parseKeyCounter}`}>{before}</span>)
          newRenderElements.push(<a key={`l${parseKeyCounter}`} href={link} target="_blank" rel="noreferrer" className="text-red-600 hover:text-red-700">{link}</a>)
          parseKeyCounter++
          text = after
        })
      }
      if (text) {
        parseKeyCounter++
        newRenderElements.push(<span key={`s${parseKeyCounter}`}>{text}</span>)
      }
    })
    return newRenderElements
  }

  const parseEmbeds = (embeds: Item['cast']['embeds']) => {
    if (!embeds) return
    const foundMiniApps = [] as Item['cast']['embeds']['urls'][number]['openGraph']['frameEmbedNext'][]
    const foundQoutedCasts = [] as Item['cast']['embeds']['casts']

      embeds?.urls?.forEach((url) => {
        if (url.openGraph.frameEmbedNext) {
          foundMiniApps.push(url.openGraph.frameEmbedNext)
        }
      })

      embeds?.casts?.forEach((embedcast) => {
        foundQoutedCasts.push(embedcast)
      })
      
      if(foundMiniApps.length) {
        setMiniApps(foundMiniApps)
      }

      if(foundQoutedCasts.length) {
        setQoutedCasts(foundQoutedCasts)
      }
  }

  const goToCast = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLAnchorElement) return
    if (e.target instanceof HTMLImageElement) return
    if (e.target instanceof HTMLButtonElement) return
    if (e.target instanceof HTMLElement && e.target.getAttribute('role') === 'menuitem') return
    if (noNavigate) return
    // check if target has a parent anchor
    const target = e.target as HTMLElement
    const parents = [] as HTMLElement[]
    let parent = target.parentElement
    for (let i = 0; i < 5; i++) {
      if (parent) {
        parents.push(parent)
        parent = parent.parentElement
      }
    }
    const hasActionParent = parents.find((parent) => acctionClasses.some((className) => parent.classList.contains(className)))
    if (hasActionParent) return

    navigate(`/${cast.author.username}/${cast.hash.slice(0,10)}`)
  }

  const onLike = async () => {
    if(!checkedLogin()) return
    if (isLikeLoading) return
    setIsLikeLoading(true)
    try {
    if (isLiked) {
      await deleteLike(cast.hash)
      cast.reactions.count -= 1
    } else {
      await likeCast(cast.hash)
      cast.reactions.count += 1
    }
    setCast(cast)
    }
    catch (error) {
      console.error(error)
    }
    setIsLikeLoading(false)
    setIsLiked(!isLiked)
  }

  const onBookmark = async () => {
    if(!checkedLogin()) return
    if (isBookmarkLoading) return
    setIsBookmarkLoading(true)
    try {
    if (isBookmarked) {
      await removeFromBookmark(cast.hash)
      setIsBookmarked(false)
    } else {
      await addToBookmark(cast.hash)
      setIsBookmarked(true)
    }}
    catch (error) {
      console.error(error)
    }
    setIsBookmarkLoading(false)
  }

  const getVideoJsOptions = ({ source }: { source: string }) => {
    return {
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: false,
      sources: [{
        src: source
      }]
    }
  }

  const checkedLogin = () => {
     if(!isUserLoggedIn) {
       setConnectModalOpen(true)
       return false
     }
     return true
  }

  const doReplyCast = () => {
    if(!checkedLogin()) return
    setComposeModalData({
      reply: item as Item
    })
    setComposeModalOpen(true)
  }


  const doRecast = async() => {
    if(!checkedLogin()) return
    if (isRecastLoading) return
    try {
      setIsRecastLoading(true)
      await recast(cast.hash)
      cast.recasts.count = cast.recasts.count + 1
      setCast(cast)
      setIsRecasted(true)
      setIsRecastLoading(false)
    }
    catch (error) {
      console.error(error)
      setIsRecastLoading(false)
    }
  }

  const doUnRecast = async() => {
    if(!checkedLogin()) return
    if (isRecastLoading) return
    try {
      setIsRecastLoading(true)
      await undoRecast(cast.hash)
      cast.recasts.count = cast.recasts.count - 1
      setCast(cast)
      setIsRecasted(false)
      setIsRecastLoading(false)
    }
    catch (error) {
      console.error(error)
      setIsRecastLoading(false)
    }
  }

  const doQouteCast = () => {
    if(!checkedLogin()) return
    setComposeModalData({
      quote: cast
    })
    setComposeModalOpen(true)
  }

  return (
    cast && <div style={{ wordBreak: 'break-word' }} className={`p-4 hover:bg-neutral-100 dark:hover:bg-neutral-900 border-neutral-400/50 ${!isComposeReply ? 'border-b': ''}`} onClick={!isComposeReply? goToCast: () => {}} tabIndex={0} role='button' aria-hidden="true">
                  
                  {cast?.pinned && 
                  <div className="mb-1 flex flex-row items-center text-[12px] text-faint">
                    <div className="mr-2 flex flex-row items-center justify-end text-right"
                    ><PinIcon className="mr-1 h-3 w-3" />
                    </div>
                    <div>Pinned</div>
                  </div>
                  }

                  {isAnnouncement && 
                  <div className="mb-1 flex flex-row items-center text-[12px] text-faint">
                    <div className="mr-2 flex flex-row items-center justify-end text-right"
                    ><AnnouncementIcon className="mr-1 h-3 w-3" />
                    </div>
                    <div>Announcement</div>
                    </div>
                  }
                  
                  <div className="flex space-x-4 relative">
                  { isComposeReply && <div className="absolute w-0.5 dark:bg-neutral-800 bg-neutral-300 left-[19px] top-10 bottom-[0%]"></div> }
                    <Avatar className={`hover:border-2 ${isComposeReply? '!m-0': ''}`}>
                      <Link to={`/${cast.author.username}`}>
                      <AvatarImage src={cast.author.pfp.url} alt={`User ${cast.author.displayName}`} />
                      <AvatarFallback>{cast.author.displayName.slice(0,2)}</AvatarFallback>
                      </Link>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <div className="flex pace-x-1">
                          <Link to={`/${cast.author.username}`}>
                          <span className="font-semibold">{cast.author.displayName}</span>
                          </Link>
                          <Link to={`/${cast.author.username}`}>
                          <span className="text-neutral-500 ml-2">@{cast.author.username}</span>
                          </Link>
                          <span className="text-neutral-500 ml-2">·</span>
                          <span className="text-neutral-500 ml-2">{timeAgo(cast.timestamp as unknown as string)}</span>
                          </div>
                          { showReplyTo && cast?.parentAuthor?.username && <div className="flex items-center space-x-1">
                          <div className="text-neutral-500 text-sm mt-1 action">
                            Replying to <Link to={`/${cast?.parentAuthor?.username ?? ''}`}><span className="text-red-400">@{ cast?.parentAuthor?.username}</span></Link>
                          </div>
                          </div>}
                        </div>

                        <div className="flex items-center space-x-2 action">
                        {!isComposeReply && <PopOverMenu 
                          trigger={<Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>}
                          content= {
                            <>
                            {isOwnCast && <PopOverMenuItem className="cursor-pointer action" onClick={deleteCast}>
                              <Delete className="h-4 w-4 mr-1" />
                              Delete</PopOverMenuItem>}
                              <PopOverMenuItem className="cursor-pointer action" onClick={goToWarpcast}>
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View on Warpcast</PopOverMenuItem>
                            
                            </>
                          } /> }
                                                  {cast?.tags?.[0]?.id ? 
                        
                        <Badge variant="outline" className="text-neutral-500" onClick={() => navigate(`/~/channel/${cast?.tags?.[0]?.id}`)}>
                          <Avatar className="w-4 h-4 mr-2">
                            <AvatarImage src={cast?.tags?.[0]?.imageUrl} alt={cast?.tags?.[0]?.name} />
                            <AvatarFallback>{cast?.tags?.[0]?.id}</AvatarFallback>
                          </Avatar>
                          {cast?.tags?.[0]?.id}
                          </Badge> : null}
                        </div>
                      </div>
                      <div className="mt-2 whitespace-pre-wrap">{parseText(cast.text as string)}</div>
                      
                      {cast.embeds?.videos?.map((video, i) => 

                      <div key={`${i}${video?.duration ?? ''}${video?.sourceUrl?.slice(6)}`} className='post-video flex mx-auto my-4 max-h-[500px]'>
                        <VideoJS  options={getVideoJsOptions({ source: video?.sourceUrl})} />
                        </div>
                      )}
                                            
                      <ImageEmbeds images={cast?.embeds?.images} />
                  

                {miniApps?.length ? miniApps.map((app, i) => <MiniAppInCast key={i} app={app} />) : null}

                {qoutedCasts?.length ? qoutedCasts.map((cast, i) => <QoutedCast key={i} cast={cast as ItemCast} noNavigation={noNavigate} />) : null}
      
                      {!isComposeReply && <div className="mt-2 flex items-center justify-between text-neutral-500">
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" className="text-neutral-500 action" onClick={doReplyCast}>
                            <MessageCircle className="h-4 w-4 mr-1" />
                            <span className="text-neutral-500">{cast.replies.count}</span>
                            <span className="sr-only">Comments</span>
                          </Button>

                          {isRecasted && 
                                  <Button disabled={isRecastLoading} variant="ghost" size="sm" className="text-green-700 action" onClick={doUnRecast}>
                                  <Repeat2 className="h-4 w-4 mr-1" />
                                  <span className="text-neutral-500">{cast.recasts.count}</span>
                                  <span className="sr-only">Recasts</span>
                                </Button>
                           }      

                          {!isRecasted && <PopOverMenu 
                          trigger={
                            <Button variant="ghost" size="sm" className="text-neutral-500 action">
                            <Repeat2 className="h-4 w-4 mr-1" />
                            <span className="text-neutral-500">{cast.recasts.count}</span>
                            <span className="sr-only">Recasts</span>
                          </Button>
                          }
                          content= {
                            <>
                              <PopOverMenuItem disabled={isRecastLoading} className="cursor-pointer" onClick={doRecast}>
                              <Repeat2 className="h-4 w-4 mr-1" />
                              Recast</PopOverMenuItem>
                              <PopOverMenuItem className="cursor-pointer" onClick={doQouteCast}>
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Qoute</PopOverMenuItem>
                            </>
                          } /> }


                          <Button variant="ghost" size="sm" className={`${isLiked ? 'text-red-800' : 'text-neutral-500'} ${isLikeLoading ? 'pulse-with-blur': ''  } action`} onClick={onLike}>
                            <Heart fill={ isLiked ? '#c7090c' : 'none' } className="h-4 w-4 mr-1" />
                            <span className="text-neutral-500">{cast.reactions.count}</span>
                            <span className="sr-only">Likes</span>
                          </Button>
                        </div>
                        <div className="flex items-center space-x-4 action">
                          <Button variant="ghost" size="sm" className="text-neutral-500">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More actions</span>
                          </Button>
                          <Button variant="ghost" size="sm" className={`text-neutral-500 ${isBookmarkLoading ? 'pulse-with-blur': ''  } action`} onClick={onBookmark}>
                            <BookmarkIcon  fill={ isBookmarked ? 'currentColor' : 'none' } className="h-4 w-4 dark:text-neutral-300 text-neutral-800" />
                            <span className="sr-only">Bookmark</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-neutral-500">
                            <Share2 className="h-4 w-4" />
                            <span className="sr-only">Share</span>
                          </Button>
                        </div>
                      </div>
                      }
                    </div>
                  </div>

                  {cast?.client && 
                  <div className="mt-2 flex flex-row items-center text-[10px] justify-end text-faint action">
                    <div className="mr-2 flex flex-row items-center justify-end text-right"
                    ><KeyIcon className="h-3 w-3" />
                    </div>
                    <div>Signed by <Link className='hover:underline' to={`/${cast.client.username}`}>{cast.client.username}</Link></div>
                  </div>
                  }
                </div>
  )
}

// css

