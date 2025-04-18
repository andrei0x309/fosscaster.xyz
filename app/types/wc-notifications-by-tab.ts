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
    frame?:     Frame;
    targetUrl?: string;
    title?: string;
    notificationId?: string;
    body?: string;
    channel: ChannelInvite;
    role: string;
    type:         string;
    chain:        string;
    hash:         string;
    id:           string;
    fromAddress:  string;
    fromUser:     User;
    fromIdentity: FromIdentity;
    amount:       string;
    token:        Token | TokenClass;
    timestamp: number;
    score:     number;
    volume:    number;
    buyers:    number;
    price:     number;
    status:    string;
    description: string;
    platform: string;
}
 export interface TokenClass {
    name:           string;
    imageUrl:       string;
    ticker:         string;
    ca:             string;
    pair:           string;
    chain:          string;
    decimals:       number;
    description:    string;
    priceChangePct: PriceChangePct;
    priceUsd:       string;
    volume:         PriceChangePct;
    marketCap:      number;
    liquidity:      number;
    fdv:            number;
    totalSupply:    string;
    holderCount:    number;
    source:         Source;
}
 export interface Source {
    platform:        string;
    createdAt:       number;
    creatorAddress:  string;
    creatorIdentity: CreatorIdentity;
    creator:         Creator;
    cast:            Cast;
}

export interface Cast {
    hash:                string;
    threadHash:          string;
    author:              Creator;
    text:                string;
    timestamp:           number;
    mentions:            Mention[];
    channelMentions:     ChannelMention[];
    embeds:              Embeds;
    replies:             Reactions;
    reactions:           Reactions;
    recasts:             Recasts;
    watches:             Reactions;
    tags:                any[];
    viewCount:           number;
    quoteCount:          number;
    combinedRecastCount: number;
}

export interface Creator {
    fid:            number;
    username:       string;
    displayName:    string;
    pfp:            Pfp;
    profile:        CreatorProfile;
    followerCount:  number;
    followingCount: number;
}
 
export interface CreatorProfile {
    bio:      Bio;
    location: Location;
}
 
export interface ChannelMention {
    key:  string;
    name: string;
}

export interface Embeds {
    images:            Image[];
    urls:              any[];
    videos:            any[];
    unknowns:          any[];
    processedCastText: string;
    groupInvites:      any[];
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
    mimeType:     string;
}
 
export interface MentionProfile {
    bio:                 Bio;
    location:            Location;
    earlyWalletAdopter?: boolean;
}
 
export interface CreatorIdentity {
    address: string;
}


export interface FromIdentity {
    address: string;
    user:    User;
}
 
export interface ViewerContext {
    following:           boolean;
    followedBy:          boolean;
    enableNotifications: boolean;
}

export interface Token {
    name:           string;
    imageUrl:       string;
    ticker:         string;
    ca:             string;
    pair:           string;
    chain:          string;
    decimals:       number;
    description:    string;
    priceChangePct: PriceChangePct;
    priceUsd:       string;
    volume:         Volume;
    marketCap:      number;
    liquidity:      number;
    fdv:            number;
    totalSupply:    string;
    holderCount:    number;
    source:         PriceChangePct;
}

export interface PriceChangePct {
}

export interface Volume {
    h6:  number;
    h24: number;
}


export interface ChannelInvite {
    type:                 string;
    key:                  string;
    name:                 string;
    imageUrl:             string;
    headerImageUrl:       string;
    fastImageUrl:         string;
    feeds:                Feed[];
    description:          string;
    followerCount:        number;
    memberCount:          number;
    showCastSourceLabels: boolean;
    showCastTags:         boolean;
    sectionRank:          number;
    subscribable:         boolean;
    publicCasting:        boolean;
    viewerContext:        ChannelInviteViewerContext;
}

export interface Feed {
    name: string;
    type: string;
}

export interface ChannelInviteViewerContext {
    following:        boolean;
    isMember:         boolean;
    hasUnseenItems:   boolean;
    favoritePosition: number;
    canCast:          boolean;
    membersYouKnow:   MembersYouKnow;
}

export interface MembersYouKnow {
    users:      User[];
    totalCount: number;
}

export interface User {
    fid:            number;
    username:       string;
    displayName:    string;
    pfp:            Pfp;
    profile:        Profile;
    followerCount:  number;
    followingCount: number;
    viewerContext:  UserViewerContext;
}

export interface UserViewerContext {
    following:  boolean;
    followedBy: boolean;
}


export interface Frame {
    domain:                string;
    name:                  string;
    iconUrl:               string;
    homeUrl:               string;
    imageUrl:              string;
    buttonTitle:           string;
    splashImageUrl:        string;
    splashBackgroundColor: string;
    author:                Author;
    supportsNotifications: boolean;
    viewerContext:         FrameViewerContext;
}

export interface FrameViewerContext {
    favorited:            boolean;
    notificationsEnabled: boolean;
    notificationDetails:  NotificationDetails;
}

export interface NotificationDetails {
    token: string;
    url:   string;
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
    FrameGeneric = "frame-generic",
    ChannelRoleInvite = "channel-role-invite",
    ChannelPinnedCast = "channel-pinned-cast",
    Follow = "follow",
    WalletActivity = "wallet-activity",
    TrendingToken = "trending-token",
    Generic = "generic",
    ConnectAccount = "connect-account",
}
