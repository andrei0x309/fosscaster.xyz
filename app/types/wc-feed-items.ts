import { FrameEmbedNext } from "./cast/wc-mini-app";

export interface TWcFeedItems {
    items:                   Item[];
    latestMainCastTimestamp: number;
    feedTopSeenAtTimestamp:  number;
    replaceFeed:             boolean;
}

export interface Item {
    id:                string;
    timestamp:         number;
    cast:              ItemCast;
    otherParticipants: any[];
}

export interface ItemCast {
    hash:                string;
    threadHash:          string;
    parentSource?:       ParentSource;
    author:              Author;
    text:                string;
    timestamp:           number;
    embeds:             PurpleEmbeds;
    replies:             Reactions;
    reactions:           Reactions;
    recasts:             Recasts;
    watches:             Reactions;
    tags:                Tag[];
    viewCount:           number;
    quoteCount:          number;
    combinedRecastCount: number;
    warpsTipped?:        number;
    channelMentions?:    ChannelMention[];
    mentions?:           Author[];
    viewerContext:       CastViewerContext;
    pinned?:             boolean;
    parentAuthor?:      Author;
    client?:            Clinet;
}

export interface Clinet {
    fid:         number;
    username:    string;
    displayName: string;
    pfp:         Pfp;
}

export interface Author {
    fid:               number;
    username:          string;
    displayName:       string;
    pfp:               Pfp;
    profile:           Profile;
    followerCount:     number;
    followingCount:    number;
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
    text:             string;
    mentions:         string[];
    channelMentions?: string[];
}

export interface Location {
    placeId:     string;
    description: string;
}

export interface ChannelMention {
    key:  string;
    name: string;
}

export interface PurpleEmbeds {
    images:            Image[];
    urls:              URL[];
    videos:            VideoEmbed[];
    unknowns:          any[];
    processedCastText: string;
    groupInvites:      any[];
    casts:            CastElement[];
}

export interface CastElement {
    hash:         string;
    threadHash:   string;
    parentSource: ParentSource;
    author:       Author;
    text:         string;
    timestamp:    number;
    tags:         Tag[];
    embeds?:      FluffyEmbeds;
}

export interface FluffyEmbeds {
    images:       any[];
    urls:         URL[];
    videos:       any[];
    unknowns:     any[];
    groupInvites: any[];
}

export interface URL {
    type:      URLType;
    openGraph: OpenGraph;
    tweet: {
        payloadV2: string
    }
}

export interface OpenGraph {
    url:           string;
    sourceUrl:     string;
    title:         string;
    description:   string;
    domain:        string;
    image:         string;
    useLargeImage: boolean;
    frameEmbedNext: FrameEmbedNext;
}

export enum URLType {
    URL = "url",
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

export interface VideoEmbed {
    type:         string;
    url:          string;
    sourceUrl:    string;
    width:        number;
    height:       number;
    duration:     number;
    thumbnailUrl: string;
}
