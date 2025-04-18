export interface TBookmarkedCasts {
    result: Result;
    next:   Next;
}

export interface Next {
    cursor: string;
}

export interface Result {
    bookmarks: Bookmark[];
}

export interface Bookmark {
    hash:                string;
    threadHash:          string;
    parentSource:        ParentSource;
    author:              Author;
    text:                string;
    timestamp:           number;
    embeds?:             BookmarkEmbeds;
    replies:             Reactions;
    reactions:           Reactions;
    recasts:             Recasts;
    watches:             Reactions;
    tags:                Tag[];
    quoteCount:          number;
    combinedRecastCount: number;
    viewerContext:       BookmarkViewerContext;
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
    channelMentions: ChannelMention[];
}

export enum ChannelMention {
    Blxstonesnctuary = "blxstonesnctuary",
    Degencommunism = "degencommunism",
    Luo = "luo",
    Starfire = "starfire",
}

export interface Location {
    placeId:     string;
    description: string;
}

export interface AuthorViewerContext {
    following: boolean;
}

export interface BookmarkEmbeds {
    images:            any[];
    urls:              URL[];
    videos:            any[];
    casts:             Cast[];
    unknowns:          any[];
    processedCastText: string;
    groupInvites:      any[];
}

export interface Cast {
    hash:          string;
    threadHash:    string;
    author:        Author;
    text:          string;
    timestamp:     number;
    tags:          Tag[];
    embeds?:       CastEmbeds;
    parentSource?: ParentSource;
    parentHash?:   string;
    parentAuthor?: Author;
}

export interface CastEmbeds {
    images:       Image[];
    urls:         URL[];
    videos:       Video[];
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
}

export interface URL {
    type:      URLType;
    openGraph: OpenGraph;
}

export interface OpenGraph {
    url:           string;
    sourceUrl:     string;
    title:         string;
    description?:  string;
    domain:        Domain;
    image:         string;
    useLargeImage: boolean;
    frame?:        Frame;
}

export enum Domain {
    ParagraphXyz = "paragraph.xyz",
    The1Iy6TjtWarpcastTools = "1iy6tjt.warpcast.tools",
    WarpcastCOM = "warpcast.com",
}

export interface Frame {
    version:          string;
    frameUrl:         string;
    imageUrl:         string;
    postUrl:          string;
    buttons:          Button[];
    imageAspectRatio: string;
}

export interface Button {
    index:    number;
    title:    string;
    type:     string;
    target?:  string;
    postUrl?: string;
}

export enum URLType {
    URL = "url",
}

export interface Video {
    type:         string;
    url:          string;
    sourceUrl:    string;
    width:        number;
    height:       number;
    thumbnailUrl: string;
}

export interface ParentSource {
    type: URLType;
    url:  string;
}

export interface Tag {
    type:     TagType;
    id:       string;
    name:     string;
    imageUrl: string;
}

export enum TagType {
    Channel = "channel",
}

export interface Reactions {
    count: number;
}

export interface Recasts {
    count:     number;
    recasters: any[];
}

export interface BookmarkViewerContext {
    reacted:    boolean;
    recast:     boolean;
    bookmarked: boolean;
}
