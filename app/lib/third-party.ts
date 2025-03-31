import type { TThirdPThrendingChannels } from '~/types/3p-thrending-channels'
import type { TFCFnameTransfer } from '~/types/3p/fname-transfer'

export const getTrendingChannels = async () => {
    const response = await fetch(`https://api.yup.io/farcaster/channels/trending`)
    const data = await response.json()
    return data as TThirdPThrendingChannels
}

export const getFnameLastTransfer = async (fname: string) => {
    const response = await fetch(`https://fnames.farcaster.xyz/transfers?name=${fname}`)
    const data = await response.json()
    if (data?.transfers.length === 0) {
        return null
    }
    const lastTransfer = data?.transfers[data?.transfers.length - 1] as TFCFnameTransfer['transfers'][0]
    return lastTransfer
}