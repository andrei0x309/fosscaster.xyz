export interface TWcUserThreadItems {
    result: TWcUserThreadItemsData
}
export interface TWcUserThreadItemsData {
    casts:            TtCast[];
    hasHiddenReplies: boolean;
    next?:             Next;
}

export interface Next {
    cursor: string;
}

export interface TtCast {
    hash:                string;
    threadHash:          Hash;
    author:              ParentAuthorClass;
    castType?:           string;
    text:                string;
    timestamp:           number;
    mentions:            any[];
    embeds?:             Embeds;
    ancestors:           Ancestors;
    replies:             Replies;
    reactions:           Reactions;
    recasts:             Reactions;
    watches:             Reactions;
    tags:                Tag[];
    quoteCount:          number;
    combinedRecastCount: number;
    warpsTipped:         number;
    viewerContext:       CastViewerContext;
    parentSource?:       ParentSource;
    viewCount?:          number;
    parentHash?:         Hash;
    parentAuthor?:       ParentAuthorClass;
}

export interface Ancestors {
    count:  number;
    casts?: AncestorsCast[];
}

export interface AncestorsCast {
    hash:                Hash;
    threadHash:          Hash;
    author:              PurpleAuthor;
    castType:            string;
    text:                string;
    timestamp:           number;
    mentions:            any[];
    embeds:              Embeds;
    ancestors:           Reactions;
    replies:             Reactions;
    reactions:           Reactions;
    recasts:             Reactions;
    watches:             Reactions;
    tags:                Tag[];
    quoteCount:          number;
    combinedRecastCount: number;
    warpsTipped:         number;
    viewerContext:       CastViewerContext;
}

export interface Reactions {
    count: number;
}

export interface PurpleAuthor {
    fid:               number;
    displayName:       string;
    pfp:               Pfp;
    profile:           PurpleProfile;
    followerCount:     number;
    followingCount:    number;
    activeOnFcNetwork: boolean;
    viewerContext:     AuthorViewerContext;
}

export interface Pfp {
    url:      string;
    verified: boolean;
}

export interface PurpleProfile {
    bio:      PurpleBio;
    location: Location;
}

export interface PurpleBio {
    text:     string;
    mentions: any[];
}

export interface Location {
    placeId:     string;
    description: string;
}

export interface AuthorViewerContext {
    following: boolean;
    blockedBy: boolean;
}

export interface Embeds {
    images:            Image[];
    urls:              any[];
    videos:            any[];
    unknowns:          any[];
    processedCastText: string;
    groupInvites?:     any[];
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

export enum Hash {
    The0X31E0231Ebc4296A00925Ed17Da301390Ec5F96C1 = "0x31e0231ebc4296a00925ed17da301390ec5f96c1",
    The0Xb465C89Ab88B149D603264C471C081141Dde5F14 = "0xb465c89ab88b149d603264c471c081141dde5f14",
}

export interface Tag {
    type:     Type;
    id:       ID;
    name:     Name;
    imageUrl: string;
}

export enum ID {
    Founders = "founders",
}

export enum Name {
    Founders = "Founders",
}

export enum Type {
    Channel = "channel",
}

export interface CastViewerContext {
    reacted:    boolean;
    recast:     boolean;
    bookmarked: boolean;
}

export interface ParentAuthorClass {
    fid:               number;
    displayName:       string;
    pfp?:              Pfp;
    profile:           ParentAuthorProfile;
    followerCount:     number;
    followingCount:    number;
    activeOnFcNetwork: boolean;
    viewerContext?:    AuthorViewerContext;
    username?:         string;
}

export interface ParentAuthorProfile {
    bio:      FluffyBio;
    location: Location;
}

export interface FluffyBio {
    text:             string;
    mentions:         any[];
    channelMentions?: string[];
}

export interface ParentSource {
    type: string;
    url:  string;
}

export interface Replies {
    count:  number;
    casts?: RepliesCast[];
}

export interface RepliesCast {
    hash:                string;
    threadHash:          Hash;
    parentHash:          string;
    parentAuthor:        ParentAuthorClass;
    author:              ParentAuthorClass;
    text:                string;
    timestamp:           number;
    mentions:            any[];
    ancestors:           Reactions;
    replies:             Reactions;
    reactions:           Reactions;
    recasts:             Reactions;
    watches:             Reactions;
    tags:                Tag[];
    quoteCount:          number;
    combinedRecastCount: number;
    warpsTipped:         number;
    viewerContext:       CastViewerContext;
}
