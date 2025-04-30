
import { useState, useEffect } from 'react'
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Switch } from "~/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { ChevronRight, Upload, Trash2 } from 'lucide-react'
import { useMainStore, userDefaultSettings } from '~/store/main'
import { useWeb3ModalAccount, useWeb3Modal, } from '@web3modal/ethers/react'
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

const descriptions = {
    isCryptoLeftFeedDisabled: 'This will remove cryptoleft crypto from your feed tabs',
    isTrendingFeedEnabled: 'This will enable trending feed from Warpcast, caution this feed may advertise specific accounts.',
    isFCFossFeedDisabled: 'This will remove fcfoss feed from your feed tabs',
    isPoliticsFeedDisabled: 'This will remove politics feed from your feed tabs',
    isSaveDraftEnabled: 'This will enable save draft feature',
    isDeveloperModeEnabled: 'This will enable developer mode',
    isPrimaryFeedFollowing: 'This will set Following as your primary feed instead of Home',
}

const names = {
    isPrimaryFeedFollowing: 'Set Following as Primary Feed',
    isCryptoLeftFeedDisabled: 'Disable Crypto Left Feed',
    isFCFossFeedDisabled: 'Disable FC FOSS Feed',
    isPoliticsFeedDisabled: 'Disable Politics Feed',
    isTrendingFeedEnabled: 'Enable Trending Feed',
    isSaveDraftEnabled: 'Enable Save Draft',
    isDeveloperModeEnabled: 'Enable Developer Mode',
}

export function UserSettings () {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const { mainUserData, setUserData } = useMainStore()

    const [checkBoxes, setCheckBoxes] = useState(mainUserData?.settings?.isCryptoLeftFeedDisabled !== undefined ? {
        isCryptoLeftFeedDisabled: mainUserData?.settings?.isCryptoLeftFeedDisabled,
        isDeveloperModeEnabled: mainUserData?.settings?.isDeveloperModeEnabled,
        isFCFossFeedDisabled: mainUserData?.settings?.isFCFossFeedDisabled,
        isPoliticsFeedDisabled: mainUserData?.settings?.isPoliticsFeedDisabled,
        isSaveDraftEnabled: mainUserData?.settings?.isSaveDraftEnabled,
        isPrimaryFeedFollowing: mainUserData?.settings?.isPrimaryFeedFollowing,
        isTrendingFeedEnabled: mainUserData?.settings?.isTrendingFeedEnabled,
    } : userDefaultSettings
    )
 

    const handleSwitch = async (currentState: boolean, cboxname: string) => {
        if (loading) return
        setLoading(true)
        const newState = {
            ...checkBoxes,
            [cboxname as keyof typeof checkBoxes]: currentState
        }
        new Promise(() => {
            const newUserData = {
                ...mainUserData,
                settings: newState
            }
            setUserData(newUserData)
            persistUserData(newUserData)
        })
        setCheckBoxes(newState)
        setLoading(false)
    }
 
    return (
        <div className="max-w-2xl">
            <div className="space-y-4">
                <p className="text-xl font-semibold mb-4">User local Settings</p>
                <p className="text-sm text-neutral-400"> These settings are local to your device, and will get reset when clear your browser data.</p>
                <div>
                {Object.keys(names ?? {}).map((key) => (
                    <div key={key} className="flex-col items-center justify-between max-w-[24rem] dark:bg-neutral-700 bg-neutral-200 border-[1px] border-neutral-600/70  p-2 rounded-md my-2">
                        <div className="flex items-center justify-between w-full">
                            <h3 className="font-medium">
                                {names[key as keyof typeof names]}
                            </h3>
                            <Switch disabled={loading} onClick={() => handleSwitch(!checkBoxes?.[key as keyof typeof names], key)}
                                checked={(checkBoxes ?? {})[key as keyof typeof names]}
                                className="data-[state=unchecked]:bg-red-600 data-[state=checked]:bg-green-500"
                            />
                        </div>
                        <p className="text-sm text-neutral-400">{descriptions[key as keyof typeof descriptions]}</p>
                    </div>
                ))}
                </div>
            </div>
        </div>
    )
}






