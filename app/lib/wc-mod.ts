import type {
    T_RESP_SUGGESTED_USERS,
    T_RESP_USER
} from '../types/wc-mod';
import type { TWcFeedItems } from '../types/wc-feed-items';
import type { TWcUserThreadItems } from '../types/wc-user-thread-casts';
import type { TWCUserByUsername } from '../types/wc-user-by-username';
import type { TSendCastResult } from '../types/wc-send-cast-result';
import type { TAllFidCasts } from '../types/wc-all-fid-casts';
import type { TAllFidLikeCasts } from '../types/wc-all-fid-like-casts';
import type { TUserChannelFollows } from '../types/wc-user-channel-follows'
import type { TBookmarkedCasts } from '../types/wc-bookmarked-casts'
import type { TWcProfileCasts } from '../types/wc-profile-casts'
import type { TWCNotifsUnseen } from '../types/wc-notifs-unseen'
import type { TWCChannelInfo } from '../types/wc-channel-info'
import type { TWCStorageUtilization } from '../types/wc-storage-utilization'
import type { TWCDiscoverChannels } from '../types/wc-discover-channels'
import type { TWCFollowersYouKnow } from '../types/wc-followers-you-know'
import type { TWCSignedKeyRequest } from '../types/wc-signed-key-request'
import type { TWCNotifByType } from '../types/wc-notifications-by-tab'
import type { TWCCNFollowersYouKnow } from '../types/wc-channel-followers-you-know'
import type { WCUsernames } from '../types/wc-usernames'

export class WarpCastWebAPI {
    private _version: string;
    private _apiEndpointBase: string;
    private _token: string | undefined;
    private headers = {
        "user-agent": "Desktop",
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "dnt": "1",
        "origin": "https://warpcast.com",
        "referer": "https://warpcast.com",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "sec-gpc": "1",
    } as Record<string, string>;

    constructor(token?: string) {
        this._version = "0.0.2";
        this._apiEndpointBase = "https://client.warpcast.com/v2";
        if (token) {
            this._token = token;
            this.headers["authorization"] = `Bearer ${this._token}`;
        }
    }

    public setToken (token: string) {
        this._token = token;
        this.headers["authorization"] = `Bearer ${this._token}`;
    }

    public isTokenSet () {
        return this._token ? true : false;
    }

    public getToken () {
        return this._token;
    }

    private async hash (string: string) {
        const utf8 = new TextEncoder().encode(string);
        const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
            .map((bytes) => bytes.toString(16).padStart(2, '0'))
            .join('');
        return hashHex;
    }

    public async getMe () {
        const response = await fetch(`${this._apiEndpointBase}/me`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as T_RESP_USER;
    }

    public async getNotifsUnseen () {
        const response = await fetch(`${this._apiEndpointBase}/unseen`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TWCNotifsUnseen;
    }

    public async getChannelInfo (channelId: string) {
        const response = await fetch(`${this._apiEndpointBase}/channel?key=${channelId}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TWCChannelInfo;
    }

    public async getChannelFollowersYouKnow ({ channelKey, limit = 3, cursor }: { channelKey: string, limit: number, cursor?: string }) {
        const response = await fetch(`${this._apiEndpointBase}/channel-followers-you-know?channelKey=${channelKey}&limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TWCCNFollowersYouKnow;
    }

    public async getUsernames () {
        const response = await fetch(`${this._apiEndpointBase}/usernames`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as WCUsernames;
    }

    public async syncChannel ({
        base64PublicKey,
        base64Signature,
        channelId,
        message,
        messageHash,
    }: {
        base64PublicKey: string,
        base64Signature: string,
        channelId: string,
        message?: string,
        messageHash?: string,
    }) {
        const response = await fetch(`${this._apiEndpointBase}/sync-channel`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ base64PublicKey, base64Signature, channelId, message, messageHash })
        });
        return await response.json();
    }

    public async castFrameAction ({
        castHash,
        frameActionIndex,
        framePostUrl,
        frameInputText = undefined
    }: {
        castHash: string,
        frameActionIndex: number,
        framePostUrl: string,
        frameInputText?: string
    }) {
        const response = await fetch(`${this._apiEndpointBase}/cast-frame-action`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ castHash, frameActionIndex, framePostUrl, frameInputText })
        });
        return await response.json();
    }

    public async userByUsername (username: string) {
        try {
        const response = await fetch(`${this._apiEndpointBase}/user-by-username?username=${username}`, {
            method: 'GET',
            headers: this.headers
        });
        if(!response.ok) {
            return null
        }
        return await response.json() as { result: TWCUserByUsername }
        } catch (error) {
            console.error('Failed to get user by username', error)
            return null
        }
    }


    public async userByFid (fid: string) {
        try {
        const response = await fetch(`${this._apiEndpointBase}/user?fid=${fid}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as T_RESP_USER;
     } catch (error) {
        return null
     }
    }

    public async suggestedUsers (cursor = '', perRequest: number = 20, limit: number = 20, randomized: boolean = false) {
        if (!cursor) {
            const buff = Buffer.from(JSON.stringify({ page: 1, limit }))
            cursor = buff.toString('base64')
        }

        const response = await fetch(`${this._apiEndpointBase}/suggested-users?cursor=${cursor}&perRequest=${perRequest}&limit=${limit}&randomized=${randomized}`, {
            method: 'GET',
            headers: this.headers
        });
        const data = await response.json() as T_RESP_SUGGESTED_USERS;
        return data;
    }

    public async follow (targetFid: string) {
        const response = await fetch(`${this._apiEndpointBase}/follows`, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify({ targetFid })
        });
        return await response.json();
    }

    public async unfollow (targetFid: string) {
        const response = await fetch(`${this._apiEndpointBase}/follows`, {
            method: 'DELETE',
            headers: this.headers,
            body: JSON.stringify({ targetFid })
        });
        return await response.json();
    }

    public async followingPages ({
        cursor = '',
        fid,
        limit = 50
    }: {
        cursor: string,
        fid: string,
        limit: number
    }) {

        if (!cursor) {
            const buff = Buffer.from(JSON.stringify({ page: 3, limit, fid }))
            cursor = buff.toString('base64')
        }

        const response = await fetch(`${this._apiEndpointBase}/following?cursor=${cursor}&fid=${fid}&limit=${limit}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as T_RESP_SUGGESTED_USERS
    }

    public async addCastToTrendingFeed ({ castHash }: { castHash: string }) {

        const response = await fetch(`${this._apiEndpointBase}/add-cast-to-trending-feed`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
                castHash
            })
        });
        return await response.json();

    }

    public async getFeedItems ({
        feedKey = 'trending',
        excludeItemIdPrefixes = [],
        feedType = 'default',
        olderThan
    }: {
        feedKey?: string,
        excludeItemIdPrefixes?: string[]
        olderThan?: number,
        feedType?: string
    }) {

        const data = {
            feedKey,
            updateState: false,
            castViewEvents: [],
            feedType
        } as Record<string, any>
        if (olderThan) {
            data['olderThan'] = olderThan
        }
        if (excludeItemIdPrefixes.length > 0) {
            data['excludeItemIdPrefixes'] = excludeItemIdPrefixes.map((hash) => hash.slice(2,).slice(0, 8))
        }


        const response = await fetch(`${this._apiEndpointBase}/feed-items`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(data)
        });
        return await response.json() as { result: TWcFeedItems }
    }

    public async getProfileCasts ({
        fid,
        limit = 15,
        cursor = ''
    }: {
        fid: number,
        limit: number,
        cursor?: string
    }) {
        const response = await fetch(`${this._apiEndpointBase}/profile-casts?fid=${fid}&limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TWcProfileCasts
    }

    public async getAllFidCasts ({
        fid,
        limit = 15,
        cursor = ''
    }: {
        fid: number,
        limit: number,
        cursor?: string
    }) {
        const response = await fetch(`${this._apiEndpointBase}/casts?fid=${fid}&limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TAllFidCasts
    }

    public async getAllFidLikeCasts ({
        fid,
        limit = 15,
        cursor = ''
    }: {
        fid: number,
        limit: number,
        cursor?: string
    }) {
        const response = await fetch(`${this._apiEndpointBase}/user-liked-casts?fid=${fid}&limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TAllFidLikeCasts
    }

    public async getUserFollowingChannels ({
        fid,
        limit = 15,
        cursor = ''
    }: {
        fid: number,
        limit: number,
        cursor?: string
    }) {
        const response = await fetch(`${this._apiEndpointBase}/user-following-channels?fid=${fid}&limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TUserChannelFollows
    }

    public async getUserChannels ({
        limit = 30,
        cursor = '',
        fid,
        category = 'follow'
    }: {
        limit: number,
        cursor?: string,
        fid: number,
        category?: 'follow' | 'all'
    }) {
        const response = await fetch(`${this._apiEndpointBase}/user-channels?fid=${fid}&category=${category}&limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TUserChannelFollows
    }

    public async sendCast ({
        text,
        castDistribution = "default",
        embeds = [],
    }: {
        text: string,
        castDistribution?: string,
        embeds?: Array<Record<string, any>>,
    }) {
        const response = await fetch(`${this._apiEndpointBase}/casts`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ text, embeds, castDistribution })
        });
        return await response.json() as TSendCastResult;
    }

    public async deleteCast (castHash: string) {
        const response = await fetch(`${this._apiEndpointBase}/casts`, {
            method: 'DELETE',
            headers: this.headers,
            body: JSON.stringify({ castHash })
        });
        return await response.json();
    }

    public async deleteLike (castHash: string) {
        const response = await fetch(`${this._apiEndpointBase}/cast-likes`, {
            method: 'DELETE',
            headers: this.headers,
            body: JSON.stringify({ castHash })
        });
        return await response.json();
    }

    public async likeCast (castHash: string) {
        const response = await fetch(`${this._apiEndpointBase}/cast-likes`, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify({ castHash })
        });
        return await response.json();
    }

    public async removeLimitVisibility () {
        const response = await fetch(`${this._apiEndpointBase}/limit-visibility`, {
            method: 'DELETE',
            headers: this.headers,
            body: JSON.stringify({
                targetFid: 133
            })
        });
        return await response.json();
    }

    public async addRemoveLimitVisibility () {
        const response = await fetch(`${this._apiEndpointBase}/limit-visibility`, {
            method: 'POST',
            headers: this.headers
        });
        return await response.json();
    }

    public async getAdminFeed () {
        const response = await fetch(`${this._apiEndpointBase}/admin-feed`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json();
    }

    public async getMostActiveChannels () {
        const response = await fetch(`${this._apiEndpointBase}/most-active-channels?fid=133`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json();
    }

    public async boostCast () {
        // probably to pin casts in channels
        const response = await fetch(`${this._apiEndpointBase}/boost-cast`, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify({
                castHash: ''
            })
        });
        return await response.json();
    }

    public async completeRegistration ({
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
    }) {
        const response = await fetch(`${this._apiEndpointBase}/complete-registration`, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify({
                fnameProof: {
                    "timestamp": timestamp,
                    "name": name,
                    "owner": owner,
                    "signature": signature,
                    "fid": fid,
                    "type": "USERNAME_TYPE_FNAME"
                }
            })
        });
        return await response.json();
    }

    public async registerFid () {
        const response = await fetch(`${this._apiEndpointBase}/register-fid`, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify({
                registerSignature: '',
                signerSignature: '',
                deadline: 1708793737,
            })
        });
        return await response.json();
    }

    public async searchUsers ({
        q,
        excludeSelf = true,
        limit = 40,
        passAuth = true
    }: {
        q: string,
        excludeSelf?: boolean,
        limit?: number
        passAuth?: boolean
    }) {
        const headers = { ...this.headers }
        if (!passAuth) {
            delete headers['authorization']
        }
        const response = await fetch(`${this._apiEndpointBase}/search-users?q=${q}&excludeSelf=${excludeSelf}&limit=${limit}`, {
            method: 'GET',
            headers
        });
        return await response.json();
    }

    public async getBookmarkedCasts ({
        cursor = '',
        limit = 10
    }: {
        cursor?: string,
        limit?: number
    }) {
        const response = await fetch(`${this._apiEndpointBase}/bookmarked-casts?limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TBookmarkedCasts
    }

    public async addToBookmark ({
        castHash
    }: {
        castHash: string
    }) {
        const response = await fetch(`${this._apiEndpointBase}/bookmarked-casts
`, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify({ castHash })
        });
        return await response.json() as { "result": { "success": boolean } }
    }

    public async removeFromBookmark ({
        castHash
    }: {
        castHash: string
    }) {
        const response = await fetch(`${this._apiEndpointBase}/bookmarked-casts`, {
            method: 'DELETE',
            headers: this.headers,
            body: JSON.stringify({ castHash })
        });
        return await response.json() as { "result": { "success": boolean } }
    }

    public async getUserThreadCasts ({ castHashPrefix, cursor = '', limit = 20, username }: {
        castHashPrefix: string,
        username: string,
        cursor?: string,
        limit?: number
    }) {
        const response = await fetch(`${this._apiEndpointBase}/direct-cast-thread?castHashPrefix=${castHashPrefix}&username=${username}${cursor ? `&cursor=${cursor}` : ''}&limit=${limit}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TWcUserThreadItems
    }



    public async sendPushNotification () {
        const response = await fetch(`${this._apiEndpointBase}/send-push-notification`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({})
        });
        return await response.json();
    }

    public async getDirectCastInbox ({ cursor = '', limit = 20 }: {
        cursor?: string,
        limit?: number
    }) {
        const response = await fetch(`${this._apiEndpointBase}/direct-cast-inbox?limit=${limit}&category=default${cursor ? `&cursor=${cursor}` : ''}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TWcUserThreadItems
    }

    public async sendDirectCast ({ receiverFID, senderFID, type, message }: {
        receiverFID: number,
        senderFID: number,
        type: string,
        message: string
    }) {
        // hash
        const conversationId = `${receiverFID}-${senderFID}`
        const messageId = await this.hash(`${conversationId}-${Date.now()}`)

        const data = {
            conversationId,
            recipientFids: [receiverFID],
            messageId,
            type,
            message
        }
        const response = await fetch(`${this._apiEndpointBase}/direct-cast-send`, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(data)
        });
        return await response.json();
    }

    public async warpcastCreateSignedKeyRequest () {
        const response = await fetch(`${this._apiEndpointBase}/warpcast-signed-key-request`, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify({})
        });
        return await response.json() as TWCSignedKeyRequest;
    }

    public async getStorageUtilization () {
        const response = await fetch(`${this._apiEndpointBase}/storage-utilization`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TWCStorageUtilization;
    }

    public async getDiscoverChannels () {
        const response = await fetch(`${this._apiEndpointBase}/discover-channels`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TWCDiscoverChannels;
    }

    public async getFollowersYouKnow ({ fid, limit = 3, cursor = '' }: { fid: number, limit?: number, cursor?: string }) {
        const response = await fetch(`${this._apiEndpointBase}/followers-you-know?fid=${fid}&limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TWCFollowersYouKnow;
    }

    public async putFollowChannel ({ channelKey }: { channelKey: string }) {
        const response = await fetch(`${this._apiEndpointBase}/feed-follows`, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify({ feedKey: channelKey })
        });
        return await response.json() as { result: { success: boolean } }
    }

    public async deleteFollowChannel ({ channelKey }: { channelKey: string }) {
        const response = await fetch(`${this._apiEndpointBase}/feed-follows`, {
            method: 'DELETE',
            headers: this.headers,
            body: JSON.stringify({ feedKey: channelKey })
        });
        return await response.json() as { result: { success: boolean } }
    }

    public async onboarding (bearerHeader: string, timestamp: number) {
        const headers = { ...this.headers, "Authorization": `Bearer ${bearerHeader}` }
        const response = await fetch(`${this._apiEndpointBase}/onboarding`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({
                email: 'test3@flashsoft.eu',
                authRequest: {
                    method: 'generateToken',
                    params: {
                        timestamp,
                    }
                }
            })
        });
        return await response.json();
    }

    public async getFname ({ fname }: { fname: string }) {
        const response = await fetch(`${this._apiEndpointBase}/fname?fname=${fname}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json();
    }

    public async getNotifsByTab ({ tab = 'priority', cursor = '', limit = 15 }: { tab?: string, cursor?: string, limit?: number }) {
        const response = await fetch(`${this._apiEndpointBase.replace('/v2', '/v1')}/notifications-for-tab?tab=${tab}&limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TWCNotifByType;
    }

    public async removeAvatar () {
        const now = Date.now()
        const defaultWCAvatar =  'https://warpcast.com/avatar.png?t=' + now
        const response = await fetch(`${this._apiEndpointBase}/me`, {
            method: 'PATCH',
            headers: this.headers,
            body: JSON.stringify({
                pfp: defaultWCAvatar
            })
        });
        if (response.ok) {
            return defaultWCAvatar
        }
        return null
    }

    get version () {
        return this._version;
    }

    public async uploadAvatar (file: File) {
        try {
        const getUploadData = await fetch(`${this._apiEndpointBase.replace('/v2', '/v1')}/generate-image-upload-url`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({})
        });

        if(!getUploadData.ok) {
            return null
        }

        const data = await getUploadData.json()
        const { url, optimisticImageId } = data.result
        const avatarUrl = `https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/${optimisticImageId}/original`

        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "authorization": `Bearer ${this._token}`,
            },
            body: formData
        });
        
        if(!response.ok) {
            return null
        }

        const updateAvatar = await fetch(`${this._apiEndpointBase}/me`, {
            method: 'PATCH',
            headers: this.headers,
            body: JSON.stringify({
                pfp: avatarUrl
            })
        });

        if(!updateAvatar.ok) {
            return null
        }

        return avatarUrl
    } catch (error) {
            console.error('Failed to upload avatar', error)
            return null
        }
    }

    public async setProfile ({ displayName, bio, location, locationId }: { displayName?: string, bio?: string, location?: string, locationId?: string }) {
        try {
        if (!displayName && !bio && !location && !locationId) {
            return null
        }

        const data = {} as Record<string, any>
        if (displayName) {
            data['displayName'] = displayName
        }
        if (bio) {
            data['bio'] = bio
        }
        if (location) {
            data['location'] = location
        }
        if (locationId) {
            data['locationId'] = locationId
        }

        const response = await fetch(`${this._apiEndpointBase}/me`, {
            method: 'PATCH',
            headers: this.headers,
            body: JSON.stringify(data)
        });

        return response.ok
    } 
    catch (error) {
        console.error('Failed to set profile', error)
        return false
    }
    }

    // https://client.warpcast.com/v2/user-thread-casts?castHashPrefix=0xa2226213&username=dwr.eth&limit=15

    getCastThread = async ({
        castHash,
        limit = 15,
        cursor = ''
    }: {
        castHash: string,
        limit: number,
        cursor?: string
    }) => {
        const response = await fetch(`${this._apiEndpointBase}/user-thread-casts?castHashPrefix=${castHash}&limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TWcUserThreadItems
    }

}