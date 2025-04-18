
export type T_USER = {
    "fid": number
    "username": string
    "displayName":  string
    "pfp": {
      "url":  string
      "verified": boolean
    },
    "profile": {
      "bio": {
        "text":  string
        "mentions": any[]
        "channelMentions": any[]
      },
      "location": {
        "placeId": string
        "description": string
      }
    },
    "followerCount": number
    "followingCount":  number
    "viewerContext": {
      "following":  boolean
      "followedBy": boolean
  }
  }
  
  export type T_RESP_USER = {
    "result": {
      "user": T_USER
    }
  }
  
  export type T_RESP_SUGGESTED_USERS = {
    result: {
      users: T_USER[]
    },
    next: {
      cursor: string
    }
  }