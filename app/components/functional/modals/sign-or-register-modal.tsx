'use client'

import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { Button } from "~/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { ImageIcon, SmileIcon, CalendarIcon, AtSignIcon } from 'lucide-react'
import { Modal } from "~/components/functional/modals/modal"
import ConnectButton from "~/components/atomic/connect-button"
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
import { wc } from '~/lib/client'
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
import { warpcastCreateSignedKeyRequest, completeRegistration } from '~/lib/api'
import { getFnameLastTransfer } from '~/lib/third-party'

const defaultChecked = 
{
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
    step6: false,
    step7: false
}

export function SignInOrSignUpModal() {

    const { setConnectModalOpen, isConnectModalOpen, setUserData, allUsersData, setAllUsersData, setIsUserLoggedIn } = useMainStore()

    const [fid, setFid] = useState(0)
    const [seconds, setSeconds] = useState(6)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [hasSigner, setHasSigner] = useState(true)
    const [inutText, setInputText] = useState('')
    const [inputFname, setInputFname] = useState('')
    const [modalTitle, setModalTitle] = useState('Sign in')
    const [signupStepsChecked, updateSignupStepsChecked] = useImmer(defaultChecked)
      
    const { isConnected } = useWeb3ModalAccount()
    const { open, close } = useWeb3Modal()

    const closeError = () => {
        setError('')
    }

    function setStepts(state: typeof defaultChecked) {
        updateSignupStepsChecked((draft) => {
            for (const key in state) {
                draft[key as keyof typeof defaultChecked] = state[key as keyof typeof defaultChecked]
            }
        })
    }

    function checkStep(setp: keyof typeof defaultChecked) {
        updateSignupStepsChecked((draft) => {
            draft[setp] = true
        })
    }

    function resetSteps() {
        setStepts(defaultChecked)
    }

    const handleSignIn = async () => {
      try {
      setLoading(true)
      setError('')
      await wait(100)
      setHasSigner(true)
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
        const message = createWarpMessage()
        const provider = getEthersProvider(modal.getWalletProvider())
        const address = (await provider.getSigner()).address
        const FID = await getFidFromAddress(address)
        if (FID < 1) {
            setError(`Address ${address} does not own a FID`)
            setLoading(false)
            return
        }
 
 
        const sig = await signMsg(provider, message.message)
        if(!sig) {
            setError('Failed to sign message')
            setLoading(false)
            return
        }
        const result = await generateApiToken(sig, message.payload)
        if (!result.success) {

        if(result.data === NO_WARPCAST_SIGNER) {
            setHasSigner(false)
            setError('No Warpcast signer found, please create one')
            setLoading(false)
            return
        }
            setError('Failed to generate token')
            setLoading(false)
            return
        }
        const token = result.data

        wc.setToken(token)

        let user: Awaited<ReturnType<typeof wc.getMe>> | null = null
        let timeout = 3000
        let pass = false
        do {
            try {
                timeout-= 300
                user = await wc.getMe()
                pass = true
            } catch (error) {
                await wait(300)
                console.error('Failed to get user data, retrying', error)
            }} while(!pass && timeout > 0)
        if (!user) {
            setError('Failed to get user data, token is invalid')
            setLoading(false)
            return
        }
        const userData = {
            authToken: token,
            avatar: user?.result?.user?.pfp?.url ?? '/placeholder.png',
            username: user?.result?.user?.username ?? user?.result?.user?.displayName,
            displayName: user?.result?.user?.displayName,
            bio: user?.result?.user?.profile?.bio?.text ?? '',
            fid: user?.result?.user?.fid,
            location: user?.result?.user?.profile?.location?.description,
            locationId: user?.result?.user?.profile?.location?.placeId
        }

        if(!(allUsersData.find((u) => u.fid === userData.fid))) {
           allUsersData.push(userData)
           setAllUsersData(allUsersData)
           persistAllUsersData(allUsersData)
        }

        setUserData(userData)
        persistUserData(userData)
        setIsUserLoggedIn(true)
        setLoading(false)
        setConnectModalOpen(false)
      } catch (error) {
        setError('Failed to sign in due to an unexpected error')
        console.error('Failed to sign in', error)
        setLoading(false)
      }
    }

    const handleAuthTokenSignIn = async () => {
        try {
            setLoading(true)
            setError('')
            await wait(100)
            if(!inutText) {
            setError('Please input a token')
            setLoading(false)
            return
            }
            const token = inutText
            const initToken = wc.getToken() as string
            wc.setToken(token)
            let user: Awaited<ReturnType<typeof wc.getMe>> | null = null
            try {
                user = await wc.getMe()
            } catch (error) {
                console.error('Failed to get user data', error)
            }
            if (!user) {
                setError('Failed to get user data, token is invalid')
                setLoading(false)
                wc.setToken(initToken)
                return
            }
            const userData = {
                authToken: token,
                avatar: user?.result?.user?.pfp?.url ?? '/placeholder.png',
                username: user?.result?.user?.username ?? user?.result?.user?.displayName,
                displayName: user?.result?.user?.displayName,
                bio: user?.result?.user?.profile?.bio?.text ?? '',
                fid: user?.result?.user?.fid,
                location: user?.result?.user?.profile?.location?.description,
                locationId: user?.result?.user?.profile?.location?.placeId
            }
    
            if(!(allUsersData.find((u) => u.fid === userData.fid))) {
             allUsersData.push(userData)
             setAllUsersData(allUsersData)
             persistAllUsersData(allUsersData)
            }
    
            setUserData(userData)
            persistUserData(userData)
            setIsUserLoggedIn(true)
            setLoading(false)
            setConnectModalOpen(false)
        } catch (error) {
            setError('Failed to sign in due to an unexpected error')
            console.error('Failed to sign in', error)
            setLoading(false)
        }
    }

    const handleSignUp = async () => {
      try {
      resetSteps()
      setLoading(true)
      setError('')
      await wait(100)
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
                setError('No address selected')
                setLoading(false)
                return
            }
        }
        const provider = getEthersProvider(modal.getWalletProvider())
        const address = (await provider.getSigner()).address

        const FID = await getFidFromAddress(address)
 
        const switchResult =  await checkAndSwitchChain(provider, OPTIMISM_CHAIN_ID)
        if(!switchResult) {
           await wait(1500)
           const currentChain = await checkCurrentChain(provider, OPTIMISM_CHAIN_ID)
              if(!currentChain) {
                setError('Please switch to Optimism chain')
                setLoading(false)
                return
              }
        }

        const stepsCheckedDefault = {...signupStepsChecked, step1: true}
        const stepsChecked = JSON.parse(localStorage.getItem('signupStepsChecked') || JSON.stringify(stepsCheckedDefault))
        localStorage.setItem('signupStepsChecked', JSON.stringify(stepsChecked))
        setStepts(stepsChecked)
        checkStep('step1')
 

        if(inputFname) {
            const fnameValid = validateFname(inputFname)
            if(!fnameValid.valid) {
                setError(fnameValid.error)
                setLoading(false)
                return
            }
            const fnameAvailable = await checkFnameAvailability(inputFname)
            if(!fnameAvailable) {
                setError('Fname is not available, please try another one')
                setLoading(false)
                return
            }
            localStorage.setItem('signupStepsChecked', JSON.stringify({...signupStepsChecked, step2: true}))
            localStorage.setItem('fname', inputFname)
        }
        checkStep('step2')


        const price = await getSignUpPrice()
        if(price.error) {
            setError('Failed to get sign up price')
            setLoading(false)
            return
        }
        
        localStorage.setItem('signupStepsChecked', JSON.stringify({...signupStepsChecked, step3: true}))
        checkStep('step3')
        

        if(!stepsChecked.step4 && FID === 0) {
            const data = await registerFID(provider, price.price)

            if(data.error) {
                setError('User rejected register transaction')
                setLoading(false)
                return
            }

            localStorage.setItem('signupStepsChecked', JSON.stringify({...signupStepsChecked, step4: true}))
        }
        checkStep('step4')


        if(!stepsChecked.step5) {
        await wait(1000)
        let loopSeconds = 6
        do {
            await wait(1000)
            setSeconds((prev) => prev - 1)
            loopSeconds--
        } while (loopSeconds > 0)
        }
        setSeconds(6)

        checkStep('step5')

        
        if(!stepsChecked.step6) {
            const result = await addWarpcastSigner(provider)
            if(!result && Number(result) !== -1) {
                return
            }
            localStorage.setItem('signupStepsChecked', JSON.stringify({...signupStepsChecked, step6: true}))
        }
        checkStep('step6')
         
        if(!stepsChecked.step7) {
            if(inputFname) {
                const FID = await getFidFromAddress(address)
                if(FID === 0) {
                    setError('Failed to get FID')
                    setLoading(false)
                    return
                }

                const fnameResult = await registerFname(inputFname, provider, FID)
                if(fnameResult.error) {
                    setError('Failed to register fname')
                    setLoading(false)
                    return
                }

                try {
                    const fnameData = await getFnameLastTransfer(inputFname)
                    if(fnameData) {
                        await completeRegistration({
                            fid: fnameData.to,
                            name: fnameData.username,
                            owner: fnameData.owner,
                            signature: fnameData.user_signature,
                            timestamp: fnameData.timestamp
                        })
                    }
                    } catch (error) {
                        console.error('Failed to complete fname registration', error)
                    }
            }
        localStorage.setItem('signupStepsChecked', JSON.stringify({...signupStepsChecked, step7: true}))
        }
        checkStep('step7')
         setLoading(false)

        setSuccess('Sign up successful, please try to sign in again')
        
        } catch (error) {
            setError('Failed to sign up due to an unexpected error')
            console.error('Failed to sign up', error)
            setLoading(false)
        }
    }


    const addWarpcastSigner = async (provider: BrowserProvider) => {
        const message = createWarpMessageForNoSigner()
            const sig = await signMsg(provider, message.message)
            if(!sig) {
                setError('Failed to sign message')
                setLoading(false)
                return false
            }
            const result = await genereteApiTokenForNoSigner(sig, message.payload) as string

            if (!result) {
                setError('Failed to generate token')
                setLoading(false)
                return false
            }

            const keyResult = await warpcastCreateSignedKeyRequest(result)

            const alreayHasSigner = (keyResult as any)?.errors?.[0]?.message?.includes('already')
    
            
            if(!keyResult?.result?.signedKeyRequest?.key) {
                if(alreayHasSigner) {
                    return true
                }
                setError('Failed to get warpcast key')
                setLoading(false)
                return false
            }

            const key = keyResult.result.signedKeyRequest.key
            const address = (await provider.getSigner()).address

            const keyData = await getWCKeyData(address, key)

            if(!keyData?.keyData?.metadata) {
                setError('Failed to get key data')
                setLoading(false)
                return false
            }

            const switchResult =  await checkAndSwitchChain(provider, OPTIMISM_CHAIN_ID)
            if(!switchResult) {
               await wait(1500)
               const currentChain = await checkCurrentChain(provider, OPTIMISM_CHAIN_ID)
                  if(!currentChain) {
                    setError('Please switch to Optimism chain')
                    setLoading(false)
                    return false
                  }
            }

            const keyAddResult = await addKey(provider, keyData.keyData)
            if(keyAddResult.error) {
                setError('User rejected add key transaction')
                setLoading(false)
                return false
            }
            
            return true
    }

    const handleCreateSigner = async () => {
        try {
            setLoading(true)
            setError('')
            await wait(100)
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
                    setError('No address selected')
                    setLoading(false)
                    return
                }
            }
            const provider = getEthersProvider(modal.getWalletProvider())
            const result = await addWarpcastSigner(provider)

            if(!result) {
                return
            }

            setHasSigner(true)
            setLoading(false)
            setSuccess('Signer created successfully, please try to sign in again')
 
            
        } catch (error) {
            setError('Failed to create signer due to an unexpected error')
            console.error('Failed to create signer', error)
            setLoading(false)
        }

    }

    useEffect(() => {
       setInputFname(localStorage.getItem('fname') || '')
    }, [])


  return (
      <>
       <Modal isOpen={isConnectModalOpen} setIsOpen={setConnectModalOpen} dialogTitleText={modalTitle} preventClose={loading} >
        <Tabs defaultValue="signIn" className="w-full min-h-[27rem]" onValueChange={(value) => {
            setError('')
            setSuccess('')
            if(value === 'signIn') {
                setModalTitle('Sign in')
            } else {
                setModalTitle('Sign up')
            }
        }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signIn" className="dark:data-[state=active]:bg-[#2c2c2c]">Sign in</TabsTrigger>
            <TabsTrigger value="signUp" className="dark:data-[state=active]:bg-[#2c2c2c]">Sign up</TabsTrigger>
          </TabsList>
        <TabsContent value="signIn">
        <Tabs defaultValue="wallet" className="w-full">
           <h2 className="flex text-[0.9rem] opacity-80 uppercase items-center justify-center mb-2 mt-5" >Sign in - pick - method</h2>
          <TabsList className="grid grid-cols-2 w-[50%] mx-auto">
            <TabsTrigger value="wallet" className="dark:data-[state=active]:bg-[#2c2c2c]">Wallet</TabsTrigger>
            <TabsTrigger value="token" className="dark:data-[state=active]:bg-[#2c2c2c]">WC Token</TabsTrigger>
          </TabsList>
        <TabsContent value="wallet">
        {/* ALert Error */}
        {error && 
        <div className="bg-red-700 text-white p-2 rounded flex justify-between">
        <span className='mt-2 flex flex-col' >
        <span className='w-full'>{error}</span>
        {!hasSigner ? <Button onClick={handleCreateSigner} variant={'outline'} className="lr-auto mt-3 mb-1">Create Warpcast signer(TX)</Button> : null}
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
        
        {/* Sign in */}
        <div className="flex items-start space-x-4 pt-4 flex-col">
            <ul className="mb-4 ml-4">
            <li className='mb-2 flex'><CheckMark disabled={true} isChecked={true} className='mt-1 mr-3' id="cm-1" />You must use an address that owns a FID(Also known as custody address.)</li>
            <li className='mb-2 flex'><CheckMark disabled={true} isChecked={true} className='mt-1 mr-3' id="cm-3" />If you do not have that address you need to import it in your EVM wallet of choice.</li>
            <li className='mb-2 flex'><CheckMark disabled={true} isChecked={true} className='mt-1 mr-3' id="cm-4" />Should work with any EVM wallet if, you want to also be able to use sign in with farcaster on desktop
                websites you might want to try Clear Wallet.
            </li>
            </ul>
            <ConnectButton onClick={handleSignIn} loading={loading} className="w-full" containerClassName="flex mt-2 self-center"/>
        </div>
        </TabsContent>
        <TabsContent value="token">
        {/* ALert Error */}
        {error && 
        <div className="bg-red-700 text-white p-2 rounded flex justify-between">
        <span className='mt-2 flex flex-col' >
        <span className='w-full'>{error}</span>
        {!hasSigner ? <Button onClick={handleCreateSigner} variant={'outline'} className="lr-auto mt-3 mb-1">Create Warpcast signer(TX)</Button> : null}
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

        <div className="flex items-start space-x-4 pt-4 flex-col">
                <h2 className="flex text-[0.9rem] opacity-80 uppercase items-center justify-center mb-2 -mt-2 mx-auto" >Input Your warpcast token</h2>
            <ul className="mb-4 ml-4">
            <li className='mb-2 flex'><CheckMark disabled={true} isChecked={true} className='mt-1 mr-3' id="cm-1" />Token can be extracted from warpcast.com, it is in indexdb that`s available in browser Application from the developer tools.</li>
            <li className='mb-2 flex'><CheckMark disabled={true} isChecked={true} className='mt-1 mr-3' id="cm-1" /><div>There`s also a hidden link<a href="https://warpcast.com/~/debug/admin-token"
            className="text-blue-500 mx-2" target="_blank" rel="noreferrer"
            >https://warpcast.com/~/debug/admin-token</a> that you can use to get the token.(Might not be available in the future)</div></li>
            </ul>
            <SimpleInput 
            inputData={inutText} 
            setInputData={setInputText} 
            placeholder="WC Auth Token..." 
            className="mb-4 w-full dark:text-blue-600 text-gray-900"
            containerClass='w-full'
            inputClass='w-[98%] mx-auto'
            />

             <Button disabled={loading} variant={'outline'} style={{ margin: 'auto'}} 
             className="border-blue-400  flex p-2 rounded dark:bg-neutral-800/20 bg-purple-400-800/10" onClick={handleAuthTokenSignIn}>
                {loading ? <span className='flex p-4 items-center'><Loader /> <span className='ml-2'>Checking... </span></span>: 'Sign in with token'}</Button>
            </div>
            </TabsContent>
            </Tabs>
        {/* Sign up */}
        </TabsContent>
        <TabsContent value="signUp">
        {/* ALert Error */}
        {error && 
        <div className="bg-red-700 text-white p-2 rounded flex justify-between">
        <span className='mt-2 flex flex-col' >
        <span className='w-full'>{error}</span>
        {!hasSigner ? <Button onClick={handleCreateSigner} variant={'outline'} className="lr-auto mt-3 mb-1">Create Warpcast signer(TX)</Button> : null}
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
      
        <div className="flex items-start space-x-4 pt-4 flex-col">
            <h2 className="flex text-[0.9rem] opacity-80 uppercase items-center justify-center mb-2 -mt-2 mx-auto" >Sign up - steps</h2>
            <p className='text-[0.87rem] mb-2'>Multiple signatures and transactions are required to sign up, farcaster account cost on-chain is around ~2$, including storage on Optimism, and signer key.</p>
            <p className='text-[0.87rem] mb-4'>You can safely retry if anything failed signup will skip completed/unecessary steps.</p>

            <SimpleInput 
            inputData={inputFname} 
            setInputData={setInputFname} 
            placeholder="Fname...(optional)" 
            className="mb-4 w-full dark:text-blue-600 text-gray-900"
            containerClass='w-full'
            inputClass='w-[98%] mx-auto'
            />
            
            <ul>
            <li className='mb-2 flex'><CheckBox disabled={true} isChecked={signupStepsChecked.step1} className='mt-1 mr-3'/>
            Check Address does not own a FID
            </li>
            <li className='mb-2 flex'><CheckBox disabled={true} isChecked={signupStepsChecked.step2} className='mt-1 mr-3'/>
                Check Fname is available
            </li>
            <li className='mb-2 flex'><CheckBox disabled={true} isChecked={signupStepsChecked.step3} className='mt-1 mr-3' />
                Generateing random signer key
            </li>
            <li className='mb-2 flex'><CheckBox disabled={true} isChecked={signupStepsChecked.step4} className='mt-1 mr-3' />
                Confirming transaction for new FID with storage on Optimism(implies onchain account costs ~2$)
            </li>
            <li className='mb-2 flex'><CheckBox disabled={true} isChecked={signupStepsChecked.step5} className='mt-1 mr-3' />
               Waiting <b>&nbsp;{seconds}&nbsp;</b> seconds for FID transaction to be propagated
            </li>
            <li className='mb-2 flex'><CheckBox disabled={true} isChecked={signupStepsChecked.step6} className='mt-1 mr-3' />
                Confirming transaction for Warpcast signer key(implies very low cost ~0.01$)
            </li>
            <li className='mb-2 flex'><CheckBox disabled={true} isChecked={signupStepsChecked.step7} className='mt-1 mr-3'  />
               Optional: Registering fname (requires additional signature from fid owner, skipped if fname was blank)
            </li>
            </ul>
            <ConnectButton onClick={handleSignUp} loading={loading} className="w-full" containerClassName="flex mt-2 self-center"/>
            </div>
            </TabsContent>
            </Tabs>


      </Modal>
    </>
  )
}