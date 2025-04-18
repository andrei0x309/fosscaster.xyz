export interface TWCDCMessages {
    result: Result;
    next:   Next;
}

export interface Next {
    cursor: string;
}

export interface Result {
    messages: Message[];
}

export interface Message {
    conversationId:           ConversationID;
    senderFid:                number;
    messageId:                string;
    serverTimestamp:          number;
    type:                     InReplyToType;
    message:                  string;
    hasMention:               boolean;
    reactions:                Reaction[];
    metadata?:                MessageMetadata;
    viewerContext:            ViewerContext;
    isPinned:                 boolean;
    isDeleted:                boolean;
    senderContext:            ActionTargetUserContext;
    isProgrammatic?:          boolean;
    mentions?:                Mention[];
    inReplyTo?:               InReplyTo;
    actionTargetUserContext?: ActionTargetUserContext;
}

export interface ActionTargetUserContext {
    fid:         number;
    username:    string;
    displayName: string;
    pfp:         Pfp;
}

export interface Pfp {
    url:      string;
    verified: boolean;
}

export enum ConversationID {
    The5Fd1Eacfb158Db15C718A20D174D16674F662C195773C2Ccfa78Da9957F06918 = "5fd1eacfb158db15c718a20d174d16674f662c195773c2ccfa78da9957f06918",
}

export interface InReplyTo {
    conversationId:  ConversationID;
    senderFid:       number;
    messageId:       string;
    serverTimestamp: number;
    type:            InReplyToType;
    message:         string;
    hasMention:      boolean;
    reactions:       any[];
    isPinned:        boolean;
    isDeleted:       boolean;
    senderContext:   ActionTargetUserContext;
    isProgrammatic:  boolean;
    mentions:        Mention[];
    metadata?:       InReplyToMetadata;
}

export interface Mention {
    user:      ActionTargetUserContext;
    textIndex: number;
    length:    number;
}

export interface InReplyToMetadata {
    urls: URL[];
}

export interface URL {
    type:      URLType;
    openGraph: OpenGraph;
}

export interface OpenGraph {
    url:             string;
    sourceUrl:       string;
    title:           string;
    description:     string;
    domain:          Domain;
    image:           string;
    useLargeImage:   boolean;
    frameEmbedNext?: FrameEmbedNext;
    channel?:        OpenGraphChannel;
}

export interface OpenGraphChannel {
    key:           string;
    followerCount: number;
}

export enum Domain {
    DocsFarcasterXyz = "docs.farcaster.xyz",
    WarpcastCOM = "warpcast.com",
    WarpcastNotionSite = "warpcast.notion.site",
}

export interface FrameEmbedNext {
    frameUrl:   string;
    frameEmbed: FrameEmbed;
}

export interface FrameEmbed {
    version:  string;
    imageUrl: string;
    button:   Button;
}

export interface Button {
    title:  string;
    action: Action;
}

export interface Action {
    type:                  string;
    name:                  string;
    url:                   string;
    splashImageUrl:        string;
    splashBackgroundColor: string;
}

export enum URLType {
    URL = "url",
}

export enum InReplyToType {
    GroupMembershipAddition = "group_membership_addition",
    GroupMembershipRemoval = "group_membership_removal",
    Text = "text",
}

export interface MessageMetadata {
    urls?:   URL[];
    medias?: Media[];
    casts?:  Cast[];
}

export interface Cast {
    hash:         string;
    threadHash:   string;
    parentSource: ParentSource;
    author:       Author;
    text:         string;
    timestamp:    number;
    channel:      CastChannel;
    tags:         Tag[];
}

export interface Author {
    fid:            number;
    username:       string;
    displayName:    string;
    pfp:            Pfp;
    profile:        Profile;
    followerCount:  number;
    followingCount: number;
}

export interface Profile {
    bio:                Bio;
    location:           Location;
    earlyWalletAdopter: boolean;
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

export interface CastChannel {
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

export interface ParentSource {
    type: URLType;
    url:  string;
}

export interface Tag {
    type:     string;
    id:       string;
    name:     string;
    imageUrl: string;
}

export interface Media {
    version:      string;
    width:        number;
    height:       number;
    staticRaster: string;
    mimeType:     string;
}

export interface Reaction {
    reaction: string;
    count:    number;
}

export interface ViewerContext {
    isLastReadMessage: boolean;
    focused:           boolean;
    reactions:         any[];
}
