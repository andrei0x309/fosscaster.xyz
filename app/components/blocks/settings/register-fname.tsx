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

export function RegisterFname() {

const [loading, setLoading] = useState(false)
const [error, setError] = useState('')
const [success, setSuccess] = useState('')
const { mainUserData, setUserData } = useMainStore()

const { open, close } = useWeb3Modal()
const { isConnected } = useWeb3ModalAccount()


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

  return (
    
<div className="max-w-2xl">
            <div className="space-y-4">
              <div>
              <p className="text-xl font-semibold">Register Fname</p>
              <p className="text-sm text-neutral-500">You can regsiter a Fname here, only one Fname can be registered per FID, if already own a fid you can set it as primary here, if you sign with the owner fid.</p>

                <label htmlFor="fname" className="block text-sm font-medium mb-1">Fname</label>
                <Input id="fname" placeholder="Enter your fname" />
              </div>
              <SettingsAlert error={error} success={success} setError={setError} setSuccess={setSuccess} />

        <Button className="w-full" onClick={handleRegisterFname}>
              {loading ? (<><Loader inverted={true} /><span>Processing...</span></>): <span>Register Fname</span>}
                </Button>
            </div>
          </div>
  )
}






