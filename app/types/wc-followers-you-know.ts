export interface TWCFollowersYouKnow {
    result: Result;
    next:   Next;
}

export interface Next {
    cursor: string;
}

export interface Result {
    users:      User[];
    totalCount: number;
}

export interface User {
    fid:               number;
    username:          string;
    displayName:       string;
    pfp:               Pfp;
    profile:           Profile;
    followerCount:     number;
    followingCount:    number;
    viewerContext:     ViewerContext;
}

export interface Pfp {
    url:      string;
    verified: boolean;
}

export interface Profile {
    bio:      Bio;
    location: Location;
}

export interface Bio {
    text:            string;
    mentions:        any[];
    channelMentions: any[];
}

export interface Location {
    placeId:     string;
    description: string;
}

export interface ViewerContext {
    following:  boolean;
    followedBy: boolean;
}
