export interface TSendCastResult {
    result: Result;
}

export interface Result {
    cast: Cast;
}

export interface Cast {
    hash:                string;
    threadHash:          string;
    author:              Author;
    text:                string;
    timestamp:           number;
    embeds:              Embeds;
    replies:             Reactions;
    reactions:           Reactions;
    recasts:             Recasts;
    watches:             Reactions;
    tags:                any[];
    quoteCount:          number;
    combinedRecastCount: number;
    viewerContext:       CastViewerContext;
}

export interface Author {
    fid:               number;
    username:          string;
    displayName:       string;
    pfp:               Pfp;
    profile:           Profile;
    followerCount:     number;
    followingCount:    number;
    viewerContext:     AuthorViewerContext;
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

export interface AuthorViewerContext {
    following: boolean;
}

export interface Embeds {
    images:   any[];
    urls:     any[];
    videos:   any[];
    unknowns: any[];
}

export interface Reactions {
    count: number;
}

export interface Recasts {
    count:     number;
    recasters: any[];
}

export interface CastViewerContext {
    reacted:    boolean;
    recast:     boolean;
    bookmarked: boolean;
}
