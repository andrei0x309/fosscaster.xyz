export interface TWCDcInbox {
    result: Result;
    next:   Next;
}

export interface Next {
    cursor: string;
}

export interface Result {
    hasArchived:       boolean;
    hasUnreadRequests: boolean;
    requestsCount:     number;
    conversations:     Conversation[];
}

export interface Conversation {
    conversationId: string;
    adminFids:      any[];
    lastReadTime:   number;
    lastMessage?:   LastMessage;
    isGroup:        boolean;
    createdAt:      number;
    viewerContext:  ConversationViewerContext;
}

export interface LastMessage {
    conversationId:  string;
    senderFid:       number;
    messageId:       string;
    serverTimestamp: number;
    type:            string;
    message:         string;
    hasMention:      boolean;
    reactions:       any[];
    isPinned:        boolean;
    isDeleted:       boolean;
    senderContext:   SenderContext;
}

export interface SenderContext {
    fid:         number;
    username:    string;
    displayName: string;
    pfp:         Pfp;
}

export interface Pfp {
    url:      string;
    verified: boolean;
}

export interface ConversationViewerContext {
    category:             Category;
    lastReadAt:           number;
    muted:                boolean;
    manuallyMarkedUnread: boolean;
    pinned:               boolean;
    unreadCount:          number;
    unreadMentionsCount:  number;
    counterParty:         CounterParty;
    tag?:                 string;
}

export enum Category {
    Request = "request",
}

export interface CounterParty {
    fid:               number;
    username:          string;
    displayName:       string;
    pfp:               Pfp;
    profile:           CounterPartyProfile;
    followerCount:     number;
    followingCount:    number;
    viewerContext:     CounterPartyViewerContext;
    referrerUsername?: string;
}

export interface CounterPartyProfile {
    bio:                 Bio;
    location:            Location;
    earlyWalletAdopter?: boolean;
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

export interface CounterPartyViewerContext {
    following:           boolean;
    followedBy:          boolean;
    enableNotifications: boolean;
    followersYouKnow:    FollowersYouKnow;
}

export interface FollowersYouKnow {
    users:      User[];
    totalCount: number;
}

export interface User {
    fid:               number;
    username:          string;
    displayName:       string;
    pfp:               Pfp;
    profile:           UserProfile;
    followerCount:     number;
    followingCount:    number;
    viewerContext:     UserViewerContext;
    referrerUsername?: string;
}

export interface UserProfile {
    bio:                 Bio;
    location:            Location;
    earlyWalletAdopter?: boolean;
    totalEarned?:        number;
}

export interface UserViewerContext {
    following:  boolean;
    followedBy: boolean;
}
