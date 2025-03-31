
'use client'

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { Button } from "~/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { ImageIcon, SmileIcon, CalendarIcon, AtSignIcon } from 'lucide-react'
import { Modal } from "~/components/functional/modals/modal"
import { useMainStore } from "~/store/main"
import  { sendCast } from "~/lib/api"

// Mock user data for mentions
const users = [
  { id: 1, name: 'Alice', username: 'alice' },
  { id: 2, name: 'Bob', username: 'bob' },
  { id: 3, name: 'Charlie', username: 'charlie' },
  { id: 4, name: 'David', username: 'david' },
]

export function ComposeModal({ isOpen, setOpen } : { isOpen: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {

  const { mainUserData  } = useMainStore()

  const [mentionList, setMentionList] = useState<{ id: number, name: string, username: string }[]>([])
  const [mentionListVisible, setMentionListVisible] = useState(false)
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 })
  const editableRef = useRef<HTMLDivElement>(null)

  const doSendCast = async () => {
    const editable = editableRef.current
    if (!editable) return

    const text = editable.textContent || ''
    if (!text.trim()) return

    await sendCast({ text })
    setOpen(false)
  }

  useEffect(() => {
    if (isOpen && editableRef.current) {
      editableRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleMention = () => {
      const selection = window.getSelection()
      if (!selection || !selection.anchorNode) return

      const range = selection.getRangeAt(0)
      const start = range.startOffset
      const textContent = selection.anchorNode.textContent || ''
      const beforeCursor = textContent.slice(0, start)
      const match = beforeCursor.match(/@(\w*)$/)

      if (match) {
        const searchTerm = match[1].toLowerCase()
        const filtered = users.filter(user => 
          user.name.toLowerCase().includes(searchTerm) || 
          user.username.toLowerCase().includes(searchTerm)
        )
        setMentionList(filtered)
        setMentionListVisible(filtered.length > 0)

        // Position the mention list
        const rect = range.getBoundingClientRect()
        const editorRect = editableRef.current?.getBoundingClientRect()
        if (editorRect) {
          setMentionPosition({ 
            top: rect.bottom - editorRect.top, 
            left: rect.left - editorRect.left 
          })
        }
      } else {
        setMentionListVisible(false)
      }
    }

    const editable = editableRef.current
    if (editable) {
      editable.addEventListener('input', handleMention)
      return () => editable.removeEventListener('input', handleMention)
    }
  }, [])

  const handleMentionClick = (username: string) => {
    const selection = window.getSelection()
    if (!selection || !selection.anchorNode) return

    const range = selection.getRangeAt(0)
    const start = range.startOffset
    const textContent = selection.anchorNode.textContent || ''
    const beforeCursor = textContent.slice(0, start)
    const afterCursor = textContent.slice(start)
    const matchStart = beforeCursor.lastIndexOf('@')
    
    if (matchStart !== -1) {
      const mentionSpan = document.createElement('span')
      mentionSpan.className = 'text-purple-400'
      mentionSpan.textContent = `@${username}`
      
      const textNode = document.createTextNode(' ' + afterCursor)
      
      range.setStart(selection.anchorNode, matchStart)
      range.setEnd(selection.anchorNode, start)
      range.deleteContents()
      range.insertNode(textNode)
      range.insertNode(mentionSpan)
      
      // Move cursor to end of inserted mention
      range.setStartAfter(textNode)
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
    }

    setMentionListVisible(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      // Handle submit logic here
    }
  }



return (
    <>
     <Modal isOpen={isOpen} setIsOpen={setOpen}>
     <Tabs defaultValue="compose" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="compose" className="data-[state=active]:bg-[#2c2c2c]">Compose</TabsTrigger>
            <TabsTrigger value="drafts" className="data-[state=active]:bg-[#2c2c2c]">Drafts</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-start space-x-4 pt-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={mainUserData?.avatar} alt={`avatar ${mainUserData?.username}`} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1 relative">
            <div
              ref={editableRef}
              contentEditable
              tabIndex={0} // Add tabIndex attribute to make it tabbable
              className="w-full min-h-[150px] max-h-[300px] overflow-y-auto bg-transparent border-none focus:outline-none whitespace-pre-wrap break-words text-white"
              onKeyDown={handleKeyDown}
              aria-label="Compose new cast"
              role="textbox"
              data-placeholder="Start typing here..."
            />
            {mentionListVisible && (
              <ul 
                className="absolute z-10 bg-[#2c2c2c] rounded-md shadow-lg max-h-40 overflow-auto w-64"
                style={{ top: `${mentionPosition.top}px`, left: `${mentionPosition.left}px` }}
              >
                {mentionList.map(user => (
                  <button 
                    key={user.id} 
                    className="px-4 py-2 hover:bg-[#3c3c3c]"
                    onClick={() => handleMentionClick(user.username)}
                    role="menuitem"
                  >
                    @{user.username} ({user.name})
                  </button>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <ImageIcon className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <SmileIcon className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <CalendarIcon className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <AtSignIcon className="h-6 w-6" />
            </Button>
          </div>
          <Button className="bg-red-600 hover:bg-red-700 px-6 py-2 text-lg" onClick={doSendCast}> Cast</Button>
        </div>
    </Modal>
  </>
)
}