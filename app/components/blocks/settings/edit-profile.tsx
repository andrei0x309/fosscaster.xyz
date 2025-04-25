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
import { SettingsAlert } from './alert'

export function EditProfile() {

const [loading, setLoading] = useState(false)
const [error, setError] = useState('')
const [success, setSuccess] = useState('')
const { mainUserData, setUserData } = useMainStore()
 

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


  return (
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

    <SettingsAlert error={error} success={success} setError={setError} setSuccess={setSuccess} />
    
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
  )
}




