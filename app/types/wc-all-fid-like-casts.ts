export interface TAllFidLikeCasts {
    result: Result;
    next:   Next;
}

export interface Next {
    cursor: string;
}

export interface Result {
    casts: ResultCast[];
}

export interface ResultCast {
    hash:                string;
    threadHash:          string;
    parentHash?:         string;
    parentAuthor?:       Author;
    author:              Author;
    text:                string;
    timestamp:           number;
    embeds?:             PurpleEmbeds;
    replies:             Reactions;
    reactions:           Reactions;
    recasts:             Recasts;
    watches:             Reactions;
    tags:                Tag[];
    quoteCount:          number;
    combinedRecastCount: number;
    viewerContext:       CastViewerContext;
    parentSource?:       ParentSource;
    viewCount?:          number;
    mentions?:           Author[];
}

export interface Author {
    fid:               number;
    username:          string;
    displayName:       string;
    pfp:               Pfp;
    profile:           Profile;
    followerCount:     number;
    followingCount:    number;
    viewerContext?:    AuthorViewerContext;
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
    mentions:        string[];
    channelMentions: string[];
}

export interface Location {
    placeId:     string;
    description: string;
}

export interface AuthorViewerContext {
    following: boolean;
}

export interface PurpleEmbeds {
    images:            Image[];
    urls:              URL[];
    videos:            any[];
    unknowns:          any[];
    processedCastText: string;
    groupInvites:      any[];
    casts?:            EmbedsCast[];
}

export interface EmbedsCast {
    hash:          string;
    threadHash:    string;
    parentSource?: ParentSource;
    author:        Author;
    text:          string;
    timestamp:     number;
    tags:          Tag[];
    embeds:        FluffyEmbeds;
    parentHash?:   string;
    parentAuthor?: Author;
}

export interface FluffyEmbeds {
    images:       Image[];
    urls:         URL[];
    videos:       any[];
    unknowns:     any[];
    groupInvites: any[];
}

export interface Image {
    type:      string;
    url:       string;
    sourceUrl: string;
    media:     Media;
    alt:       string;
}

export interface Media {
    version:      string;
    width:        number;
    height:       number;
    staticRaster: string;
    source?:      string;
}

export interface URL {
    type:      string;
    openGraph: OpenGraph;
}

export interface OpenGraph {
    url:           string;
    sourceUrl:     string;
    title:         string;
    description:   string;
    domain:        string;
    image:         string;
    useLargeImage: boolean;
}

export interface ParentSource {
    type: string;
    url:  string;
}

export interface Tag {
    type:     Type;
    id:       string;
    name:     string;
    imageUrl: string;
}

export enum Type {
    Channel = "channel",
}

export interface Reactions {
    count: number;
}

export interface Recasts {
    count:     number;
    recasters: Recaster[];
}

export interface Recaster {
    fid:         number;
    username:    string;
    displayName: string;
    recastHash:  string;
}

export interface CastViewerContext {
    reacted:    boolean;
    recast:     boolean;
    bookmarked: boolean;
}
