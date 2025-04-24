import { useState } from 'react'
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Switch } from "~/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { ChevronRight, Upload, Trash2 } from 'lucide-react'
import { useMainStore } from '~/store/main'
import { useWeb3ModalAccount, useWeb3Modal,  } from '@web3modal/ethers/react'
import { 
    getFidFromAddress,
    modal,
    getEthersProvider,
    signMsg,
    checkCurrentChain,
    OPTIMISM_CHAIN_ID,
    checkAndSwitchChain 
} from '~/lib/wallet'
import { wait } from '~/lib/misc'
import { 
    createWarpMessage,
    generateApiToken,
    NO_WARPCAST_SIGNER,
    genereteApiTokenForNoSigner,
    createWarpMessageForNoSigner 
} from '~/lib/wc-auth'
import CheckMark from '~/components/atomic/checkmark'
import { persistUserData, persistAllUsersData } from '~/lib/localstorage'
import { SimpleInput } from '~/components/atomic/simple-input'
import Loader from "~/components/atomic/loader"
import { CheckBox } from '~/components/atomic/checkbox'
import { 
    checkFnameAvailability,
    validateFname,
    registerFID,
    getWCKeyData,
    addKey,
    registerFname,
    getSignUpPrice
 } from "~/lib/sign-up"
import { useImmer } from 'use-immer'
import type { BrowserProvider } from 'ethers'
import { 
  completeRegistration,
  removeAvatar,
  uploadImage,
  setProfile
} from '~/lib/api'
import { getFnameLastTransfer } from '~/lib/third-party'


export default function SettingsPage({className}: {className?: string}) {
  
  const { mainUserData, setUserData } = useMainStore()
  const [activeSection, setActiveSection] = useState('Edit Profile')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { open, close } = useWeb3Modal()
  const { isConnected } = useWeb3ModalAccount()


  const closeError = () => {
    setError('')
  }
  

  const noContentYet = [
    'Verified Addresses',
    'Direct Casts',
    'Actions',
    'Muted Words'
  ]

  const sidebarItems = [
    'Edit Profile',
    'Register Fnames',
    'Feeds',
    'Verified Addresses',
    'Direct Casts',
    'Actions',
    'Muted Words',
    'Signers'
  ]

  const handleRemoveAvatar = async () => {
    try {
      if(loading) return
      setLoading(true)
      setError('')
      await wait(50)
      const remAvatarResult = await removeAvatar()
      if (!remAvatarResult) {
        setError('Failed to remove avatar')
        setLoading(false)
        return
      }
      setUserData({...mainUserData, avatar: remAvatarResult})
      persistUserData({...mainUserData, avatar: remAvatarResult})
      setLoading(false)
      setSuccess('Avatar removed successfully')
    } catch (error) {
      console.error('Failed to remove avatar', error)
      setError('Failed to remove avatar')
      setLoading(false)
    }
  }

  const handleUploadAvatar = async () => {
    try {
      if(loading) return
      setError('')
      await wait(50)
      const fileInput = document.getElementById('avatar') as HTMLInputElement
      if (!fileInput) {
        setError('Failed to upload avatar')
        setLoading(false)
        return
      }
      fileInput.click()
      fileInput.addEventListener('change', async () => {
        setLoading(true)
        const file = fileInput.files?.[0]
        if (!file) {
          setError('Failed to upload avatar')
          setLoading(false)
          return
        }
        const uploadAvatarResult = await uploadImage({file, doUploadAvatar: true})
        if (!uploadAvatarResult) {
          setError('Failed to upload avatar')
          setLoading(false)
          return
        }
        setUserData({...mainUserData, avatar: uploadAvatarResult})
        persistUserData({...mainUserData, avatar: uploadAvatarResult})
        setLoading(false)
        setSuccess('Avatar uploaded successfully')
      }
      )
    } catch (error) {
      console.error('Failed to upload avatar', error)
      setError('Failed to upload avatar')
      setLoading(false)
    }
  }

  const handleRegisterFname = async () => {
    try {
    if(loading) return
    const fname = document.getElementById('fname') as HTMLInputElement
    if (!fname) return
    if (!validateFname(fname.value)) {
      setError('Invalid Fname')
      return
    }
    const lastFname = await getFnameLastTransfer(fname.value)
    if (lastFname) {
      if(lastFname.to === mainUserData?.fid) {
        await completeRegistration({
          fid: lastFname.to,
          name: lastFname.username,
          owner: lastFname.owner,
          signature: lastFname.user_signature,
          timestamp: lastFname.timestamp
        })
        setSuccess(`Fname ${fname.value} set as primary`)
        setUserData({...mainUserData, username: fname.value})
        persistUserData({...mainUserData, username: fname.value})
        return
      }
      setError(`Fname ${fname.value} already registered`)
      return
    }

      setLoading(true)
      setError('')
      await wait(50)
        if (!isConnected) {
            await open()
            let promiseClose: () => void = () => {}
            new Promise((resolve) => {
                promiseClose = resolve as () => void
            })
            modal.subscribeState((state) => {
                if (state.open === false) {
                    promiseClose()
                }
            })
            await promiseClose()
            if (!isConnected) {
                setError('Wallet not connected')
                setLoading(false)
                return
            }
        }
        const provider = getEthersProvider(modal.getWalletProvider())
        const address = (await provider.getSigner()).address
        const FID = await getFidFromAddress(address)

        if (FID < 1) {
            setError(`Address ${address} does not own a FID`)
            setLoading(false)
            return
        }

        const regFname = await registerFname(fname.value, provider, FID)

        if (regFname.error) {
            setError(regFname?.message || 'Failed to register Fname')
            setLoading(false)
            return
        }

        setLoading(false)
        setSuccess('Fname registered successfully')
        fname.value = ''
  } catch (error) {
    console.error('Failed to register Fname', error)
    setError('Failed to register Fname')
    setLoading(false)
  }
}

const handleSetProfile = async () => {
  try {
    if(loading) return
    setError('')
    await wait(50)
    const displayName = document.getElementById('displayName') as HTMLInputElement
    const bio = document.getElementById('bio') as HTMLInputElement
    const location = document.getElementById('location') as HTMLInputElement
    if (!displayName && !bio && !location) {
      setError('No input provided')
      setLoading(false)
      return
    }
    setLoading(true)
    const data = {} as Record<string, any>

    if (displayName) {
      data['displayName'] = displayName.value
    }

    if (bio) {
      data['bio'] = bio.value
    }

    const setProfileResult = await setProfile({
      displayName: displayName.value,
      bio: bio.value,
    })
    if (!setProfileResult) {
      setError('Failed to set profile')
      setLoading(false)
      return
    }
    setUserData({...mainUserData, displayName: displayName.value, bio: bio.value})
    persistUserData({...mainUserData, displayName: displayName.value, bio: bio.value})
    setLoading(false)
    setSuccess('Profile updated successfully')
  } catch (error) {
    console.error('Failed to set profile', error)
    setError('Failed to set profile')
    setLoading(false)
  }
}


  return (
    <div className={`flex h-full w-full shrink-0 justify-center md:w-[850px] lg:w-[1040px] ${className}`}>
      {/* Sidebar */}
      <div className="w-64">
        <div className="border-b-[1px] border-neutral-400/40 border-r-[1px]">
        <div className="p-4">
        <h2 className="text-2xl font-bold mb-6">Settings</h2>
        {sidebarItems.map((item) => (
          <Button
            key={item}
            variant="ghost"
            className="w-full justify-between mb-2 text-left"
            onClick={() => setActiveSection(item)}
          >
            {item}
            <ChevronRight className="h-4 w-4" />
          </Button>
        ))}
         </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeSection === 'Edit Profile' ? (
          <div className="max-w-2xl">
            <div className="flex items-center mb-6">
              <Avatar className="h-24 w-24 mr-4">
                <AvatarImage src={mainUserData?.avatar} alt="@user" />
                <AvatarFallback>USER</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xl font-semibold">{mainUserData?.username ?? mainUserData?.displayName}</p>
                <div className="flex space-x-2 mt-2">
                  <Input id="avatar" type="file" hidden className='hidden' />
                  <Button size="sm" variant="outline" onClick={handleUploadAvatar}>
                    <Upload className="h-4 w-4 mr-2" />
                    {loading ? (<><Loader/><span>Processing...</span></>): <span>Upload photo</span>}
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-500" onClick={handleRemoveAvatar}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {loading ? (<><Loader/><span>Processing...</span></>): <span>Remove Photo</span>}
                  </Button>
                </div>
              </div>
            </div>
            {error || success ? <div className="my-3">

                                  {/* ALert Error */}
        {error && 
        <div className="bg-red-700 text-white p-2 rounded flex justify-between">
        <span className='mt-2 flex flex-col' >
        <span className='w-full'>{error}</span>
        </span>
        <Button onClick={closeError} className="ml-2 lr-auto" variant={'outline'}>x</Button>
        </div>}
        {/* ALert Success */}
        {success &&
        <div className="bg-green-700 text-white p-2 rounded flex justify-between">
        <span className='mt-2 flex flex-col' >
        <span className='w-full'>{success}</span>
        </span>
        <Button onClick={() => setSuccess('')} className="ml-2 lr-auto" variant={'outline'}>x</Button>
        </div>} 
            </div> : null}

            <div className="space-y-4">
              <div>
                
                <label htmlFor="username" className="block text-sm font-medium mb-1">Username<span className="text-sm text-neutral-500"> (You can set your fname from Register Fname section)</span> </label>
                <Input id="username" defaultValue={mainUserData?.username ?? 'No Fname set'} disabled />
              </div>
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium mb-1">Display Name</label>
                <Input id="displayName" defaultValue={mainUserData?.displayName} />
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium mb-1">Bio</label>
                <Textarea id="bio" rows={4} defaultValue={mainUserData?.bio} />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
                <Input id="location" placeholder={mainUserData?.location} />
              </div>
              <Button className="w-full" onClick={handleSetProfile}>
              {loading ? (<><Loader inverted={true} /><span>Processing...</span></>): <span>Save Changes</span>}
                </Button>
            </div>
          </div>
        ) : null}

        {activeSection === 'Register Fnames' ? (
          <div className="max-w-2xl">
            <div className="space-y-4">
              <div>
              <p className="text-xl font-semibold">Register Fname</p>
              <p className="text-sm text-neutral-500">You can regsiter a Fname here, only one Fname can be registered per FID, if already own a fid you can set it as primary here, if you sign with the owner fid.</p>

                <label htmlFor="fname" className="block text-sm font-medium mb-1">Fname</label>
                <Input id="fname" placeholder="Enter your fname" />
              </div>
                      {/* ALert Error */}
        {error && 
        <div className="bg-red-700 text-white p-2 rounded flex justify-between">
        <span className='mt-2 flex flex-col' >
        <span className='w-full'>{error}</span>
        </span>
        <Button onClick={closeError} className="ml-2 lr-auto" variant={'outline'}>x</Button>
        </div>}
        {/* ALert Success */}
        {success &&
        <div className="bg-green-700 text-white p-2 rounded flex justify-between">
        <span className='mt-2 flex flex-col' >
        <span className='w-full'>{success}</span>
        </span>
        <Button onClick={() => setSuccess('')} className="ml-2 lr-auto" variant={'outline'}>x</Button>
        </div>}
              <Button className="w-full" onClick={handleRegisterFname}>
              {loading ? (<><Loader inverted={true} /><span>Processing...</span></>): <span>Register Fname</span>}
                </Button>
            </div>
          </div>
        ) : null}

        {activeSection === 'Feeds' ? 
           <div className="max-w-2xl">
           <div className="space-y-4">
             <p className="text-xl font-semibold mb-4">Feeds Settings</p>

             <div className="flex items-center justify-between max-w-[20rem]">
                          <div>
                            <h3 className="font-medium flex items-center justify-between">Disable CryptoLeft Feed  <Switch /></h3>
                            <p className="text-sm text-neutral-400">This will remove cryptoleft crypto from your feed tabs</p>
                          </div>
                         
              </div>
              <div className="flex items-center justify-between max-w-[20rem]">
                          <div>
                            <h3 className="font-medium flex items-center justify-between ">Enable Trending Feed <Switch /></h3>
                            <p className="text-sm text-neutral-400">This will enable trending feed from Warpcast be aware this feed is practically advertising.</p>
                          </div>
                          
              </div>


              </div>
            </div> : null}

        {noContentYet.includes(activeSection) ? 
          
          <div className="max-w-2xl">
            <p className="text-xl font-semibold">No enough intersting content</p>
            <p className="text-sm text-neutral-500">This section is empty will add later something</p>
          </div>
        
        : null}
        

      </div>
    </div>
  )
}