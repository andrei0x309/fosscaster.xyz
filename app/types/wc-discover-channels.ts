export interface TWCDiscoverChannels {
    result: Result;
    next:   Next;
}

export interface Next {
    cursor: string;
}

export interface Result {
    channels:      Channel[];
    viewerContext: ResultViewerContext;
}

export interface Channel {
    type:                  ChannelType;
    key:                   string;
    name:                  string;
    imageUrl:              string;
    headerImageUrl?:       string;
    fastImageUrl:          string;
    feeds:                 Feed[];
    description:           string;
    followerCount:         number;
    memberCount:           number;
    showCastSourceLabels:  boolean;
    showCastTags:          boolean;
    sectionRank:           number;
    subscribable:          boolean;
    lead:                  Lead;
    norms?:                string;
    viewerContext:         ChannelViewerContext;
    headerAction?:         HeaderAction;
    headerActionMetadata?: HeaderActionMetadata;
}

export interface Feed {
    name: Name;
    type: FeedType;
}

export enum Name {
    Main = "Main",
    Recent = "Recent",
}

export enum FeedType {
    Curated = "curated",
    Default = "default",
    Priority = "priority",
}

export interface HeaderAction {
    title:  string;
    target: string;
}

export interface HeaderActionMetadata {
    url:           string;
    sourceUrl:     string;
    title:         string;
    description:   string;
    domain:        string;
    image:         string;
    useLargeImage: boolean;
    frame:         Frame;
    frameDebug:    FrameDebug;
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
    index:   number;
    title:   string;
    type:    string;
    target?: string;
}

export interface FrameDebug {
    version:                 string;
    image:                   string;
    imageUrl:                string;
    postUrl:                 string;
    buttons:                 Button[];
    valid:                   boolean;
    fallbackToImageUrl:      boolean;
    buttonsAreOutOfOrder:    boolean;
    postUrlTooLong:          boolean;
    invalidButtons:          any[];
    inputTextTooLong:        boolean;
    stateTooLong:            boolean;
    imageAspectRatio:        string;
    imgByteLenLimitExceeded: boolean;
}

export interface Lead {
    fid:         number;
    username:    string;
    displayName: string;
    pfp:         Pfp;
}

export interface Pfp {
    url:      string;
    verified: boolean;
}

export enum ChannelType {
    Channel = "channel",
}

export interface ChannelViewerContext {
    following:        boolean;
    isMember:         boolean;
    hasUnseenItems:   boolean;
    favoritePosition: number;
}

export interface ResultViewerContext {
    followingSummary: FollowingSummary;
}

export interface FollowingSummary {
    count:              number;
    channelsOfInterest: any[];
}
