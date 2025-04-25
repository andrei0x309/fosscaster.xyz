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
import { EditProfile } from '~/components/blocks/settings/edit-profile'
import { RegisterFname } from '~/components/blocks/settings/register-fname'
import { DraggableMiniApps } from '~/components/blocks/settings/mini-apps'

export default function SettingsPage({className}: {className?: string}) {
  
  const { mainUserData, setUserData } = useMainStore()
  const [activeSection, setActiveSection] = useState('Edit Profile')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  



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
    'Mini Apps',
    'Experimental'
  ]

  const disabledItems = [
    'Experimental',
    'Feeds',
  ]




  return (
    <div className={`flex h-full w-full shrink-0 justify-center md:w-[850px] lg:w-[1040px] ${className}`}>
      {/* Sidebar */}
      <div className="w-64">
        <div className="border-b-[1px] border-neutral-400/40 border-r-[1px]">
        <div className="p-4">
        <h2 className="text-2xl font-bold mb-6">Settings</h2>
        {sidebarItems.filter(item => !disabledItems.includes(item)).map((item) => (
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
        {activeSection === 'Edit Profile' ? (<EditProfile />) : null}

        {activeSection === 'Register Fnames' ? (<RegisterFname />) : null}


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
        

        {activeSection === 'Mini Apps' ? (<DraggableMiniApps />) : null}

      </div>
    </div>
  )
}