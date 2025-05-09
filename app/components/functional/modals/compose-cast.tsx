import { useState, useEffect, useRef, KeyboardEvent, useCallback } from 'react'
import { Button } from "~/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Modal } from "~/components/functional/modals/modal"
import { useMainStore } from "~/store/main"
import  { sendCast, searcUsers, uploadImage, getUserFollowingChannels, searchChannels, prepareVideoUpload, getVideoUploadState } from "~/lib/api"
import { Post } from '~/components/blocks/post'
import { QoutedCast } from '~/components/blocks/cast/qouted-cast'
import { DraftsContent } from '~/components/blocks/cast/drafts-content'
import { SmileIcon, ImageIcon, Layout, X, Hash, Search, ChevronDown, Loader2, VideoIcon, DeleteIcon } from "lucide-react"
import { Input } from "~/components/ui/input"
import { getStringByteLength, wait } from '~/lib/misc'
import type { TWCSearchUsers } from '~/types/wc-search-users'
import type { TWCSearchChannels } from '~/types/wc-search-channels'
import { Img as Image } from 'react-image'
import { useToast } from "~/hooks/use-toast"
import { uploadFileWithTus } from '~/lib/tus-upload'
import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
} from "~/components/ui/emoji-picker";




const MAX_EMBEDS = 2
const MAX_VIDEO_SIZE = 5 * 1024 * 1024 // 5MB

type Channel = TWCSearchChannels['result']['channels'][number]
type User = TWCSearchUsers['result']['users'][number]

export function ComposeModal() {

  const { mainUserData, composeModalData, isComposeModalOpen, setComposeModalOpen, isUserLoggedIn  } = useMainStore()
   

    // MARK: State
    const [activeTab, setActiveTab] = useState("compose")
  
    const [castEmbeds, setCastEmbeds] = useState([] as string[])
    const [imageEmbeds, setImageEmbeds] = useState([] as string[])
    const [videoEmbeds, setVideoEmbeds] = useState([] as string[])
    const [mentionSearchUsers, setMentionSearchUsers] = useState<TWCSearchUsers>({} as TWCSearchUsers)
    const [castText, setCastText] = useState("")
    const [channelSearch, setChannelSearch] = useState("")
    const [lastSearch, setLastSearch] = useState("")
    const [showMentions, setShowMentions] = useState(false)
    const [showEmojiSelect, setShowEmojiSelect] = useState(false);

    const [mentionStartIndex, setMentionStartIndex] = useState(-1)
    const [lastCursorPosition, setLastCursorPosition] = useState(-1)
    const [selectedMentions, setSelectedMentions] = useState<{ [key: number]: User }>({})
    const [searchChannelsList, setSearchChannelsList] = useState<TWCSearchChannels>({} as TWCSearchChannels)
    const [initalChannels, setInitalChannels] = useState<TWCSearchChannels>({} as TWCSearchChannels)
    const [loadingMoreChannels, setLoadingMoreChannels] = useState(false)
    const [hasMoreChannels, setHasMoreChannels] = useState(true)
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
    const [isChannelListOpen, setIsChannelListOpen] = useState(false)
    const [saveDraftModalOpen, setSaveDraftModalOpen] = useState(false)
    const [isUploadingProgress, setIsUploadingProgress] = useState(false)
    const [videoUploadProgress, setVideoUploadProgress] = useState('')
  
    //  MARK: Refs
    const [editorRef, setEditorRef] = useState<HTMLDivElement | null>(null)
    const channelListRef = useRef<HTMLDivElement>(null)
    const mentionListRef = useRef<HTMLDivElement>(null)
    const emojiPanelRef = useRef<HTMLDivElement>(null)
    const channelListRefWarp = useRef<HTMLDivElement>(null)
    const imageFileInputRef = useRef<HTMLInputElement>(null)
    const videoFileInputRef = useRef<HTMLInputElement>(null)


  const characterCount = getStringByteLength(castText)
  const maxCharacters = 1024
  const { toast } = useToast()

  // MARK: Handlers

 
  const pasteHandler = useCallback((event: ClipboardEvent) => {
    event.preventDefault()
    // check if files
    if (event?.clipboardData?.files.length) {
      console.log('files', event.clipboardData.files)
      return
    }
    // if not files, get text
    console.log('text I am here', event?.clipboardData?.getData('text/plain'))
    const clipboardData = event.clipboardData
    const pastedText = clipboardData?.getData('text/plain')
    if (!pastedText) return
    // add text to editor
    const editable = editorRef
    if (!editable) return
    // find cusor position
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents(); 
      const textNode = document.createTextNode(pastedText);
      range.insertNode(textNode);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
      // focus editor
      editable.focus()
    }
  }, [editorRef])

  const doSendCast = async () => {
    const editable = editorRef
    if (!editable) return

    const text = editable.textContent || ''
    if (!text.trim()) return

    const sentCast = await sendCast({ text, channelKey: selectedChannel?.key || '', embeds: castEmbeds ?? [], parentHash: composeModalData?.reply?.cast?.hash || '' })
    setComposeModalOpen(false)
    if (sentCast?.result?.cast?.hash) {
      toast({
        title: 'Cast sent!',
        description: 'Your cast has been sent successfully.',
      })
    } else {
      toast({
        title: 'Error',
        description: 'There was an error sending your cast.',
      })
    }
  }
  
  const selectChannel = (channel: Channel) => {
    setIsChannelListOpen(false)
    setSelectedChannel(channel)
  }

  const getContentEditableInfo = () => {
    if (!editorRef) return { text: "", cursorPosition: 0 }

    const text = editorRef.innerText || ""

    // Get cursor position
    const selection = window.getSelection()
    let cursorPosition = 0

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const preCaretRange = range.cloneRange()
      preCaretRange.selectNodeContents(editorRef)
      preCaretRange.setEnd(range.endContainer, range.endOffset)
      cursorPosition = preCaretRange.toString().length
    }

    return { text, cursorPosition }
  }

  
  const loadMoreChannels = useCallback(async () => {
    if (lastSearch !== channelSearch) {
      setHasMoreChannels(true)
      setSearchChannelsList({} as TWCSearchChannels)
    }
    if (channelSearch?.length === 0) return
    if ( lastSearch === channelSearch) return
    if (!isComposeModalOpen) return
    if (loadingMoreChannels) return
    if (!hasMoreChannels) return

    setLoadingMoreChannels(true)
    setLastSearch(channelSearch)

    const newChannels = await searchChannels({
      query: channelSearch,
      limit: 50
    })

    if(!newChannels?.next?.cursor) {
      setHasMoreChannels(false)
    }

    setSearchChannelsList((prev) => { 
      return {
      ...prev,
      ...newChannels,
      result: {
        ...prev?.result ?? {},
        channels: [...prev?.result?.channels ?? [], ...newChannels.result.channels],
      }
    }})
    setLoadingMoreChannels(false)

     await wait(500)
  
  }, [channelSearch, lastSearch, isComposeModalOpen, loadingMoreChannels, hasMoreChannels])


  const handleChannelScroll = useCallback(() => {
    if (!channelListRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = channelListRef.current
    if (scrollTop + clientHeight >= scrollHeight - 50 && hasMoreChannels && !loadingMoreChannels) {
      loadMoreChannels()
    }
  }, [hasMoreChannels, loadingMoreChannels, loadMoreChannels])


   // Format text with colored mentions
   const formatTextWithMentions = useCallback(() => {
    if (!editorRef || Object.keys(selectedMentions).length === 0) return

    // Save current selection
    const selection = window.getSelection()
    const savedRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null

    // Get current text
    const currentText = editorRef?.innerText || ""

    // Create HTML with colored mentions
    let html = currentText
    Object.values(selectedMentions).forEach((mention) => {
      const mentionText = `@${mention.username}`
      html = html.replace(
        new RegExp(mentionText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        `<span class="text-red-600">${mentionText}</span>`,
      )
    })

    // Only update if there's a change to avoid cursor jumping
    if (html !== editorRef?.innerHTML) {
      editorRef!.innerHTML = html
    }

    // Restore selection
    if (savedRange && selection) {
      selection.removeAllRanges()
      selection.addRange(savedRange)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMentions])

 
  // Select a mention from the dropdown
  const selectMention = (user: User) => {
    if (mentionStartIndex !== -1) {
      const { text, cursorPosition } = getContentEditableInfo()

      const beforeMention = text.substring(0, mentionStartIndex)
      const afterMention = text.substring(cursorPosition)

      const mentionText = `@${user.username}`
      const newText = `${beforeMention}${mentionText} ${afterMention}`

      // Update the content and state
      if (editorRef) {
        editorRef.innerText = newText
      }
      setCastText(newText)

      // Add to selected mentions
      setSelectedMentions({ ...selectedMentions, [user.fid]: user })

      // Reset mention state
      setShowMentions(false)
      setMentionStartIndex(-1)

      // Focus and set cursor position
      setTimeout(() => {
        const newPosition = mentionStartIndex + mentionText.length + 1 // +1 for the space
        setCursorPosition(newPosition)
      }, 0)
    }
  }

 

    // Set cursor position in contentEditable
    const setCursorPosition = (position: number) => {
      const divElement = editorRef;
      if (!divElement) {
        return;
      }
  
      const range = document.createRange();
      const selection = window.getSelection();
  
      if (!selection) {
        return;
      }
  
      let charCount = 0;
      let foundNode = null;
      let offset = 0;
  
      function findNodeAndOffset(node: Node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const length = node.textContent?.length || 0;
          if (charCount + length >= position) {
            foundNode = node;
            offset = position - charCount;
            return true;
          }
          charCount += length;
        } else if (node.hasChildNodes()) {
          const children = node.childNodes;
          for (let i = 0; i < children.length; i++) {
            if (findNodeAndOffset(children[i])) {
              return true;
            }
          }
        }
        return false;
      }
  
      if (divElement.childNodes.length > 0) {
        findNodeAndOffset(divElement);
      } else if (position === 0) {
        // Handle case of empty div and position 0
        range.setStart(divElement, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        return;
      }
  
      if (foundNode) {
        range.setStart(foundNode, offset);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      } else if (position >= charCount) {
        // Handle case where position is at the end or beyond
        if (divElement.childNodes.length > 0) {
          const lastChild = divElement.lastChild;
          if (lastChild && lastChild.nodeType === Node.TEXT_NODE) {
            range.setStart(lastChild, lastChild.textContent?.length || 0);
          } else {
            range.setStart(divElement, divElement.childNodes.length);
          }
        } else {
          range.setStart(divElement, 0);
        }
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    };

 
  const handleInput = () => {
    if (!editorRef) return

    const { text, cursorPosition } = getContentEditableInfo()

    // Update state
    setCastText(text)

    // Check for @ symbol to trigger mentions
    const textBeforeCursor = text.substring(0, cursorPosition)
    setLastCursorPosition(cursorPosition)

    const lastAtSymbol = textBeforeCursor.lastIndexOf("@")
    if (lastAtSymbol !== -1 && (lastAtSymbol === 0 || /\s/.test(textBeforeCursor.charAt(lastAtSymbol - 1)))) {
      const searchText = textBeforeCursor.substring(lastAtSymbol + 1)
      if (!searchText.includes(" ") && searchText.length > 0) {
        setMentionStartIndex(lastAtSymbol)
        setShowMentions(true)
        searcUsers({
          query: searchText,
          limit: 40,
        }).then(users => {
          setMentionSearchUsers(users)
        })
        return
      }
    }

    setShowMentions(false)
  }

  useEffect(() => {
    if(composeModalData?.castText && editorRef) {
      setCastText(composeModalData.castText)
      editorRef.innerHTML = composeModalData.castText
      setCursorPosition(composeModalData.castText.length)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }}, [composeModalData?.castText, editorRef])
 
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (showMentions && mentionSearchUsers?.result?.users.length > 0) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === "Escape") {
          e.preventDefault()
  
          if (e.key === "Escape") {
            setShowMentions(false)
          } else if (e.key === "Enter") {
            selectMention(mentionSearchUsers?.result?.users[0])
          }
        }
      }
  
      // Check if backspace is deleting part of a mention
      if (e.key === "Backspace") {
        const { text, cursorPosition } = getContentEditableInfo()
  
        // Check if we're inside or at the end of a mention
        Object.values(selectedMentions).forEach((mention) => {
          const mentionText = `@${mention.username}`
          const mentionIndex = text.indexOf(mentionText)
  
          if (
            mentionIndex !== -1 &&
            cursorPosition > mentionIndex &&
            cursorPosition <= mentionIndex + mentionText.length
          ) {
            e.preventDefault()
  
            // Remove the entire mention
            const newText = text.substring(0, mentionIndex) + text.substring(mentionIndex + mentionText.length)
  
            // Update the content and state
            if (editorRef) {
              editorRef.innerText = newText
            }
            setCastText(newText)
  
            // Remove from selected mentions
            const updatedMentions = { ...selectedMentions }
            delete updatedMentions[mention.fid]
            setSelectedMentions(updatedMentions)
  
            // Set cursor position
            setTimeout(() => {
              setCursorPosition(mentionIndex)
            }, 0)
          }
        })
      }
  
      // Prevent entering more than maxCharacters
      if (
        e.key !== "Backspace" &&
        e.key !== "Delete" &&
        e.key !== "ArrowLeft" &&
        e.key !== "ArrowRight" &&
        e.key !== "ArrowUp" &&
        e.key !== "ArrowDown" &&
        !e.metaKey &&
        !e.ctrlKey
      ) {
        if (characterCount >= maxCharacters) {
          e.preventDefault()
        }
      }
    }


    const doPicUpload = async () => {
      imageFileInputRef.current?.click()
    }

    const doVideoUpload = async () => {
       if(!mainUserData?.capabilities?.canUploadVideo) {
        toast({
          title: 'Error',
          description: 'You do not have permission to upload videos',
          variant: 'destructive',
          duration: 3000,
        })
        return
       }
       videoFileInputRef.current?.click()
    }
 

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
      if(isUploadingProgress) return
      if (castEmbeds.length >= MAX_EMBEDS) {
        toast({
          title: 'Maximum embeds reached',
          description: 'You have reached the maximum number of embeds allowed.',
          variant: 'destructive',
          duration: 3000,
        })
        return
      }
      setIsUploadingProgress(true)
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = async () => {
          // setGroupImage(event.target?.result as string)
          // const imageUrl = event.target?.result as string
          const uploadUrl = await uploadImage({
            file,
            doUploadAvatar: false,
          })
          if(uploadUrl) {
            setCastEmbeds([...castEmbeds, uploadUrl])
            setImageEmbeds([...imageEmbeds, uploadUrl])
          }
          setIsUploadingProgress(false)
        }
        reader.readAsDataURL(file)
      }
      if(imageFileInputRef.current) imageFileInputRef.current.value = ''
    } catch (error) {
      console.error('Error uploading image:', error)
      setIsUploadingProgress(false)
    }
  }

  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if(isUploadingProgress) return
      if (castEmbeds.length >= MAX_EMBEDS) {
        toast({
          title: 'Maximum embeds reached',
          description: 'You have reached the maximum number of embeds allowed.',
          variant: 'destructive',
          duration: 3000,
        })
        return
      }
      setIsUploadingProgress(true)
      setVideoUploadProgress('')
      const file = e.target.files?.[0]
      if ((file?.size ?? 0) > MAX_VIDEO_SIZE) {
        toast({
          title: 'Video too large',
          description: `The video you are trying to upload is too large. Please upload a video smaller than ${Math.floor(MAX_VIDEO_SIZE / 1000000)}MB.`,
          variant: 'destructive',
          duration: 3000,
        })
        return
      }

      if (file) {
        const reader = new FileReader()
        reader.onload = async () => {
          const video = await prepareVideoUpload({
            videoSizeBytes: file.size,
          })

          await new  Promise((resolve) => {
            setTimeout(() => {
              resolve(true)
            }, 200)
          })

          await uploadFileWithTus({ cloudflareUploadUrl: video?.result?.uploadUrl, file, setUploadProgress:setVideoUploadProgress })

          const videoStatus = await getVideoUploadState({
            videoId: video?.result?.videoId,
          })
        
          if(videoStatus?.result?.video?.embed?.sourceUrl) {
            setCastEmbeds([...castEmbeds, videoStatus?.result.video.embed.sourceUrl])
            const localVideoSource = URL.createObjectURL(file)
            setVideoEmbeds([...videoEmbeds, localVideoSource])
          }
          setIsUploadingProgress(false)
          setVideoUploadProgress('')
        }
        reader.readAsDataURL(file)
      }
      if(videoFileInputRef.current) videoFileInputRef.current.value = ''
    } catch (error) {
      console.error('Error uploading image:', error)
      setIsUploadingProgress(false)
    }
  }
      

  const handleRemoveImageEmbed = (url: string) => {
    setImageEmbeds(imageEmbeds.filter((embed) => embed !== url))
    setCastEmbeds(castEmbeds.filter((embed) => embed !== url))
    if(imageFileInputRef.current) imageFileInputRef.current.value = ''
  }

  const handleRemoveVideoEmbed = (url: string) => {
    setVideoEmbeds(videoEmbeds.filter((embed) => embed !== url))
    setCastEmbeds(castEmbeds.filter((embed) => embed !== url))
    if(videoFileInputRef.current) videoFileInputRef.current.value = ''
  }


    
  // MARK: Effects
  
  useEffect(() => {
    formatTextWithMentions()
  }, [castText, formatTextWithMentions, selectedMentions])


  useEffect( () => {
    try {
      if (!isUserLoggedIn) return
      getUserFollowingChannels({ limit: 50}).then( channels => setInitalChannels(channels))
    } catch {
      // ignore
    }
  }, [isUserLoggedIn])

  useEffect( () => {
    loadMoreChannels()
  }, [channelSearch, loadMoreChannels])

  useEffect(() => {
    const channelListElement = channelListRef.current
    if (channelListElement) {
      channelListElement.addEventListener("scroll", handleChannelScroll)
      return () => {
        channelListElement.removeEventListener("scroll", handleChannelScroll)
      }
    }
  }, [searchChannelsList, loadingMoreChannels, hasMoreChannels, handleChannelScroll])

  useEffect( () => {
     if(!isUserLoggedIn || !isComposeModalOpen || !editorRef) return
    const editable = editorRef
    editable?.addEventListener('paste', pasteHandler)

    editable?.focus()
    editable?.scrollIntoView({
      block: 'end',
      inline: 'end',
      behavior: 'instant'
    })

      console.log('cursor position',  editorRef)
      return () => {
        editable?.removeEventListener('paste', pasteHandler)
      }
  }, [editorRef, isComposeModalOpen, isUserLoggedIn, pasteHandler])
 
  useEffect(() => {
    if (isChannelListOpen && channelListRef.current) {
      channelListRef.current.focus();
    }
  }, [isChannelListOpen, channelListRef]);

 
return (
    <>
     <Modal isOpen={isComposeModalOpen} setIsOpen={setComposeModalOpen}>
     <Tabs defaultValue="compose" value={activeTab} onValueChange={setActiveTab}  className="w-full">
          {!composeModalData?.reply && !composeModalData?.quote && <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="compose" className="dark:data-[state=active]:bg-[#2c2c2c]">Compose</TabsTrigger>
            <TabsTrigger value="drafts" className="dark:data-[state=active]:bg-[#2c2c2c]">Drafts</TabsTrigger>
          </TabsList>
        }
        <TabsContent value="compose" className="mt-0 p-0" onClick={
          (e) => {
            if (!mentionListRef?.current?.contains(e.target as Node) && !mentionListRef.current?.children[0]?.contains(e.target as Node)) {
              setShowMentions(false)
            }
            if (!channelListRefWarp?.current?.contains(e.target as Node) && isChannelListOpen) {
              setIsChannelListOpen(false)
            }
            if(!emojiPanelRef?.current?.contains(e.target as Node) && showEmojiSelect){
              setShowEmojiSelect(false)
            }
            const { cursorPosition } = getContentEditableInfo()
            setLastCursorPosition(cursorPosition)
          }
        }>
        <div className="overflow-y-auto max-h-[calc(100vh-20rem)]">
        {
          composeModalData?.reply && <Post isComposeReply={true} item={composeModalData.reply} noNavigate={true} />
        }
        <div className="flex items-start space-x-4 pt-4 relative">
        {composeModalData?.reply && <div className="absolute w-0.5 dark:bg-neutral-800 bg-neutral-300 left-[35px] -top-[40px] bottom-[120px] h-[5rem]"></div> }
          <Avatar className="w-10 h-10">
            <AvatarImage src={mainUserData?.avatar} alt={`avatar ${mainUserData?.username}`} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1 relative">
            {/* Mentions dropdown */}
          {showMentions && mentionSearchUsers?.result?.users?.length > 0 && (
                  <div
                    ref={mentionListRef}
                    className="absolute z-20 mt-1 w-full max-w-[300px] bg-[#1a1a1a] border border-neutral-800 rounded-lg shadow-lg overflow-hidden"
                  >
                    <div className="max-h-[210px] overflow-y-auto">
                      {mentionSearchUsers?.result?.users?.map((user) => (
                        <button
                          key={user.fid}
                          className="flex items-center gap-3 w-full px-3 py-2 hover:bg-[#252525] transition-colors text-left"
                          onClick={() => selectMention(user)}
                        >
                          <Avatar className="h-8 w-8 border border-neutral-700">
                            <AvatarImage src={user?.pfp?.url} alt={user?.username} />
                            <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user?.displayName}</div>
                            <div className="text-sm text-neutral-400">@{user?.username}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            {/* MARK: Editor */}
            <div
              ref={setEditorRef}
              contentEditable
              tabIndex={0} // Add tabIndex attribute to make it tabbable
              className={`${!composeModalData?.quote? 'min-h-[240px]': ''} w-full max-h-[300px] overflow-y-auto bg-transparent border-none focus:outline-none whitespace-pre-wrap break-words dark:text-white break-before-all break-all`}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              aria-label="Compose new cast"
              role="textbox"
              data-placeholder="Start typing a new cast here..."
            >
            </div>
          
          </div>
        </div>
        {composeModalData?.quote && <QoutedCast cast={composeModalData?.quote} noNavigation={true} /> }



  {isUploadingProgress ? <span><Loader2 className="h-4 w-4 animate-spin inline-block my-2" /> Uploading... {videoUploadProgress} </span>: ''}


  { !!videoEmbeds.length && <div className="flex my-2 wdith-[98%]">
                
    {(videoEmbeds ?? []).map((url) => 
        <>

<div className="relative shrink grow basis-1/2 rounded-md">
         <div onClick={() => handleRemoveVideoEmbed(url)} className="absolute left-0 top-0 z-10 ml-2 mt-2 flex cursor-pointer justify-center rounded-full p-1 bg-neutral-800" aria-hidden>
            <svg aria-hidden="true" focusable="false" role="img" className="font-semibold text-white" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style={{display: 'inline-block', userSelect: 'none', verticalAlign: 'text-bottom', overflow: 'visible'}}>
               <path d="M5.72 5.72a.75.75 0 0 1 1.06 0L12 10.94l5.22-5.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L13.06 12l5.22 5.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L12 13.06l-5.22 5.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L10.94 12 5.72 6.78a.75.75 0 0 1 0-1.06Z"></path>
            </svg>
         </div>
         <video className={`max-w-15 px-1`} controls>
                    <track kind="captions" />
                    <source src={url} type="video/*" />
                  </video>      </div>
        </>
       )}
 </div>}

{ !!imageEmbeds.length && <div className="my-2">
   <div className="my-1 flex w-full flex-row items-start justify-start space-x-2">
      {(imageEmbeds ?? []).map(url => 
        <>
        <div className="relative shrink grow basis-1/2 rounded-md">
         <div onClick={() => handleRemoveImageEmbed(url)} className="absolute left-0 top-0 z-10 ml-2 mt-2 flex cursor-pointer justify-center rounded-full p-1 bg-neutral-800" aria-hidden>
            <svg aria-hidden="true" focusable="false" role="img" className="font-semibold text-white" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style={{display: 'inline-block', userSelect: 'none', verticalAlign: 'text-bottom', overflow: 'visible'}}>
               <path d="M5.72 5.72a.75.75 0 0 1 1.06 0L12 10.94l5.22-5.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L13.06 12l5.22 5.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L12 13.06l-5.22 5.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L10.94 12 5.72 6.78a.75.75 0 0 1 0-1.06Z"></path>
            </svg>
         </div>
         <Image src={[url]} className="relative max-h-[400px] w-auto cursor-pointer rounded-md border object-cover border-default" alt="Cast embed" style={{aspectRatio: '1.6 / 1'}} />
      </div>
        </>
       )}
   </div>
</div>
}


        </div>
        <div className="flex justify-between items-center mt-4">
          {/* MARK: Actions Buttons */}
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" className={`w-10 h-10 ${isUploadingProgress ? 'cursor-not-allowed': ''}`} onClick={() => doPicUpload()}>
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Input ref={imageFileInputRef} onChange={handleFileChange} accept="image/*"  type="file" hidden className='hidden' />
            <Button variant="ghost" size="icon" className={`w-10 h-10 ${isUploadingProgress ? 'cursor-not-allowed': ''}`} onClick={() => doVideoUpload()}>
              <VideoIcon className="h-4 w-4" />
            </Button>
            <Input ref={videoFileInputRef} onChange={handleVideoFileChange} accept="video/mp4"  type="file" hidden className='hidden' />
            

            
            {!showEmojiSelect  && <Button variant="ghost" size="icon" className="w-10 h-10" onClick={ () => setShowEmojiSelect(true)}>
              <SmileIcon className="h-4 w-4" />
            </Button> }

      {showEmojiSelect && (
                  <div
                    style={{ transform: 'translateY(-20px)'}}
                    ref={emojiPanelRef}
                    className="absolute z-25 mt-1 w-full max-w-[270px] dark:bg-[#1a1a1a] bg-neutral-100 border border-neutral-800 rounded-lg shadow-lg overflow-hidden"
                  >
                  <EmojiPicker
            className="h-[342px]"
            onEmojiSelect={({ emoji }: {emoji: string}) => {
              const { text, cursorPosition } = getContentEditableInfo()

              const beforeEmoji = text.substring(0, lastCursorPosition)
              const afterEmoji = text.substring(cursorPosition)
        
              const newText = `${beforeEmoji}${emoji}${afterEmoji}`
        
              // Update the content and state
              if (editorRef) {
                editorRef.innerText = newText
              }
              setCastText(newText)
              setShowEmojiSelect(false);

            }}
          >
            <EmojiPickerSearch />
            <EmojiPickerContent />
            <EmojiPickerFooter />
          </EmojiPicker>
          </div>)}


            {/*  */}

              {!isChannelListOpen && !composeModalData?.reply?.cast?.hash && !showEmojiSelect  && <Button
                  onClick={() => setIsChannelListOpen(true)}
                  variant="ghost"
                  size="sm"
                  className="text-neutral-400 rounded-full flex items-center gap-1 px-2 h-8 mt-[0.4rem] -ml-2 z-50"
                > 
                  {!selectedChannel ? (<>
                  <Hash className="h-4 w-4" />
                  <span>Channels</span>
                  </>) : (<>
                  <Image className="h-4 w-4" src={selectedChannel?.fastImageUrl || selectedChannel?.imageUrl} alt={selectedChannel?.name} />
                  <span>{selectedChannel?.name}</span>
                  </>)}
                  <ChevronDown className="h-3 w-3 ml-1" />
                  {selectedChannel && <X className="h-4 w-4" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedChannel(null);
                  } } />}
                </Button>
                }

      {isChannelListOpen && (
                  <div
                    ref={channelListRefWarp}
                    className="absolute z-25 mt-1 w-full max-w-[240px] dark:bg-[#1a1a1a] bg-neutral-100 border border-neutral-800 rounded-lg shadow-lg overflow-hidden"
                  >
                    <div className="p-0 dark:bg-[#1a1a1a] border-neutral-800 dark:text-white">
                <div className="p-2 border-b border-neutral-800 flex">
                  <div className="flex items-center gap-2 px-2 py-1 dark:bg-[#252525] border-neutral-500 border-[1px] rounded w-full">
                    <Search className="h-4 w-4 dark:text-neutral-400" />
                    <Input
                      placeholder="Search channels"
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-8 p-0 text-sm"
                      value={channelSearch}
                      onChange={(e) => setChannelSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div ref={channelListRef} className="py-1 max-h-60 overflow-y-scroll" tabIndex={0} role='listbox'>
                  {(channelSearch === '' ? initalChannels.result?.channels ?? []: searchChannelsList.result?.channels ?? []).map((channel) => (
                    <button key={channel.key}
                      
                      className="flex items-center gap-2 w-full px-3 py-2 text-left dark:hover:bg-[#252525] hover:bg-neutral-200 transition-colors"
                      onClick={() => selectChannel(channel)}
                    >
                      <Image className="h-4 w-4 text-neutral-400" src={channel.fastImageUrl ?? channel?.imageUrl} alt={channel.name} />
                      <span>{channel.name}</span>
                    </button>
                  ))}
                  {loadingMoreChannels && (
                    <div className="flex justify-center items-center py-2">
                      <Loader2 className="h-4 w-4 text-neutral-400 animate-spin mx-auto" />
                    </div>
                  )}
                  {!loadingMoreChannels && searchChannelsList.result?.channels?.length === 0 && channelSearch !== '' && (
                    <div className="flex justify-center items-center py-2">
                      <span className="text-neutral-400 text-sm">No channels found</span>
                    </div>
                  )}
                </div>
                </div>
                  </div>
                )}
              

          </div>
        
        <div className="flex items-center gap-3">
          {characterCount > 1 && (
              <span className="text-sm text-neutral-400">
                {characterCount}/{maxCharacters}
              </span>
            )}

          <Button className="bg-red-600 hover:bg-red-700 px-6 py-2 text-lg text-white" onClick={doSendCast}>
            {composeModalData?.reply ?'Reply' :''}
            {composeModalData?.quote ?'Qoute' :''}
            {!composeModalData?.reply && ! composeModalData?.quote ? 'Cast' : ''}
            </Button>
            </div>
        </div>
        </TabsContent>
        <TabsContent value="drafts" className="mt-0 p-0">
        
          <DraftsContent />
        </TabsContent>
        </Tabs>
    </Modal>
    <Modal isOpen={saveDraftModalOpen} setIsOpen={setSaveDraftModalOpen}>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Save Draft</h2>
                <Button variant="ghost" onClick={() => setSaveDraftModalOpen(false)}>
                <X className="h-4 w-4" />
                </Button>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-end">
                    <Button variant="outline">Save</Button>
                  <Button variant="outline">Exit</Button>
                  <Button variant="outline">Return to Cast</Button>
                  </div>
               </div>
               </div>
    </Modal>
  </>
)
}
