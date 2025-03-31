export interface TWCNotifByType {
    result: Result;
    next:   Next;
}

export interface Next {
    cursor: string;
}

export interface Result {
    notifications: Notification[];
}

export interface Notification {
    id:              string;
    type:            PreviewItemType;
    latestTimestamp: number;
    totalItemCount:  number;
    previewItems:    PreviewItem[];
}

export interface PreviewItem {
    type:      PreviewItemType;
    id:        string;
    timestamp: number;
    actor:     Actor;
    content:   Content;
}

export interface Actor {
    fid:               number;
    username:          string;
    displayName:       string;
    pfp:               Pfp;
    profile:           Profile;
    followerCount:     number;
    followingCount:    number;
    activeOnFcNetwork: boolean;
    viewerContext?:    ActorViewerContext;
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
    mentions:        Mention[];
    channelMentions: string[];
}

export enum Mention {
    DegentipbotEth = "degentipbot.eth",
    Frames = "frames",
    Yup = "yup",
}

export interface Location {
    placeId:     string;
    description: string;
}

export interface ActorViewerContext {
    following:   boolean;
    followedBy?: boolean;
}

export interface Content {
    cast:      Cast;
    reaction?: Reaction;
}

export interface Cast {
    hash:                 string;
    threadHash:           string;
    author:               Author;
    text:                 string;
    timestamp:            number;
    replies:              Reactions;
    reactions:            Reactions;
    recasts:              Recasts;
    watches:              Reactions;
    parentHash?:          string;
    parentAuthor?:        Actor;
    tags?:                Tag[];
    quoteCount?:          number;
    combinedRecastCount?: number;
    channel?:             Channel;
    viewerContext?:       CastViewerContext;
}

export interface Author {
    fid:               number;
    username:          string;
    displayName:       string;
    pfp:               Pfp;
    profile:           Profile;
    followerCount:     number;
    followingCount:    number;
    activeOnFcNetwork: boolean;
    viewerContext?:    AuthorViewerContext;
}

export interface AuthorViewerContext {
    following: boolean;
}

export interface Channel {
    key:           string;
    name:          string;
    imageUrl:      string;
    authorContext: AuthorContext;
    authorRole:    string;
}

export interface AuthorContext {
    role:       string;
    restricted: boolean;
    banned:     boolean;
}

export interface Reactions {
    count: number;
}

export interface Recasts {
    count:      number;
    recasters?: any[];
}

export interface Tag {
    type:     string;
    id:       string;
    name:     string;
    imageUrl: string;
}

export interface CastViewerContext {
    reacted?: boolean;
}

export interface Reaction {
    type:      ReactionType;
    hash:      string;
    reactor:   Author;
    timestamp: number;
    castHash:  string;
}

export enum ReactionType {
    Like = "like",
}

export enum PreviewItemType {
    CastReaction = "cast-reaction",
    CastReply = "cast-reply",
    CastMention = "cast-mention",
}
