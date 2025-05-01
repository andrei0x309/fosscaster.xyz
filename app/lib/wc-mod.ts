import { WARPCAST_API_BASE, WARPCAST_API_DEV_TUNNEL } from '~/lib/constants';
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
import type { TWCSearchSummary } from '../types/wc-search-summary'
import type { TWCSearchUsers } from '../types/wc-search-users'
import type { TWCSearchCasts } from '../types/wc-search-casts'
import type { TWCSearchChannels } from '../types/wc-search-channels'
import type { TWCDcUsers } from '../types/wc-dc-users'
import type { TWCDcInbox } from '../types/wc-dc-inbox'
import type { TWCFavoriteFrames } from '../types/wc-favorite-frames'
import type { TWCTopFrames } from '../types/wc-top-frames'
import type { TWCFrame } from '../types/wc-frame'
import type { TWCDCMessages } from '../types/wc-dc-messages'
import type { TWCUserAppContext  } from '../types/wc-user-app-context'


const isDevTun = typeof window !== 'undefined' && window.location.hostname === 'tun-5173.flashsoft.eu'
const WARPCAST_API = isDevTun ? WARPCAST_API_DEV_TUNNEL : WARPCAST_API_BASE


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
        this._apiEndpointBase = WARPCAST_API;
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

    public async markNotifsSeen () {
        // mark-all-notifications-read
        const response = await fetch(`${this._apiEndpointBase}/mark-all-notifications-read`, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify({})
        });
        return await response.json();
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

    public async getUserAppContext () {
        const response = await fetch(`${this._apiEndpointBase}/user-app-context`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as {result: TWCUserAppContext};
    }

    public async userByFid (fid: string | number) {
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

    public async recast (castHash: string) {
        const response = await fetch(`${this._apiEndpointBase}/recasts`, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify({ castHash })
        });
        return await response.json() as {
            "result": {
                "castHash": string
            }
        }
    }

    public async undoRecast  (castHash: string) {
        const response = await fetch(`${this._apiEndpointBase}/undo-recast`, {
            method: 'DELETE',
            headers: this.headers,
            body: JSON.stringify({ castHash })
        });
        return await response.json() as {
            "result": {
                "castHash": string
            }
        }
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
        fid = 0,
        limit = 50,
        cursor = '',
        forComposer = true
    }: {
        fid?: number,
        limit?: number,
        cursor?: string,
        forComposer?: boolean
    }) {
        const response = await fetch(`${this._apiEndpointBase}/user-following-channels?limit=${limit}&forComposer=${forComposer}${fid === 0 ? '': '&fid=' + fid }${cursor ? `&cursor=${cursor}` : ''}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TWCSearchChannels
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
        return await response.json() as TWCSearchChannels
    }

    public async channelRespondToInvite ({
        accept,
        channelKey,
        role,
    }: {
        accept: boolean,
        channelKey: string,
        role: string
    }) {
        const response = await fetch(`${this._apiEndpointBase.replace('/v2', '/v1')}/manage-channel-users`, {
            method: 'PATCH',
            headers: this.headers,
            body: JSON.stringify({
                accept,
                channelKey,
                role
            })
        });
        return await response.json() as  {
            "result": {
                "success": true
            }
        }
    }

    // try to use this to get DC marked as read, super privacy infringing to get all this data when you just open a DM
    // I coud not find a DM mark as read endpoint they might use this analtics to mark as read
    public async dcSendOpenEvent ({
        conversationId,
        userFid
    }: {
        conversationId: string,
        userFid: number
    }) {

        const data = {
            "api_key": "7dd7b12861158f5e89ab5508bd9ce4c0",
            "events": [
              {
                "user_id": String(userFid),
                "device_id": self?.crypto?.randomUUID(),
                "session_id": Date.now(),
                "time": Date.now(),
                "app_version": "1.0.102",
                "platform": "Android",
                "os_name": "android",
                "os_version": "13",
                "device_manufacturer": "Google",
                "device_model": "sdk_arm64",
                "language": "en",
                "country": "US",
                "carrier": "",
                "ip": "$remote",
                "adid": null,
                "android_app_set_id": null,
                "insert_id": self?.crypto?.randomUUID(),
                "event_type": "view direct cast conversation",
                "event_properties": {
                  "conversationId": conversationId,
                  "conversationCategory": "default",
                  "is_token_gated": false,
                  "location": "PlaintextDirectCasts/PlaintextDirectCastsConversation",
                  "warpcastPlatform": "mobile"
                },
                "event_id": Math.trunc(Math.random() * 10^4),
                "library": "amplitude-react-native-ts/1.4.4"
              }
            ],
            "options": {
              "min_id_length": 1
            }
          }

        const response = await fetch(`${this._apiEndpointBase}/amp/api2/2/httpapi`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(data)
        });
        return await response.json() as {
            "result": {
                "success": true
            }
        }
    }
    

    public async dcGroupInvite ({
        conversationId
    }: {
        conversationId: string,
    }) {
        /// https://client.warpcast.com/v2/direct-cast-group-invite
        const response = await fetch(`${this._apiEndpointBase}/direct-cast-group-invite`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
                conversationId
            })
        });
        return await response.json() as {
            "result": {
                "inviteCode": string,
            }
        }
    }

    public async dcDoCategorization ({category, conversationId}: {category: "deleted", conversationId: string}) {
        // https://client.warpcast.com/v2/direct-cast-conversation-categorization
        const response = await fetch(`${this._apiEndpointBase}/direct-cast-conversation-categorization`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
                category,
                conversationId
            })
        });
        return await response.json() as {
            "result": {
                "success": boolean,
            }
        }
    }

    public async dcGetMessages ({
        conversationId,
        limit = 50,
        cursor = '',
        messageId = ''
    }: {
        conversationId: string,
        limit?: number,
        cursor?: string
        messageId?: string
    }){
        //https://client.warpcast.com/v2/direct-cast-conversation-messages?conversationId=5fd1eacfb158db15c718a20d174d16674f662c195773c2ccfa78da9957f06918&messageId=27a93da4c6eb4e53321e346cb9383578&limit=50
        const response = await fetch(`${this._apiEndpointBase}/direct-cast-conversation-messages?conversationId=${conversationId}&limit=${limit}${cursor ? `&cursor=${cursor}` : ''}${messageId ? `&messageId=${messageId}` : ''}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TWCDCMessages
    }

    public async dcCreateGroup({
        name,
        // description,
        members
    }: {
        name: string,
        // description: string,
        members: number[]
    }) {
       
        const response = await fetch(`${this._apiEndpointBase}/direct-cast-group`, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify({
                name,
                participantFids: members
            })
        });
        return await response.json() as  {
            "result": {
              "conversationId":  string,
            }
          }
    }

    public async dcGroupPhoto({
        conversationId,
        photoUrl
    }: {
        conversationId: string,
        photoUrl: string
    }) {
        // https://client.warpcast.com/v2/direct-cast-group-photo
        const response = await fetch(`${this._apiEndpointBase}/direct-cast-group-photo`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
                conversationId,
                photoUrl
            })
        });
        return await response.json() as {
            "result": {
                "success": boolean,
            }
        }
    }

    public async dcGroupAction({
        action,
        conversationId,
        targetFid
    }: {
        action: "remove" | "add",
        conversationId: string,
        targetFid: number
    }){
        //https://client.warpcast.com/v2/direct-cast-group-membership
        const response = await fetch(`${this._apiEndpointBase}/direct-cast-group-membership`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
                action,
                conversationId,
                targetFid
            })
        });

        return await response.json() as {
            "result": {
                "success": boolean,
            }
        }

    }

    public async sendCast ({
        text,
        castDistribution = "default",
        embeds = [],
        channelKey = '',
        parentHash = ''
    }: {
        text: string,
        castDistribution?: string,
        embeds?: string[],
        channelKey?: string,
        parentHash?: string
    }) {
        const sendObj = {
            text,
            embeds
        } as Record<string, any>;

        if (castDistribution !== 'default') {
            sendObj.castDistribution = castDistribution;
        }

        if (channelKey) {
            sendObj.channelKey = channelKey;
        }

        if (parentHash) {
            sendObj.parent = {
                hash: parentHash
            }
        }

        const response = await fetch(`${this._apiEndpointBase}/casts`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(sendObj)
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

    public async dcGetConversation( conversationId: string) {
        const response = await fetch(`${this._apiEndpointBase}/direct-cast-conversation?conversationId=${conversationId}`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
                conversationId
            })
        });
        return await response.json() as {
            resut: {
               conversation: TWCDcInbox['result']['conversations'][0]
            }
        }
    }

    public async dcConversationRecentMessages({ conversationId }: {
        conversationId: string,
    }) {
        const response = await fetch(`${this._apiEndpointBase}/direct-cast-conversation-recent-messages?conversationId=${conversationId}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TWCDCMessages
    }

    public async getDirectCastInbox ({ cursor = '', limit = 20, filter = '', category = 'default' }: {
        cursor?: string,
        limit?: number,
        filter?: ''
        category?: 'default' | 'request'
    }) {
        const response = await fetch(`${this._apiEndpointBase}/direct-cast-inbox?limit=${limit}&category=${category}${filter ? `&filter=${filter}` : ''}${cursor ? `&cursor=${cursor}` : ''}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TWCDcInbox
    }

    public async getDirectCastUsers ({ q, cursor = '', limit = 20, excludeFids=[] }: {
        q: string,
        cursor?: string,
        limit?: number
        excludeFids?: number[]
    }) {
        const response = await fetch(`${this._apiEndpointBase}/direct-cast-users?q=${q}&limit=${limit}&vNext=true&excludeFids=${excludeFids?.length ? excludeFids.join(','): '' }${cursor ? `&cursor=${cursor}` : ''}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TWCDcUsers
    }

    public async sendDirectCast ({ conversationId, recieverFid, type = 'text', message }: {
        conversationId: string,
        recieverFid: string,
        type?: string,
        message: string
    }) {
        // hash
        const messageId = await this.hash(`${conversationId}-${Date.now()}`)
        const isGroup = !conversationId?.includes('-')
 
        const data = {
            conversationId,
            recipientFids: isGroup ? [] : [recieverFid],
            messageId,
            type,
            message
        }
        const response = await fetch(`${this._apiEndpointBase}/direct-cast-send`, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(data)
        });
        return await response.json() as {
            "result": {
                "success": boolean
            }
        }
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

    public async getDiscoverChannels ({cursor= '', limit = 15}: {cursor?: string, limit?: number}) {
        const response = await fetch(`${this._apiEndpointBase}/discover-channels?limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`, {
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

    public async uploadImage ({file, doUploadAvatar = false}: { file: File, doUploadAvatar?: boolean }) {
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
        const imageUrl = `https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/${optimisticImageId}/original`

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

        if (doUploadAvatar) {
        const updateAvatar = await fetch(`${this._apiEndpointBase}/me`, {
            method: 'PATCH',
            headers: this.headers,
            body: JSON.stringify({
                pfp: imageUrl
            })
        });

        if(!updateAvatar.ok) {
            return null
        }
    }

        return imageUrl
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

    public getCastThread = async ({
        castHash,
        limit = 15,
        username,
        cursor = ''
    }: {
        castHash: string,
        username: string,
        limit: number,
        cursor?: string
    }) => {
        const response = await fetch(`${this._apiEndpointBase}/user-thread-casts?castHashPrefix=${castHash}&username=${username}&limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TWcUserThreadItems
    }

    public searchSummary = async ({
        query,
        maxChannels = 2,
        maxUsers = 4,
    }: {
        query: string,
        maxChannels?: number,
        maxUsers?: number,
    }) => {
       const response = await fetch(`${this._apiEndpointBase}/search-summary?q=${query}&maxChannels=${maxChannels}&maxUsers=${maxUsers}&addFollowersYouKnowContext=false`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TWCSearchSummary
    }

    public searcUsers = async ({
        query,
        limit = 15,
        cursor = ''
    }: {
        query: string,
        limit?: number,
        cursor?: string
    }) => {
       const response = await fetch(`${this._apiEndpointBase}/search-users?q=${query}&excludeSelf=false&includeDirectCastAbility=false&limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TWCSearchUsers
    }

    public searchCasts = async ({
        query,
        limit = 15,
        cursor = ''
    }: {
        query: string,
        limit?: number,
        cursor?: string
    }) => {
       const response = await fetch(`${this._apiEndpointBase}/search-casts?q=${query}&limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TWCSearchCasts
    }

    public searchChannels = async ({
        query,
        limit = 15,
        cursor = ''
    }: {
        query: string,
        limit?: number,
        cursor?: string
    }) => {
        // https://client.warpcast.com/v2/search-channels?q=ss&prioritizeFollowed=false&forComposer=false&limit=2
       const response = await fetch(`${this._apiEndpointBase}/search-channels?q=${query}&prioritizeFollowed=false&forComposer=false&limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TWCSearchChannels
    }

    public getFavoriteFrames = async ({
        limit = 12,
        cursor = ''
    }: {
        limit?: number,
        cursor?: string
    }) => {
        // /v1/favorite-frames?limit=20
       const response = await fetch(`${this._apiEndpointBase.replace('v2', 'v1')}/favorite-frames?limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TWCFavoriteFrames
    }

    public addMiniAppToFavs = async ({
        domain,
    }: {
        domain: string,
    }) => {
        const response = await fetch(`${this._apiEndpointBase.replace('v2', 'v1')}/favorite-frames`, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify({
                "domain": domain
            })
        })
        return await response.json() as {
            result: {
                success: boolean
            }
        }
    }

    public removeMiniAppFromFavs = async ({
        domain,
    }: {
        domain: string,
    }) => {
        const response = await fetch(`${this._apiEndpointBase.replace('v2', 'v1')}/favorite-frames`, {
            method: 'DELETE',
            headers: this.headers,
            body: JSON.stringify({
                "domain": domain
            })
        })
        return await response.json() as {
            result: {
                success: boolean
            }
        }
    }

    public setMiniAppPosition = async ({
        domain,
        position
    }: {
        domain: string,
        position: number
    }) => {
        const response = await fetch(`${this._apiEndpointBase.replace('v2', 'v1')}/favorite-frames`, {
            method: 'PATCH',
            headers: this.headers,
            body: JSON.stringify({
                "domain": domain,
                "position": position
            })
        })
        return await response.json() as {
            result: {
                success: boolean
            }
        }
    }

    public disableMiniAppNotifications = async ({
        domain,
    }: {
        domain: string,
    }) => {
        const response = await fetch(`${this._apiEndpointBase.replace('v2', 'v1')}/favorite-frames`, {
            method: 'PATCH',
            headers: this.headers,
            body: JSON.stringify({
                "domain": domain,
                "disableNotifications": true
            })
        })
        return await response.json() as {
            result: {
                success: boolean
            }
        }
    }

    public enableMiniAppNotifications = async ({
        domain,
    }: {
        domain: string,
    }) => {
        const response = await fetch(`${this._apiEndpointBase.replace('v2', 'v1')}/frame-notifications`, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify({
                "domain": domain
            })
        })
        return await response.json() as {
            result: {
                success: boolean
            }
        }
    }

    public getFrame = async ({
        domain,
    }: {
        domain: string,
    }) => {
        const response = await fetch(`${this._apiEndpointBase.replace('v2', 'v1')}/frame?domain=${domain}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TWCFrame
    }

    public getTopFrames = async ({
        limit = 50,
        cursor = ''
    }: {
        limit?: number,
        cursor?: string
    }) => {
        // /v1/top-frameapps?limit=20
       const response = await fetch(`${this._apiEndpointBase.replace('v2', 'v1')}/top-frameapps?limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`, {
            method: 'GET',
            headers: this.headers
        });
        return await response.json() as TWCTopFrames
    }

    public prepareVideoUpload = async ({
        videoSizeBytes
    }: {
       videoSizeBytes: number
    }) => {
        
        const data = {
            supportsDynamicUpload: true,
        } as Record<string, any>

        if (videoSizeBytes) {
            data.videoSizeBytes = videoSizeBytes
        }

       const response = await fetch(`${this._apiEndpointBase.replace('v2', 'v1')}/prepare-video-upload`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(data)
        });
        return await response.json() as {
            "result": {
                "videoId":  string,
                "uploadUrl": string,
                "headers": Record<string, any>
                "metadata":  Record<string, any>
            }
        }
    }

    public getVideoUploadState = async ({
        videoId
    }: {
       videoId: string
    }) => {
       
        const response = await fetch(`${this._apiEndpointBase.replace('v2', 'v1')}/uploaded-video?videoId=${videoId}`, {
            method: 'GET',
            headers: this.headers
        });

        return await response.json() as {result: {
            "video": {
                "id": "0196870d-26cc-ca08-03cb-bd941f1fa06c",
                "state": "processing",
                "embed": {
                    "type": "video" | "ready",
                    "url": string,
                    "sourceUrl": string,
                    "width": number,
                    "height": number,
                    "duration": number,
                    "thumbnailUrl": string
                }
            }
        }
      }
    }
}