"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { X, Search, Loader2, ImageIcon, Copy, Check } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import type { TWCDcUsers } from '~/types/wc-dc-users'
import { useMainStore } from "~/store/main"
import { getDirectCastUsers, uploadImage } from "~/lib/api"
 
type User = TWCDcUsers['result']['users'][number]
type ModalStep = "select-users" | "create-group" | "add-to-group"

export function DirectCastModal() {
  const { isDcModalOpen, dcModalPage, setDcModalOpen, navigate, mainUserData } = useMainStore()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [currentStep, setCurrentStep] = useState<ModalStep>(dcModalPage as ModalStep || "select-users")
  const [groupName, setGroupName] = useState("")
  const [groupDescription, setGroupDescription] = useState("")
  const [groupImage, setGroupImage] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const lastUserElementRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [users, setUsers] = useState<TWCDcUsers>({} as TWCDcUsers)
  const [groupId, setGroupId] = useState("")
  const [copied, setCopied] = useState(false)

 

    const handleSearch = async (q: string) => {
    setSearchQuery(q)
    if (q.trim() === "") return
    if (isLoading) return
    setIsLoading(true)
    try {
      const users = await getDirectCastUsers({q, excludeFids: selectedUsers.map(user => user.fid)})
      setUsers(users)
      if(!users?.next?.cursor) {
        setHasMore(true)
      } else {
        setHasMore(false)
      }
      setPage(1)
    }
    catch (error) {
      console.error(error)
    }
    setIsLoading(false)
  }

 
 
  const loadMoreUsers = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    const newUsers = await getDirectCastUsers({
      q: searchQuery,
      cursor: users.next?.cursor,
      excludeFids: selectedUsers.map((user) => user.fid),
    })
    if(newUsers?.next?.cursor) {
      setHasMore(true)
    } else {
      setHasMore(false)
    }
    setUsers((prevUsers) => ({
      ...prevUsers,
      result: {
        ...prevUsers.result,
        users: [...prevUsers.result.users, ...newUsers.result.users],
      },
      next: newUsers.next,
    }))

    setPage((prevPage) => prevPage + 1)

    setIsLoading(false)
   
  }, [isLoading, hasMore, searchQuery, users.next?.cursor, selectedUsers])

  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    if (isLoading || currentStep !== "select-users") return

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreUsers()
        }
      },
      { threshold: 0.5 },
    )

    if (lastUserElementRef.current) {
      observerRef.current.observe(lastUserElementRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [isLoading, hasMore, loadMoreUsers, currentStep])

  // Generate default group name from selected users
  useEffect(() => {
    if (currentStep === "create-group" && !groupName) {
      const names = selectedUsers.map((user) => {
        const nameParts = user.username.split(".")
        return nameParts[0]
      })
      setGroupName(names.join(", "))
    }
  }, [currentStep, selectedUsers, groupName])

  const clearSearch = () => {
    setSearchQuery("")
  }

  const selectUser = (user: User) => {
    setSelectedUsers([...selectedUsers, user])
    setSearchQuery("")
    setUsers({} as TWCDcUsers)
  }

  const removeUser = (fid: number) => {
    setSelectedUsers(selectedUsers.filter((user) => user.fid !== fid))
  }

  const copyInviteLink = () => {
    const inviteLink = `warpcast.com/~/group/${groupId}`
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  const handleAddToGroup = () => {
    console.log(
      "Adding users to group:",
      selectedUsers.map((user) => user.username),
    )
    setDcModalOpen(false)
  }

  const handleSkip = () => {
    console.log("Skipped adding users to group")
    setDcModalOpen(false)
  }

  const handleContinue = () => {
    if (selectedUsers.length === 1) {
      // Handle direct message
      setDcModalOpen(false)
      navigate(`/~/inbox/${mainUserData?.fid}-${selectedUsers[0].fid}`)
    } else if (selectedUsers.length > 1) {
      // Move to group creation step
      setCurrentStep("create-group")
    }
  }

  const handleCreateGroup = () => {
    console.info("Creating group with:", {
      name: groupName,
      description: groupDescription,
      image: groupImage,
      members: selectedUsers.map((user) => user.username),
    })
    //setOpen(false)
  }

  const handleUploadImage = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setGroupImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }

    // fileInputRef.current?.addEventListener('change', async () => {
    //   setLoading(true)
    //   const file = fileInput.files?.[0]
    //   if (!file) {
    //     setError('Failed to upload avatar')
    //     setLoading(false)
    //     return
    //   }
    //   const uploadAvatarResult = await uploadImage({file, doUploadAvatar: true})
    //   if (!uploadAvatarResult) {
    //     setError('Failed to upload avatar')
    //     setLoading(false)
    //     return
    //   }
  }

  const goBack = () => {
    setCurrentStep("select-users")
  }

 
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900/50">
  <Dialog open={isDcModalOpen} onOpenChange={setDcModalOpen}>
    <DialogContent className="sm:max-w-md dark:bg-neutral-800 border-neutral-700 text-white">
          <DialogHeader className="border-b border-neutral-800 pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-white">
                {currentStep === "create-group" || selectedUsers.length > 1 ? "New group" : "New direct cast"}
              </DialogTitle>

            </div>
          </DialogHeader>

          {currentStep === "select-users" ? (
            <>
              <div className="py-2">
                <div className="relative">
             <Input
                value={searchQuery}
                onChange={(e) => handleSearch(e?.target?.value)}
                placeholder="Search"
                className="bg-[#2a2a3a] border-none text-white pl-8 pr-8 py-2 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400">
                    <Search className="h-4 w-4" />
                  </div>
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearSearch}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-neutral-400 hover:text-white hover:bg-transparent"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

          {selectedUsers.length > 0 && (
            <div className="mb-2">
              <div className="text-xs text-neutral-400 px-1 pb-1">Selected</div>
              <div className="flex flex-wrap gap-1">
                {selectedUsers.map((user) => (
                  <div key={user.fid} className="flex items-center gap-1 bg-[#2a2a3a] rounded-full pl-1 pr-2 py-1">
                    <Avatar className="h-5 w-5 border border-neutral-700">
                      <AvatarImage src={user.pfp?.url} />
                      <AvatarFallback className="bg-purple-600 text-white text-[10px]">
                        {user?.displayName?.substring(0, 2)?.toUpperCase() ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-white">{user.username}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeUser(user.fid)}
                      className="h-4 w-4 ml-1 text-neutral-400 hover:text-white hover:bg-transparent p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

             
         {users?.result?.users?.length > 0 ? (
            <>
              <div className="text-xs text-neutral-400 px-1 pb-1">{searchQuery ? "Results" : "Suggestions"}</div>

              <div className="max-h-[240px] overflow-y-auto pr-1 -mr-1">
                {users?.result?.users.map((user, index) => (
                  <div
                    role="button"
                    aria-hidden="true"
                    key={user.fid}
                    ref={index === users.result.users.length - 1 ? lastUserElementRef : null}
                    className="flex items-center gap-2 p-2 rounded hover:bg-neutral-700/50 cursor-pointer"
                    onClick={() => selectUser(user)}
                  >
                    <Avatar className="h-8 w-8 border border-neutral-700">
                      <AvatarImage src={user.pfp?.url} />
                      <AvatarFallback className="bg-purple-600 text-white text-xs">
                      {user?.displayName?.substring(0, 2)?.toUpperCase() ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-white">{user.username}</span>
                    <div className="ml-auto flex items-center justify-center w-5 h-5 rounded-full bg-neutral-600 text-xs text-white">
                        +
                    </div>
                  </div>
                ))}

                    {isLoading && (
                      <div className="flex justify-center items-center py-4">
                        <Loader2 className="h-5 w-5 text-purple-500 animate-spin" />
                        <span className="ml-2 text-sm text-neutral-400">Loading more users...</span>
                      </div>
                    )}

                    {!isLoading && !hasMore && page > 1 && (
                      <div className="text-center py-3 text-sm text-neutral-400">No more users to load</div>
                    )}

              </div>
            </>
          ) : (
            <div className="py-8 text-center text-neutral-400 text-sm">
              {searchQuery ? "No results found" : "Start typing to search people"}
            </div>
          )}

              <div className="flex justify-between gap-2 pt-4 border-t border-neutral-800 mt-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-[#2a2a3a] text-white border-neutral-700 hover:bg-neutral-700 hover:text-white"
                  onClick={() => setDcModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-600 text-white hover:bg-red-700"
                  disabled={selectedUsers.length === 0}
                  onClick={handleContinue}
                >
                  {selectedUsers.length === 1 ? "Message" : "Continue"}
                </Button>
              </div>
            </>
          ) : (
            // Group creation form
            <>
              <div className="flex flex-col items-center justify-center py-4">
                <div className="relative w-24 h-24 rounded-full bg-[#2a2a3a] flex items-center justify-center mb-2">
                  {groupImage ? (
                    <img
                      src={groupImage || "/placeholder.svg"}
                      alt="Group"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <ImageIcon className="h-10 w-10 text-neutral-500" />
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUploadImage}
                  className="bg-[#2a2a3a] text-white border-neutral-700 hover:bg-neutral-700"
                >
                  Upload image
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="group-name" className="text-xs text-neutral-400">
                    Group Name
                  </label>
                  <Input
                    id="group-name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="bg-[#2a2a3a] border-none text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="group-description" className="text-xs text-neutral-400">
                    Description
                  </label>
                  <Textarea
                    id="group-description"
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    placeholder="Add a description for your group..."
                    className="bg-[#2a2a3a] border-none text-white min-h-[100px] focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <div className="flex justify-between gap-2 pt-4 border-t border-neutral-800 mt-4">
                <Button
                  variant="outline"
                  className="flex-1 bg-[#2a2a3a] text-white border-neutral-700 hover:bg-neutral-700 hover:text-white"
                  onClick={goBack}
                >
                  Cancel
                </Button>
                <Button className="flex-1 bg-red-600 text-white hover:bg-red-700" onClick={handleCreateGroup}>
                  Create group
                </Button>
              </div>
            </>
          )}


          
            {currentStep === "add-to-group" && (
            <>
              <div className="py-2">
                <div className="relative bg-[#2a2a3a] rounded-md p-3 flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-white">Share invite link</span>
                    <span className="text-xs text-neutral-400">warpcast.com/~/group/{groupId}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyInviteLink}
                    className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-neutral-700"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="relative">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="bg-[#2a2a3a] border-none text-white pl-8 pr-8 py-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400">
                    <Search className="h-4 w-4" />
                  </div>
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearSearch}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-neutral-400 hover:text-white hover:bg-transparent"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {selectedUsers.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs text-neutral-400 px-1 pb-1">Selected</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedUsers.map((user) => (
                      <div key={user.fid} className="flex items-center gap-1 bg-[#2a2a3a] rounded-full pl-1 pr-2 py-1">
                        <Avatar className="h-5 w-5 border border-neutral-700">
                          <AvatarImage src={user.pfp?.url} />
                          <AvatarFallback className="bg-red-600 text-white text-[10px]">
                            {user.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-white">{user.username}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeUser(user.fid)}
                          className="h-4 w-4 ml-1 text-neutral-400 hover:text-white hover:bg-transparent p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {users.result.users.length > 0 && searchQuery ? (
                <>
                  <div className="text-xs text-neutral-400 px-1 pb-1">Results</div>

                  <div className="max-h-[240px] overflow-y-auto pr-1 -mr-1">
                    {users.result.users.map((user, index) => (
                      <div
                        key={user.fid}
                        ref={index === users.result.users.length - 1 ? lastUserElementRef : null}
                        className="flex items-center gap-2 p-2 rounded hover:bg-neutral-700/50 cursor-pointer"
                        onClick={() => selectUser(user)}
                        aria-hidden="true"
                      >
                        <Avatar className="h-8 w-8 border border-neutral-700">
                          <AvatarImage src={user.pfp?.url} />
                          <AvatarFallback className="bg-purple-600 text-white text-xs">
                            {user.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-white">{user.username}</span>
                        <div className="ml-auto flex items-center justify-center w-5 h-5 rounded-full bg-neutral-600 text-xs text-white">
                            +
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex justify-center items-center py-4">
                        <Loader2 className="h-5 w-5 text-purple-500 animate-spin" />
                        <span className="ml-2 text-sm text-neutral-400">Loading more users...</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="py-16 text-center text-neutral-400 text-sm">
                  {searchQuery ? "No results found" : "Start typing to search people"}
                </div>
              )}

              <div className="flex justify-between gap-2 pt-4 border-t border-neutral-800 mt-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-[#2a2a3a] text-white border-neutral-700 hover:bg-neutral-700 hover:text-white"
                  onClick={handleSkip}
                >
                  Skip
                </Button>
                <Button
                  className="flex-1 bg-purple-600 text-white hover:bg-purple-700"
                  disabled={selectedUsers.length === 0}
                  onClick={handleAddToGroup}
                >
                  Select users
                </Button>
              </div>
            </>
          )}

        </DialogContent>
      </Dialog>
    </div>
  )
}
