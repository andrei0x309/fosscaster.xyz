import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { MoreHorizontal, MessageCircle, Repeat2, Heart, MoreVertical, BookmarkIcon, Share2, Delete, ExternalLink } from 'lucide-react';
import { timeAgo } from '~/lib/misc';
import { Link } from '@remix-run/react'
import { PopOverMenu, PopOverMenuItem } from "~/components/blocks/drop-menu"
import { useState, useEffect } from 'react';
import { useMainStore } from '~/store/main';
import { useDeleteCastEvent } from '~/store/events/delete-cast';
import type { Item } from '~/types/wc-feed-items';
import { 
  deleteCast as apiDeleteCast,
  deleteLike,
  likeCast,
  addToBookmark,
  removeFromBookmark
 } from '~/lib/api';
import { Badge } from '~/components/ui/badge';
import { VideoJS } from '~/components/blocks/video'
import { MiniAppInCast } from '~/components/blocks/cast/mini-app-in-cast';
import { QoutedCast } from '~/components/blocks/cast/qouted-cast';
import { ImageEmbeds } from '~/components/blocks/cast/images-embeds';

type TCast = Item | Record<string, any>

const acctionClasses = ['action', 'video-js']

export const Post = ({ item, i, isComposeReply = false } : { item: TCast, i: number, isComposeReply?: boolean }) => {
  const { mainUserData, navigate, setComposeModalData, isUserLoggedIn, setConnectModalOpen, setComposeModalOpen } = useMainStore()
  const { sendDeleteCast } = useDeleteCastEvent()
 
  const [isOwnCast, setIsOwnCast] = useState(false)
  const [cast, setCast] = useState(item.cast) as [Item["cast"] , React.Dispatch<React.SetStateAction<TCast>>]
  
  const [isLiked, setIsLiked] = useState(cast?.viewerContext?.reacted)
  const [isLikeLoading, setIsLikeLoading] = useState(false)

  const [isBookmarked, setIsBookmarked] = useState(cast?.viewerContext?.bookmarked)
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false)

  const [miniApps, setMiniApps] = useState([] as Item['cast']['embeds']['urls'][number]['openGraph']['frameEmbedNext'][])
  const [qoutedCasts, setQoutedCasts] = useState([] as Item['cast']['embeds']['casts'])
 
  const deleteCast = async () => {
    await apiDeleteCast(cast.hash)
    sendDeleteCast({ hash: cast.hash })
  }

  const goToWarpcast = () => {
    window.open(`https://warpcast.com/${cast.author.username}/${cast.hash.slice(0,10)}`, '_blank')
  }

  useEffect(() => {
    setCast(item.cast)
    parseEmbeds(item?.cast?.embeds)
    if (mainUserData?.username && cast?.author?.username === mainUserData?.username) {
      setIsOwnCast(true)
    }
  }, [cast, item, mainUserData?.username])

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

      embeds?.casts?.forEach((cast) => {
        foundQoutedCasts.push(cast)
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

    navigate(`/${cast.author.username}/${cast.hash.slice(0,10)}`)
  }

  const onLike = async () => {
    if(!checkedLogin()) return
    if (isLikeLoading) return
    setIsLikeLoading(true)
    try {
    if (isLiked) {
      await deleteLike(cast.hash)
    } else {
      await likeCast(cast.hash)
    }}
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


  return (
    cast && <div style={{ wordBreak: 'break-word' }} className={`p-4 hover:bg-neutral-100 dark:hover:bg-neutral-900 border-neutral-400/50 ${!isComposeReply ? 'border-b': ''}`} onClick={!isComposeReply? goToCast: () => {}} tabIndex={0} role='button' aria-hidden="true">
                  <div className="flex space-x-4 relative">
                  { isComposeReply && <div className="absolute w-0.5 dark:bg-neutral-800 bg-neutral-300 left-[19px] top-10 bottom-[0%]"></div> }
                    <Avatar className={`hover:border-2 ${isComposeReply? '!m-0': ''}`}>
                      <Link to={`/${cast.author.username}`}>
                      <AvatarImage src={cast.author.pfp.url} alt={`User ${i+1}`} />
                      <AvatarFallback>{cast.author.displayName.slice(0,2)}</AvatarFallback>
                      </Link>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <Link to={`/${cast.author.username}`}>
                          <span className="font-semibold">{cast.author.displayName}</span>
                          </Link>
                          <Link to={`/${cast.author.username}`}>
                          <span className="text-neutral-500 ml-2">@{cast.author.username}</span>
                          </Link>
                          <span className="text-neutral-500 ml-2">·</span>
                          <span className="text-neutral-500 ml-2">{timeAgo(cast.timestamp as unknown as string)}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                        {!isComposeReply && <PopOverMenu 
                          trigger={<Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>}
                          content= {
                            <>
                            {isOwnCast && <PopOverMenuItem className="cursor-pointer" onClick={deleteCast}>
                              <Delete className="h-4 w-4 mr-1" />
                              Delete</PopOverMenuItem>}
                              <PopOverMenuItem className="cursor-pointer" onClick={goToWarpcast}>
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

                {qoutedCasts?.length ? qoutedCasts.map((cast, i) => <QoutedCast key={i} cast={cast} />) : null}
      
                      {!isComposeReply && <div className="mt-2 flex items-center justify-between text-neutral-500">
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" className="text-neutral-500 action" onClick={doReplyCast}>
                            <MessageCircle className="h-4 w-4 mr-1" />
                            <span className="text-neutral-500">{cast.replies.count}</span>
                            <span className="sr-only">Comments</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-neutral-500 action">
                            <Repeat2 className="h-4 w-4 mr-1" />
                            <span className="text-neutral-500">{cast.recasts.count}</span>
                            <span className="sr-only">Recasts</span>
                          </Button>
                          <Button variant="ghost" size="sm" className={`${isLiked ? 'text-red-800' : 'text-neutral-500'} ${isLikeLoading ? 'pulse-with-blur': ''  } action`} onClick={onLike}>
                            <Heart fill={ isLiked ? '#c7090c' : 'none' } className="h-4 w-4 mr-1" />
                            <span className="text-neutral-500">{cast.reactions.count}</span>
                            <span className="sr-only">Likes</span>
                          </Button>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" className="text-neutral-500 action">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More actions</span>
                          </Button>
                          <Button variant="ghost" size="sm" className={`text-neutral-500 ${isBookmarkLoading ? 'pulse-with-blur': ''  } action`} onClick={onBookmark}>
                            <BookmarkIcon  fill={ isBookmarked ? 'currentColor' : 'none' } className="h-4 w-4 dark:text-neutral-300 text-neutral-800" />
                            <span className="sr-only">Bookmark</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-neutral-500 action">
                            <Share2 className="h-4 w-4" />
                            <span className="sr-only">Share</span>
                          </Button>
                        </div>
                      </div>
                      }
                    </div>
                  </div>
                </div>
  )
}

// css

