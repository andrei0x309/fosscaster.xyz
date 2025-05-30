import { GIT_COMMIT_SHA } from './git-commit'

export const FC_IDENTITY_CONTRACT = '0x00000000fc6c5f01fc30151999387bb99a9f489b'
export const FC_ID_REGISTRY_CONTRACT = '0x00000000Fc25870C6eD6b6c7E41Fb078b7656f69'
export const FC_BUNDLE_CONTRACT = '0x00000000fc04c910a0b5fea33b03e0447ad0b0aa'
export const FC_KEYS_CONTRACT = '0x00000000fc56947c7e7183f8ca4b62398caadf0b'

// Used to get signup price, generate metdata and signer keys and forward to user wallet
export const FC_SERVERLESS_WORKER = 'https://fc-app-wk.t-worker.workers.dev'

// Warpcast API
export const WARPCAST_API_BASE = GIT_COMMIT_SHA ? '/api/v2' : 'https://api.farcaster.xyz/v2'
// Warpcast API dev tunner proxy
export const WARPCAST_API_DEV_TUNNEL = 'https://wc-proxy-34-b2teh3p3fr4v.deno.dev/v2'