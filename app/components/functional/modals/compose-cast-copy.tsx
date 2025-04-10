"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Smile, ImageIcon, Layout, X, Hash, Search, ChevronDown, Loader2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types
interface User {
  id: number
  name: string
  handle: string
  avatar: string
}

interface Channel {
  id: number
  name: string
}

export default function ReplyComponent() {
  // State
  const [activeTab, setActiveTab] = useState("compose")
  const [replyText, setReplyText] = useState("")
  const [showChannelSelector, setShowChannelSelector] = useState(false)
  const [channelSearch, setChannelSearch] = useState("")
  const [showMentions, setShowMentions] = useState(false)
  const [mentionSearch, setMentionSearch] = useState("")
  const [mentionStartIndex, setMentionStartIndex] = useState(-1)
  const [selectedMentions, setSelectedMentions] = useState<{ [key: number]: User }>({})
  const [channels, setChannels] = useState<Channel[]>([
    { id: 1, name: "crypto" },
    { id: 2, name: "defi" },
    { id: 3, name: "nft" },
    { id: 4, name: "web3" },
    { id: 5, name: "blockchain" },
  ])
  const [loadingMoreChannels, setLoadingMoreChannels] = useState(false)
  const [hasMoreChannels, setHasMoreChannels] = useState(true)

  const editorRef = useRef<HTMLDivElement>(null)
  const channelListRef = useRef<HTMLDivElement>(null)
  const mentionListRef = useRef<HTMLDivElement>(null)

  const characterCount = replyText.length
  const maxCharacters = 1024

  // Sample users for mentions
  const users: User[] = [
    { id: 1, name: "Thomas", handle: "aviationdoctor.eth", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 2, name: "accountless.eth", handle: "accountless.eth", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 3, name: "artlu", handle: "artlu", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 4, name: "Francesco | andreolf.eth™", handle: "andreolf", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 5, name: "Ashoat", handle: "ashoat.eth", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 6, name: "AusaR", handle: "ausar", avatar: "/placeholder.svg?height=40&width=40" },
  ]

  // Filter channels based on search
  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(channelSearch.toLowerCase()),
  )

  // Filter users based on mention search
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(mentionSearch.toLowerCase()) ||
      user.handle.toLowerCase().includes(mentionSearch.toLowerCase()),
  )

  // Get current text and cursor position from contentEditable
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

  // Set cursor position in contentEditable
  const setCursorPosition = (position: number) => {
    if (!editorRef.current) return

    const textNode = editorRef.current.firstChild
    if (!textNode) {
      // If there's no text, just focus the element
      editorRef.current.focus()
      return
    }

    const range = document.createRange()
    const selection = window.getSelection()

    // Make sure position is within bounds
    const maxPos = textNode.textContent?.length || 0
    position = Math.min(position, maxPos)

    range.setStart(textNode, position)
    range.setEnd(textNode, position)

    if (selection) {
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  // Handle input in contentEditable
  const handleInput = () => {
    if (!editorRef.current) return

    const { text, cursorPosition } = getContentEditableInfo()

    // Update state
    setReplyText(text)

    // Check for @ symbol to trigger mentions
    const textBeforeCursor = text.substring(0, cursorPosition)

    const lastAtSymbol = textBeforeCursor.lastIndexOf("@")
    if (lastAtSymbol !== -1 && (lastAtSymbol === 0 || /\s/.test(textBeforeCursor.charAt(lastAtSymbol - 1)))) {
      const searchText = textBeforeCursor.substring(lastAtSymbol + 1)
      if (!searchText.includes(" ")) {
        setMentionSearch(searchText)
        setMentionStartIndex(lastAtSymbol)
        setShowMentions(true)
        return
      }
    }

    setShowMentions(false)
  }

  // Handle key events for navigating mentions and deleting mentions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (showMentions && filteredUsers.length > 0) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === "Escape") {
        e.preventDefault()

        if (e.key === "Escape") {
          setShowMentions(false)
        } else if (e.key === "Enter") {
          selectMention(filteredUsers[0])
        }
      }
    }

    // Check if backspace is deleting part of a mention
    if (e.key === "Backspace") {
      const { text, cursorPosition } = getContentEditableInfo()

      // Check if we're inside or at the end of a mention
      Object.values(selectedMentions).forEach((mention) => {
        const mentionText = `@${mention.handle}`
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
          setReplyText(newText)

          // Remove from selected mentions
          const updatedMentions = { ...selectedMentions }
          delete updatedMentions[mention.id]
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

  // Select a mention from the dropdown
  const selectMention = (user: User) => {
    if (mentionStartIndex !== -1) {
      const { text, cursorPosition } = getContentEditableInfo()

      const beforeMention = text.substring(0, mentionStartIndex)
      const afterMention = text.substring(cursorPosition)

      const mentionText = `@${user.handle}`
      const newText = `${beforeMention}${mentionText} ${afterMention}`

      // Update the content and state
      if (editorRef.current) {
        editorRef.current.innerText = newText
      }
      setReplyText(newText)

      // Add to selected mentions
      setSelectedMentions({ ...selectedMentions, [user.id]: user })

      // Reset mention state
      setShowMentions(false)
      setMentionSearch("")
      setMentionStartIndex(-1)

      // Focus and set cursor position
      setTimeout(() => {
        const newPosition = mentionStartIndex + mentionText.length + 1 // +1 for the space
        setCursorPosition(newPosition)
      }, 0)
    }
  }

  // Format text with colored mentions
  const formatTextWithMentions = () => {
    if (!editorRef.current || Object.keys(selectedMentions).length === 0) return

    // Save current selection
    const selection = window.getSelection()
    const savedRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null

    // Get current text
    const currentText = editorRef.current.innerText

    // Create HTML with colored mentions
    let html = currentText
    Object.values(selectedMentions).forEach((mention) => {
      const mentionText = `@${mention.handle}`
      html = html.replace(
        new RegExp(mentionText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        `<span class="text-blue-500">${mentionText}</span>`,
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
  }

  // Apply formatting when content changes or mentions change
  useEffect(() => {
    formatTextWithMentions()
  }, [replyText, selectedMentions])

  // Load more channels for infinite scroll
  const loadMoreChannels = () => {
    if (loadingMoreChannels || !hasMoreChannels) return

    setLoadingMoreChannels(true)

    // Simulate API call with timeout
    setTimeout(() => {
      const newChannels = Array.from({ length: 5 }, (_, i) => ({
        id: channels.length + i + 1,
        name: `channel-${channels.length + i + 1}`,
      }))

      setChannels([...channels, ...newChannels])
      setLoadingMoreChannels(false)

      // Stop after 30 channels for demo purposes
      if (channels.length + newChannels.length >= 30) {
        setHasMoreChannels(false)
      }
    }, 1000)
  }

  // Handle channel list scroll for infinite loading
  const handleChannelScroll = () => {
    if (!channelListRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = channelListRef.current
    if (scrollTop + clientHeight >= scrollHeight - 50 && hasMoreChannels && !loadingMoreChannels) {
      loadMoreChannels()
    }
  }

  // Add scroll event listener for channels
  useEffect(() => {
    const channelListElement = channelListRef.current
    if (channelListElement) {
      channelListElement.addEventListener("scroll", handleChannelScroll)
      return () => {
        channelListElement.removeEventListener("scroll", handleChannelScroll)
      }
    }
  }, [channels, loadingMoreChannels, hasMoreChannels])

  // Render the compose content
  const renderComposeContent = () => {
    return (
      <>
        <CardContent className="p-4 space-y-4">
          {/* Thread container with continuous line */}
          <div className="relative">
            {/* Continuous vertical line */}
            <div className="absolute w-0.5 bg-gray-700 left-5 top-10 bottom-[85px]"></div>

            {/* Original post */}
            <div className="flex gap-3">
              <Avatar className="h-10 w-10 border border-gray-700 relative z-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="@accountless.eth" />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500">AE</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold">accountless.eth</span>
                  <span className="text-gray-400">@accountless.eth · 5d</span>
                </div>
                <p className="my-1">"your crypto stays in your native wallet."</p>
                <Card className="mt-2 bg-[#1a1a1a] border border-gray-800 overflow-hidden">
                  <CardContent className="p-0">
                    <img src="/placeholder.svg?height=300&width=500" alt="Comparison chart" className="w-full h-auto" />
                    <div className="p-3">
                      <h3 className="font-bold text-lg">Introducing Encrypto: Spend Your Crypto, Anywhere</h3>
                      <p className="text-gray-400 text-sm">medium.com</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Replying to indicator */}
            <div className="flex items-center gap-2 text-blue-500 pl-12 mt-4">
              <span>Replying to</span>
              <span>@accountless.eth</span>
            </div>

            {/* Reply input */}
            <div className="flex gap-3 mt-4">
              <Avatar className="h-10 w-10 border border-gray-700 relative z-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback className="bg-gray-700">U</AvatarFallback>
              </Avatar>
              <div className="flex-1 relative">
                {/* ContentEditable div instead of textarea */}
                <div
                  ref={editorRef}
                  contentEditable={true}
                  className="w-full min-h-[3em] bg-transparent border-none outline-none text-white empty:before:content-[attr(data-placeholder)] empty:before:text-gray-500"
                  data-placeholder="Start typing a new cast here..."
                  onInput={handleInput}
                  onKeyDown={handleKeyDown}
                />

                {/* Mentions dropdown */}
                {showMentions && filteredUsers.length > 0 && (
                  <div
                    ref={mentionListRef}
                    className="absolute z-20 mt-1 w-full max-w-[300px] bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-lg overflow-hidden"
                  >
                    <div className="max-h-[300px] overflow-y-auto">
                      {filteredUsers.map((user) => (
                        <button
                          key={user.id}
                          className="flex items-center gap-3 w-full px-3 py-2 hover:bg-[#252525] transition-colors text-left"
                          onClick={() => selectMention(user)}
                        >
                          <Avatar className="h-8 w-8 border border-gray-700">
                            <AvatarImage src={user.avatar} alt={user.handle} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-400">@{user.handle}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center p-4 pt-0">
          <div className="flex gap-2 items-center">
            <Button variant="ghost" size="icon" className="text-gray-400 rounded-full">
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 rounded-full">
              <Smile className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 rounded-full">
              <Layout className="h-5 w-5" />
            </Button>

            {/* Channels Button */}
            <Popover open={showChannelSelector} onOpenChange={setShowChannelSelector}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 rounded-full flex items-center gap-1 px-2 h-8"
                >
                  <Hash className="h-4 w-4" />
                  <span>Channels</span>
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0 bg-[#1a1a1a] border-gray-800 text-white">
                <div className="p-2 border-b border-gray-800">
                  <div className="flex items-center gap-2 px-2 py-1 bg-[#252525] rounded">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search channels"
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-8 p-0 text-sm"
                      value={channelSearch}
                      onChange={(e) => setChannelSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div ref={channelListRef} className="py-1 max-h-60 overflow-auto">
                  {filteredChannels.map((channel) => (
                    <button
                      key={channel.id}
                      className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-[#252525] transition-colors"
                      onClick={() => setShowChannelSelector(false)}
                    >
                      <Hash className="h-4 w-4 text-gray-400" />
                      <span>{channel.name}</span>
                    </button>
                  ))}
                  {loadingMoreChannels && (
                    <div className="flex justify-center items-center py-2">
                      <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-3">
            {/* Character count */}
            {characterCount > 0 && (
              <span className="text-sm text-gray-400">
                {characterCount}/{maxCharacters}
              </span>
            )}

            <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-5" disabled={!replyText.trim()}>
              Reply
            </Button>
          </div>
        </CardFooter>
      </>
    )
  }

  // Render the drafts content
  const renderDraftsContent = () => {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 border border-dashed border-gray-700 rounded-md flex items-center justify-center mb-4">
          <div className="w-8 h-8 bg-gray-800 rounded"></div>
        </div>
        <h3 className="text-xl font-semibold mb-2">No drafts yet</h3>
        <p className="text-gray-400">You can stash casts here to post later.</p>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-[650px] bg-[#121212] text-white border-0 shadow-xl">
      <Tabs defaultValue="compose" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-0 border-b border-gray-800">
          <TabsList className="bg-transparent border-b-0 p-0 h-auto">
            <TabsTrigger
              value="compose"
              className="text-lg font-semibold data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=inactive]:text-gray-400 bg-transparent px-0 py-2 mr-4 rounded-none"
            >
              Compose
            </TabsTrigger>
            <TabsTrigger
              value="drafts"
              className="text-lg font-semibold data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=inactive]:text-gray-400 bg-transparent px-0 py-2 rounded-none"
            >
              Drafts
            </TabsTrigger>
          </TabsList>
          <Button variant="ghost" size="icon" className="text-gray-400">
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <TabsContent value="compose" className="mt-0 p-0">
          {renderComposeContent()}
        </TabsContent>

        <TabsContent value="drafts" className="mt-0 p-0">
          {renderDraftsContent()}
        </TabsContent>
      </Tabs>
    </Card>
  )
}
