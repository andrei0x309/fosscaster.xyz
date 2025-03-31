import { ethers } from 'ethers'
import { FARCASTER_PARTIAL_KEY_ABI } from '~/lib/ABIs/fc-identity'
import { FC_IDENTITY_CONTRACT } from '~/lib/constants'
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'
import { onboarding } from './api'
import { createWarpMessage, getCusAuth } from './wc-auth'
import { wait } from './misc'


const projectId = '429ee43bc6c9131be0de66427d64a9e6'
export const BASE_CHAIN_ID = 8453
export const OPTIMISM_CHAIN_ID = 10

const base = {
  chainId: BASE_CHAIN_ID,
  name: 'Base',
  currency: 'ETH',
  explorerUrl: 'https://basescan.org',
  rpcUrl: 'https://base.publicnode.com'
}

const optimism = {
  chainId: OPTIMISM_CHAIN_ID,
  name: 'Optimism',
  currency: 'ETH',
  explorerUrl: 'https://optimistic.etherscan.io',
  rpcUrl: 'https://mainnet.optimism.io'
}

const metadata = {
  name: 'Open FC Clone',
  description: 'FOSS clone farcaster client',
  url: 'https://fc-app.pages.dev',
  icons: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADRUlEQVR4Ae2aT2rcMBTGcwHLzqyzLl2GQpel2xSy7ipXmGyzy2bWgTlAzpED5ADZlvGUQilD6aYMpZQymymf8DfIsiVbwu5YGg2YB5ased/vPf1FZ2fplwgkAolAIuBOYJVlr9d5/nGd53elEMsjPXPpw2x24a7A84syy64PYvN8X07hYQCy7NpTVvdniHhZFAspfgqi23yoQKyEeNutyKHGuijeT1q4DkOIJXx2kGiuGpx4whgCAlIpqMhTPK0QS3Rdc3g7SoIWTwhFseiQ2V58GO3ZUKgWA6PP7BBF9Bk0IZbtYTa8Xc9mF7EBcBoLsLqaxAKHERzAQpMh3s3XpRDzCAHcNZUa3kSV/swel3HABcCPx8f9brdzfr4/PHTuI1Dnd1nW2sb/fb683P98epLv+7QjszkkABD46+WlJtwE+egAQPfb7a3R2S9XVzLSeqbYHN8+P9fa+7vd7tFO2//Y2qmNY2NlwNAAIEiPNoBQDGCo5dEB+LPZ1ARCLPo7AejlUQH4enPTEH9SAPRxgql+MhnAqY3CaaMAwD5ss6ap72QA6ANcWwbYAFrLjjkNqsJsTqr1KB5WzQDb99ayEADoczwhBA2AImhtUWId3SYAykLIBtBalrqAw7GYy3YY1Ns2KUxjbGLUwc0WJbUev4cNugskANV22BZ5lvVZCKEuoDJDgtkMUaTNItUpTLV6F1A3TVEB6LMZAkB1zIkKgBpZWwaooDb394ezAlt2YWA3nAE3Xw89C1gd46ltZdtWg3oXUI/McH7Yq/1QAKjRZRaoR2IQzPc4Me4lHnBDAQCB+noAWcFIqzNF7/4/JoC2iDFCtE6OVtOcDoFt0erdojMTxsqAMQBQDNrWxwRkgCtQ2d5YAOjs5G0CMOI0OPnouw6C8vZnNS8HIa6Pr0LMmysew5uTvyAhb4XiclEfsiHUwZ1B1/vErsvhScNymQHYK1ZCfIgCgu81OYCQl6NDSHGbjz7RZxZ8yrJXQWcB+n6ev6EeLxvyZenV+fk7L9H6R8FBwCXpocQTBlJJdocpT4/wrSgW6Lr0e3B7mB2mBAK+4PG5FO1LCAsLuWLErVI68J8tluzwYdSI+wJK3yUCiUAiEAKBf9CeceNePF3EAAAAAElFTkSuQmCC']
}

const ethersConfig = defaultConfig({
  metadata,
  auth: {
    email: false,
    socials: [],
    showWallets: true,
    walletFeatures: true,
  },
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
  coinbasePreference: "eoaOnly",
  rpcUrl: base.rpcUrl,
  defaultChainId: 8453 
})

export const modal = createWeb3Modal({
  ethersConfig,
  chains: [base, optimism],
  projectId,
  enableAnalytics: true 
})


export const getFidFromAddress = async (address: string) => {
  const provider = new ethers.JsonRpcProvider(optimism.rpcUrl)
  const contract = new ethers.Contract(FC_IDENTITY_CONTRACT, FARCASTER_PARTIAL_KEY_ABI, provider)
  const FID = await contract.idOf(address)
  if (FID > 0) {
    return FID
  }
  return 0
}

export const getEthersProvider = (provider: any) => {
  const ethersProvider = new ethers.BrowserProvider(provider)
  return ethersProvider
}

export const signMsg = async (provider: ethers.BrowserProvider, msg:string) => {
  try {
    const signer = await provider.getSigner()
    return await signer.signMessage(msg)
  } catch (e) {
    return null
  }
}

export const checkAndSwitchChain = async (provider: ethers.BrowserProvider, chainId: number) => {
  try {
    const network = await provider.getNetwork()
    if (network.chainId === BigInt(chainId)) {
      return true
    }
    const switchOp = await provider.send('wallet_switchEthereumChain', [{ chainId: '0xa' }])
    if (switchOp) {
      return true
    }
    return false
  } catch (e) {
    return null
  }
}

export const checkCurrentChain = async (provider: ethers.BrowserProvider, chainId: number) => {
  try {
    await wait(200)
    const network = await provider.send('eth_chainId', [])
    if (Number(network) === chainId) {
      return true
    }
    return false
  } catch (e) {
    console.error('error checking chain', e)
    return null
  }
}


export const doOnboarding = async (provider: ethers.BrowserProvider) => {
  try {
      const timestamp = Date.now()
      const payload = createWarpMessage(timestamp)
      const sig = await signMsg(provider, payload.message)

      if (!sig) {
          return { success: false, data: 'error' }
      }

      const cusAuth = getCusAuth(sig);

       await onboarding(cusAuth, timestamp)


 
      return { success: false, data: '1' }
  } catch (error) {
      console.error('Failed to generate api token', error)
      return { success: false, data: 'error'}
  }
}