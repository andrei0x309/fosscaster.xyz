import { wc } from './client';
import { getTrendingChannels as thirdPartyGetTrendingChannels } from './third-party';

export const getFeed = async ({
    feed,
    excludeItemIdPrefixes,
    olderThan
}: {
    feed?: string;
    excludeItemIdPrefixes?: string[];
    olderThan?: number;
}) => {
    return await wc.getFeedItems({ feedKey: feed ?? 'trending', excludeItemIdPrefixes:  excludeItemIdPrefixes ? excludeItemIdPrefixes : undefined, olderThan });
}

export const getUserByUsername = async (username: string) => {
    if (!username) {
        return null
    }
    return await wc.userByUsername(username)
}

export const isTokenSet = () => {
    return wc.isTokenSet()
}

export const sendCast = async ({ text, castDistribution, embeds} : {text: string, castDistribution?: string, embeds?: Array<Record<any, any>>}) => {
    return await wc.sendCast({ text, castDistribution, embeds})
}

export const deleteCast = async (hash: string) => {
    return await wc.deleteCast(hash)
}

export const getProfileCasts = async ({fid, limit = 15, cursor}: {fid: number, limit?: number, cursor?: string}) => {
    return await wc.getProfileCasts({fid, limit, cursor})
}

export const getAllFidCasts = async ({fid, limit = 15, cursor}: {fid: number, limit?: number, cursor?: string}) => {
    return await wc.getAllFidCasts({fid, limit, cursor})
}

export const getAllFidLikeCasts = async ({fid, limit = 15, cursor}: {fid: number, limit?: number, cursor?: string}) => {
    return await wc.getAllFidLikeCasts({fid, limit, cursor})
}

export const getUserFollowingChannels = async ({fid, limit = 50, cursor, forComposer}: {fid?: number, limit?: number, cursor?: string, forComposer?: boolean}) => {
    return await wc.getUserFollowingChannels({fid, limit, cursor, forComposer})
}

export const getBookmarkedCasts = async ({limit = 15, cursor}: {limit?: number, cursor?: string} = {}) => {
    return await wc.getBookmarkedCasts({limit, cursor})
}

export const getNotifsUnseen = async () => {
    return await wc.getNotifsUnseen()
}

export const getChannelInfo = async (channelId: string) => {
    return await wc.getChannelInfo(channelId)
}

export const likeCast = async (hash: string) => {
    return await wc.likeCast(hash)
}

export const deleteLike = async (hash: string) => {
    return await wc.deleteLike(hash)
}

export const getStorageUtilization = async () => {
    return await wc.getStorageUtilization()
}

export const addToBookmark = async (hash: string) => {
    return await wc.addToBookmark({castHash: hash})
}

export const removeFromBookmark = async (hash: string) => {
    return await wc.removeFromBookmark({castHash: hash})
}

export const getDiscoverChannels = async () => {
    return await wc.getDiscoverChannels()
}

export const getTrendingChannels = async () => {
    return await thirdPartyGetTrendingChannels() 
}

export const getFollowersYouKnow = async ({fid, limit = 3, cursor}: {fid: number, limit?: number, cursor?: string}) => {
    return await wc.getFollowersYouKnow({fid, limit, cursor})
}

export const suggestedUsers = async ({limit = 20, cursor}: {limit?: number, cursor?: string}) => {
    return await wc.suggestedUsers(cursor ?? '', limit, limit)
}

export const putFollowChannel = async (channelKey: string) => {
    return await wc.putFollowChannel({channelKey})
}

export const deleteFollowChannel = async (channelKey: string) => {
    return await wc.deleteFollowChannel({channelKey})
}

export const follow = async (fid: string) => {
    return await wc.follow(fid)
}

export const unfollow = async (fid: string) => {
    return await wc.unfollow(fid)
}

export const onboarding = async (bearerHeader: string, timestamp: number) => {
    return await wc.onboarding(bearerHeader, timestamp)
}

export const warpcastCreateSignedKeyRequest = async (token: string) => {
    const currentAuthTokens = wc.getToken() as string
    try {
        wc.setToken(token)
        const signedRequest = await wc.warpcastCreateSignedKeyRequest()
        wc.setToken(currentAuthTokens)
        return signedRequest
    } catch (error) {
        wc.setToken(currentAuthTokens)
        console.error('Failed to create signed key request', error)
    }
}

export const getChannelFollowersYouKnow = async ({channelKey, limit = 3, cursor}: {channelKey: string, limit?: number, cursor?: string}) => {
    return await wc.getChannelFollowersYouKnow({channelKey, limit, cursor})
}

export const userByFid = async (fid: number | string) => {
    return await wc.userByFid(String(fid))
}

export const completeRegistration = async ({
    timestamp,
    name,
    owner,
    signature,
    fid
}: {
        timestamp: number,
        name: string,
        owner: string,
        signature: string,
        fid: number,
}) => {
    return await wc.completeRegistration({timestamp, name, owner, signature, fid})
}

export const removeAvatar = async () => {
    return await wc.removeAvatar()
}

export const uploadImage = async ({file, doUploadAvatar = false}: {file: File, doUploadAvatar?: boolean}) => {
    return await wc.uploadImage({ file, doUploadAvatar})
}

export const getDirectCastInbox = async ({limit = 15, cursor = '', category = 'default'}: {limit?: number, cursor?: string, category?: "default" | "request" } = {}) => {
    return await wc.getDirectCastInbox({limit, cursor, category})
}

export const getDirectCastUsers = async ({q, limit = 15, cursor, excludeFids = []}: {q: string, limit?: number, cursor?: string, excludeFids?: number[]}) => {
    return await wc.getDirectCastUsers({q, limit, cursor, excludeFids})
}

export const dcCreateGroup = async ({name, members}: {name: string, members: number[]}) => {
    return await wc.dcCreateGroup({name, members})
}

export const dcGroupPhoto = async ({conversationId, photoUrl}: {conversationId: string, photoUrl: string}) => {
    return await wc.dcGroupPhoto({conversationId, photoUrl})
}

export const getUserChannels = async ({fid, limit = 15, cursor}: {fid: number, limit?: number, cursor?: string}) => {
    return await wc.getUserChannels({fid, limit, cursor})
}

export const setProfile = async ({ displayName, bio, location, locationId }: { displayName?: string, bio?: string, location?: string, locationId?: string }) => {
    return await wc.setProfile({ displayName, bio, location, locationId })
}

export const getNotifsByTab = async ({tab, limit = 15, cursor}: {tab: string, limit?: number, cursor?: string}) => {
    return await wc.getNotifsByTab({tab, limit, cursor})
}

export const getCastThread = async ({castHash, limit = 15, username, cursor}: {castHash: string, limit?: number, username: string, cursor?: string}) => {
    return await wc.getCastThread({castHash, limit, cursor, username})
}

export const searchSummary = async ({query}: {query: string}) => {
    return await wc.searchSummary({query})
}

export const searcUsers = async ({query, limit = 15, cursor}: {query: string, limit?: number, cursor?: string}) => {
    return await wc.searcUsers({query, limit, cursor})
}

export const searchCasts = async ({query, limit = 15, cursor}: {query: string, limit?: number, cursor?: string}) => {
    return await wc.searchCasts({query, limit, cursor})
}

export const searchChannels = async ({query, limit = 15, cursor}: {query: string, limit?: number, cursor?: string}) => {
    return await wc.searchChannels({query, limit, cursor})
}

export const getFavoriteFrames = async ({limit = 12, cursor}: {limit?: number, cursor?: string}) => {
    return await wc.getFavoriteFrames({limit, cursor})
}

export const getTopFrames = async ({limit = 50, cursor}: {limit?: number, cursor?: string}) => {
    return await wc.getTopFrames({limit, cursor})
}