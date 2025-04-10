import { useState, useEffect, useRef, KeyboardEvent, useCallback } from 'react'
import { Button } from "~/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Modal } from "~/components/functional/modals/modal"
import { useMainStore } from "~/store/main"
import  { sendCast, searcUsers, uploadImage, getUserFollowingChannels, searchChannels } from "~/lib/api"
import { Post } from '~/components/blocks/post'
import { QoutedCast } from '~/components/blocks/cast/qouted-cast'
import { DraftsContent } from '~/components/blocks/cast/drafts-content'
import { SmileIcon, ImageIcon, Layout, X, Hash, Search, ChevronDown, Loader2,  } from "lucide-react"
import { PopOverMenu, PopOverMenuItem } from '~/components/blocks/drop-menu'
import { Input } from "~/components/ui/input"
import { getStringByteLength } from '~/lib/misc'
import type { TWCSearchUsers } from '~/types/wc-search-users'
import type { TWCSearchChannels } from '~/types/wc-search-channels'
import { Img as Image } from 'react-image'
import { wait } from '~/lib/misc'


const MAX_EMBEDS = 2

type Channel = TWCSearchChannels['result']['channels'][number]
type User = TWCSearchUsers['result']['users'][number]

function PlaceHolder() {
   return <div className="absolute top-0 left-0 text-neutral-400">Start typing here...</div>
}

export function ComposeModal() {

  const { mainUserData, composeModalData, isComposeModalOpen, setComposeModalOpen, isUserLoggedIn  } = useMainStore()
   


  const [activeTab, setActiveTab] = useState("compose")
  
    const [numEmbeds, setNumEmbeds] = useState(0)
    const [castEmbeds, setCastEmbeds] = useState([] as string[])
    const [mentionSearchUsers, setMentionSearchUsers] = useState<TWCSearchUsers>({} as TWCSearchUsers)
    const [castText, setCastText] = useState('')
     const [channelSearch, setChannelSearch] = useState("")
    const [lastSearch, setLastSearch] = useState("")
    const [showMentions, setShowMentions] = useState(false)
    const [mentionSearch, setMentionSearch] = useState("")
    const [mentionStartIndex, setMentionStartIndex] = useState(-1)
    const [selectedMentions, setSelectedMentions] = useState<{ [key: number]: User }>({})
    const [searchChannelsList, setSearchChannelsList] = useState<TWCSearchChannels>({} as TWCSearchChannels)
    const [initalChannels, setInitalChannels] = useState<TWCSearchChannels>({} as TWCSearchChannels)
    const [loadingMoreChannels, setLoadingMoreChannels] = useState(false)
    const [hasMoreChannels, setHasMoreChannels] = useState(true)
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
    const [isChannelListOpen, setIsChannelListOpen] = useState(false)


      const editorRef = useRef<HTMLDivElement>(null)
      const channelListRef = useRef<HTMLDivElement>(null)
      const mentionListRef = useRef<HTMLDivElement>(null)


  const characterCount = getStringByteLength(castText)
  const maxCharacters = 1024
 

  const doSendCast = async () => {
    const editable = editorRef.current
    if (!editable) return

    const text = editable.textContent || ''
    if (!text.trim()) return

    await sendCast({ text })
    setComposeModalOpen(false)
  }
  
  const selectChannel = (channel: Channel) => {
    setIsChannelListOpen(false)
    setSelectedChannel(channel)
  }

  const getContentEditableInfo = () => {
    if (!editorRef.current) return { text: "", cursorPosition: 0 }

    const text = editorRef.current.innerText || ""

    // Get cursor position
    const selection = window.getSelection()
    let cursorPosition = 0

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const preCaretRange = range.cloneRange()
      preCaretRange.selectNodeContents(editorRef.current)
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


   // Format text with colored mentions
   const formatTextWithMentions = useCallback(() => {
    if (!editorRef.current || Object.keys(selectedMentions).length === 0) return

    // Save current selection
    const selection = window.getSelection()
    const savedRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null

    // Get current text
    const currentText = editorRef.current.innerText

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
    if (html !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = html
    }

    // Restore selection
    if (savedRange && selection) {
      selection.removeAllRanges()
      selection.addRange(savedRange)
    }
  }, [selectedMentions])

  // Apply formatting when content changes or mentions change
  useEffect(() => {
    formatTextWithMentions()
  }, [castText, formatTextWithMentions, selectedMentions])

  useEffect(() => {
    if (isComposeModalOpen && editorRef.current) {
      editorRef.current.focus()
    }
  }, [isComposeModalOpen])
 
 
 
 
  // Select a mention from the dropdown
  const selectMention = (user: User) => {
    if (mentionStartIndex !== -1) {
      const { text, cursorPosition } = getContentEditableInfo()

      const beforeMention = text.substring(0, mentionStartIndex)
      const afterMention = text.substring(cursorPosition)

      const mentionText = `@${user.username}`
      const newText = `${beforeMention}${mentionText} ${afterMention}`

      // Update the content and state
      if (editorRef.current) {
        editorRef.current.innerText = newText
      }
      setCastText(newText)

      // Add to selected mentions
      setSelectedMentions({ ...selectedMentions, [user.fid]: user })

      // Reset mention state
      setShowMentions(false)
      setMentionSearch("")
      setMentionStartIndex(-1)

      // Focus and set cursor position
      setTimeout(() => {
        const newPosition = mentionStartIndex + mentionText.length + 1 // +1 for the space
        setCursorPosition(newPosition)
        console.log('setting', newPosition)
      }, 0)
    }
  }

 

    // Set cursor position in contentEditable
    const setCursorPosition = (position: number) => {
      const divElement = editorRef.current;
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

  useEffect( () => {
      editorRef?.current?.focus()
      console.log('cursor position',  editorRef?.current)
  }, [editorRef])


  const handleInput = () => {
    if (!editorRef.current) return

    const { text, cursorPosition } = getContentEditableInfo()

    // Update state
    setCastText(text)

    // Check for @ symbol to trigger mentions
    const textBeforeCursor = text.substring(0, cursorPosition)

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
            if (editorRef.current) {
              editorRef.current.innerText = newText
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

return (
    <>
     <Modal isOpen={isComposeModalOpen} setIsOpen={setComposeModalOpen}>
     <Tabs defaultValue="compose" value={activeTab} onValueChange={setActiveTab}  className="w-full">
          {!composeModalData?.reply || composeModalData?.quote && <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="compose" className="dark:data-[state=active]:bg-[#2c2c2c]">Compose</TabsTrigger>
            <TabsTrigger value="drafts" className="dark:data-[state=active]:bg-[#2c2c2c]">Drafts</TabsTrigger>
          </TabsList>
        }
        <TabsContent value="compose" className="mt-0 p-0">
        {
          composeModalData?.reply && <Post isComposeReply={true} item={composeModalData.reply} i={0}/>
        }
        <div className="flex items-start space-x-4 pt-4 relative">
        {composeModalData?.reply && <div className="absolute w-0.5 dark:bg-neutral-800 bg-neutral-300 left-[35px] -top-[40px] bottom-[120px]"></div> }
          <Avatar className="w-10 h-10">
            <AvatarImage src={mainUserData?.avatar} alt={`avatar ${mainUserData?.username}`} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1 relative">
            <div
              ref={editorRef}
              contentEditable
              tabIndex={0} // Add tabIndex attribute to make it tabbable
              className="w-full min-h-[150px] max-h-[300px] overflow-y-auto bg-transparent border-none focus:outline-none whitespace-pre-wrap break-words dark:text-white break-before-all break-all"
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              aria-label="Compose new cast"
              role="textbox"
              data-placeholder="Start typing a new cast here..."
            >
            {/* {castText.length === 0 && <PlaceHolder />} */}

            </div>
                {/* Mentions dropdown */}
                {showMentions && mentionSearchUsers?.result?.users?.length > 0 && (
                  <div
                    ref={mentionListRef}
                    className="absolute z-20 mt-1 w-full max-w-[300px] bg-[#1a1a1a] border border-neutral-800 rounded-lg shadow-lg overflow-hidden"
                  >
                    <div className="max-h-[300px] overflow-y-auto">
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
          </div>
        </div>
        {composeModalData?.quote && <QoutedCast cast={composeModalData?.quote} /> }
        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <ImageIcon className="h-4 w-4" />
            </Button>
            {/* <Button variant="ghost" size="icon" className="w-10 h-10">
              <SmileIcon className="h-4 w-4" />
            </Button> */}


            <PopOverMenu 
                  controlled={true}
                  isOpen={isChannelListOpen}
                  clickOutsideToClose={true}
                  onClickOutside={() => setIsChannelListOpen(false)}
                  trigger={
                  <Button
                  onClick={() => setIsChannelListOpen(true)}
                  variant="ghost"
                  size="sm"
                  className="text-neutral-400 rounded-full flex items-center gap-1 px-2 h-8 mt-[0.4rem] -ml-2"
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
                </Button>}
              content={
                <div className="p-0 dark:bg-[#1a1a1a] border-neutral-800 dark:text-white">
                <div className="p-2 border-b border-neutral-800 flex">
                  <div className="flex items-center gap-2 px-2 py-1 dark:bg-[#252525] border-neutral-500 border-[1px] rounded">
                    <Search className="h-4 w-4 dark:text-neutral-400" />
                    <Input
                      placeholder="Search channels"
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-8 p-0 text-sm"
                      value={channelSearch}
                      onChange={(e) => setChannelSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div ref={channelListRef} className="py-1 max-h-60 overflow-auto">
                  {(channelSearch === '' ? initalChannels.result?.channels ?? []: searchChannelsList.result?.channels ?? []).map((channel) => (
                    <button
                      key={channel.key}
                      className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-[#252525] transition-colors"
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
              }
              
              />

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
  </>
)
}
