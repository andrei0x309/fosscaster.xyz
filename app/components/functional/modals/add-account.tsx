'use client'

import { useState } from 'react'
import { Button } from "~/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs"
import { Modal } from "~/components/functional/modals/modal"
import ConnectButton from "~/components/atomic/connect-button"
import { useMainStore } from '~/store/main'
import { useWeb3ModalAccount, useWeb3Modal, } from '@web3modal/ethers/react'
import { getFidFromAddress, modal, getEthersProvider, signMsg } from '~/lib/wallet'
import { wait } from '~/lib/misc'
import { createWarpMessage, generateApiToken } from '~/lib/wc-auth'
import { wc } from '~/lib/client'
import CheckMark from '~/components/atomic/checkmark'
import { persistUserData, persistAllUsersData } from '~/lib/localstorage'
import { SimpleInput } from '~/components/atomic/simple-input'
import Loader from "~/components/atomic/loader"


export function AddAccountModal ({ isModalOpen, setModalOpen }: { isModalOpen: boolean, setModalOpen: (value: boolean) => void }) {

    const { setUserData, allUsersData, setAllUsersData, setIsUserLoggedIn } = useMainStore()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [inutText, setInputText] = useState('')


    const { address } = useWeb3ModalAccount()
    const { open } = useWeb3Modal()

    const closeError = () => {
        setError('')
    }

    const handleSignIn = async () => {
        try {
            setLoading(true)
            setError('')
            await wait(100)
            if (!address) {
                await open()
                let promiseClose: () => void = () => { }
                new Promise((resolve) => {
                    promiseClose = resolve as () => void
                })
                modal.subscribeState((state) => {
                    if (state.open === false) {
                        promiseClose()
                    }
                })
                await promiseClose()
                if (!address) {
                    setError('No address selected')
                    setLoading(false)
                    return
                }
            }
            const FID = await getFidFromAddress(address)
            if (!(FID > 0)) {
                setError(`Address ${address} does not own a FID`)
                setLoading(false)
                return
            }
            const message = createWarpMessage()
            const provider = getEthersProvider(modal.getWalletProvider())

            const sig = await signMsg(provider, message.message)
            if (!sig) {
                setError('Failed to sign message')
                setLoading(false)
                return
            }
            const result = await generateApiToken(sig, message.payload)
            if (!result.success) {
                setError('Failed to generate token')
                setLoading(false)
                return
            }
            const token = result.data
            const initToken = wc.getToken() as string
            let user: Awaited<ReturnType<typeof wc.getMe>> | null = null
            wc.setToken(token)
            let timeout = 3000
            let pass = false
            do {
                try {
                    timeout -= 300
                    user = await wc.getMe()
                    pass = true
                } catch (error) {
                    await wait(300)
                    console.error('Failed to get user data, retrying', error)
                }
            } while (!pass && timeout > 0)
            if (!user) {
                wc.setToken(initToken)
                setError('Failed to get user data, token is invalid')
                setLoading(false)
                return
            }
            if (!user?.result?.user?.fid) {
                wc.setToken(initToken)
                setError('Failed to get user data, token is invalid')
                setLoading(false)
                return
            }

            if (allUsersData.find((u) => u.fid === user.result.user.fid) !== undefined) {
                wc.setToken(initToken)
                setError('Account already added')
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

            allUsersData.push(userData)
            setAllUsersData(allUsersData)
            persistAllUsersData(allUsersData)


            setUserData(userData)
            persistUserData(userData)
            setIsUserLoggedIn(true)
            setLoading(false)
            setModalOpen(false)
            window.location.reload()
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
            if (!inutText) {
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
            if (!user?.result?.user?.fid) {
                setError('Failed to get user data, token is invalid')
                setLoading(false)
                wc.setToken(initToken)
                return
            }


            if (allUsersData.find((u) => u.fid === user.result.user.fid) !== undefined) {
                setError('Account already added')
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

            allUsersData.push(userData)
            setAllUsersData(allUsersData)
            persistAllUsersData(allUsersData)

            setUserData(userData)
            persistUserData(userData)
            setIsUserLoggedIn(true)
            setLoading(false)
            setModalOpen(false)
            window.location.reload()
        } catch (error) {
            setError('Failed to sign in due to an unexpected error')
            console.error('Failed to sign in', error)
            setLoading(false)
        }
    }



    return (
        <>
            <Modal isOpen={isModalOpen} setIsOpen={setModalOpen} dialogTitleText={'Add account'} preventClose={loading} >
                <Tabs defaultValue="wallet" className="w-full">
                    <h2 className="flex text-[0.9rem] opacity-80 uppercase items-center justify-center mb-2 mt-5" >Add ccount - pick - method</h2>
                    <TabsList className="grid grid-cols-2 w-[50%] mx-auto">
                        <TabsTrigger value="wallet" className="dark:data-[state=active]:bg-[#2c2c2c]">Wallet</TabsTrigger>
                        <TabsTrigger value="token" className="dark:data-[state=active]:bg-[#2c2c2c]">WC Token</TabsTrigger>
                    </TabsList>
                    <TabsContent value="wallet">
                        {/* ALert Error */}
                        {error && <div className="bg-red-700 text-white p-2 rounded flex justify-between"><span className='mt-2' >{error}</span><Button onClick={closeError} className="ml-2 lr-auto">x</Button></div>}

                        {/* Sign in */}
                        <div className="flex items-start space-x-4 pt-4 flex-col">
                            <ul className="mb-4 ml-4">
                                <li className='mb-2 flex'><CheckMark disabled={true} isChecked={true} className='mt-1 mr-3' id="cm-1" />You must use an address that owns a FID(Also known as custody address.)</li>
                                <li className='mb-2 flex'><CheckMark disabled={true} isChecked={true} className='mt-1 mr-3' id="cm-3" />If you do not have that address you need to import it in your EVM wallet of choice.</li>
                                <li className='mb-2 flex'><CheckMark disabled={true} isChecked={true} className='mt-1 mr-3' id="cm-4" />Should work with any EVM wallet if, you want to also be able to use sign in with farcaster on desktop
                                    websites you might want to try Clear Wallet.
                                </li>
                            </ul>
                            <ConnectButton onClick={handleSignIn} loading={loading} className="w-full" containerClassName="flex mt-2 self-center" />
                        </div>
                    </TabsContent>
                    <TabsContent value="token">
                        {error && <div className="bg-red-700 text-white p-2 rounded flex justify-between"><span className='mt-2' >{error}</span><Button onClick={closeError} className="ml-2 lr-auto">x</Button></div>}

                        <div className="flex items-start space-x-4 pt-4 flex-col">
                            <h2 className="flex text-[0.9rem] opacity-80 uppercase items-center justify-center mb-2 -mt-2 mx-auto" >Input Your Farcaster.xyz token</h2>
                            <ul className="mb-4 ml-4">
                                <li className='mb-2 flex'><CheckMark disabled={true} isChecked={true} className='mt-1 mr-3' id="cm-1" />Token can be extracted from farcaster.xyz, it is in indexdb that`s available in browser Application from the developer tools.</li>
                                <li className='mb-2 flex'><CheckMark disabled={true} isChecked={true} className='mt-1 mr-3' id="cm-1" /><div>There`s also a hidden link<a href="https://farcaster.xyz/~/debug/admin-token"
                                    className="text-blue-500 mx-2" target="_blank" rel="noreferrer"
                                >https://farcaster.xyz/~/debug/admin-token</a> that you can use to get the token.(Might not be available in the future)</div></li>
                            </ul>
                            <SimpleInput
                                inputData={inutText}
                                setInputData={setInputText}
                                placeholder="WC Auth Token..."
                                className="mb-4 w-full dark:text-red-600 text-neutral-900"
                                containerClass='w-full'
                                inputClass='w-[98%] mx-auto'
                            />

                            <Button disabled={loading} variant={'outline'} style={{ margin: 'auto' }}
                                className="border-blue-400  flex p-2 rounded dark:bg-neutral-800/20 bg-purple-400-800/10" onClick={handleAuthTokenSignIn}>
                                {loading ? <span className='flex p-4 items-center'><Loader /> <span className='ml-2'>Checking... </span></span> : 'Sign in with token'}</Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </Modal>
        </>
    )
}