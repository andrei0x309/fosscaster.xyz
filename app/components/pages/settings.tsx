import { useState, useEffect } from 'react'
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Switch } from "~/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { ChevronRight, Loader2, Upload, Trash2 } from 'lucide-react'
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
import { UserSettings } from '~/components/blocks/settings/local-user-settings'
import { Img as Image } from 'react-image'
import { useLocation } from 'react-router'


const urlRoutes = {
  'Edit Profile': '/~/settings',
  'Register Fnames': '/~/settings/register-fname',
  'Mini Apps': '/~/settings/mini-apps',
  'User Settings': '/~/settings/user-settings',
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
  'Mini Apps',
  'User Settings',
]


export default function SettingsPage({className}: {className?: string}) {
  
  const { mainUserData, setUserData } = useMainStore()
  const [activeSection, setActiveSection] = useState('Edit Profile')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { pathname } = useLocation()

  const loadTab = async (section: string) => {
    setActiveSection(section)
    if(urlRoutes[section as keyof typeof urlRoutes] !== pathname && urlRoutes[section as keyof typeof urlRoutes]) {
      window.history.pushState(null, '', urlRoutes[section as keyof typeof urlRoutes])
    }
  }

  useEffect(() => {
    if(Object.values(urlRoutes).includes(pathname)) {
      const section = Object.keys(urlRoutes).find((key) => urlRoutes[key as keyof typeof urlRoutes] === pathname)
      if(section) {
          loadTab(section)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])


  const closeError = () => {
    setError('')
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
            
            className={`w-full justify-between mb-2 text-left ${activeSection === item ? 'bg-accent text-accent-foreground' : ''} `}
            onClick={() => loadTab(item)}
          >
            {item}
            <ChevronRight className="h-4 w-4" />
          </Button>
        ))}
        <p className="text-sm text-neutral-500">Under Development</p>
        {noContentYet.map((item) => (
          <Button
            key={item}
            variant="ghost"
            className={`w-full justify-between mb-2 text-left ${activeSection === item ? 'bg-accent text-accent-foreground' : ''} `}
            onClick={() => loadTab(item)}
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


        {activeSection === 'User Settings' ? 
           <UserSettings /> : null}

        {noContentYet.includes(activeSection) ? 
          
          <div className="max-w-2xl">
            <p className="text-xl font-semibold">No enough interesting content</p>
            <p className="text-sm text-neutral-500">This section is empty will add later something</p>
            <Image className="max-w-96 m-2" src={["https://scontent-iad4-1.choicecdn.com/-/rs:fill:2000:2000/g:ce/f:webp/aHR0cHM6Ly9tYWdpYy5kZWNlbnRyYWxpemVkLWNvbnRlbnQuY29tL2lwZnMvYmFma3JlaWFnMnViMm10YzZ5bWdkZGJmZXB0Mm13YmkzNGxtbXc0aHhnc3FqZnpkaWVhaHBpNGlyeWk", '/placeholder.svg']} loader={<Loader2 className="h-5 w-5 text-red-500 animate-spin" />} />
          </div>
        
        : null}
        

        {activeSection === 'Mini Apps' ? (<DraggableMiniApps />) : null}

      </div>
    </div>
  )
}