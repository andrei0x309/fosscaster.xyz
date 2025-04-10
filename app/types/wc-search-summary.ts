export interface TWCSearchSummary {
    result: Result;
}

export interface Result {
    channels:        Channel[];
    hasMoreChannels: boolean;
    users:           User[];
    hasMoreUsers:    boolean;
}

export interface Channel {
    type:                 string;
    key:                  string;
    name:                 string;
    imageUrl:             string;
    headerImageUrl:       string;
    headerAction:         HeaderAction;
    headerActionMetadata: HeaderActionMetadata;
    fastImageUrl:         string;
    feeds:                Feed[];
    description:          string;
    followerCount:        number;
    memberCount:          number;
    showCastSourceLabels: boolean;
    showCastTags:         boolean;
    sectionRank:          number;
    subscribable:         boolean;
    inviteCode?:          string;
    publicCasting:        boolean;
    viewerContext:        ChannelViewerContext;
}

export interface Feed {
    name: string;
    type: string;
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
}

export interface ChannelViewerContext {
    following:            boolean;
    isMember:             boolean;
    hasUnseenItems:       boolean;
    favoritePosition:     number;
    enableNotifications?: boolean;
    canCast:              boolean;
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

export interface Pfp {
    url:      string;
    verified: boolean;
}

export interface Profile {
    bio:                 Bio;
    location:            Location;
    earlyWalletAdopter?: boolean;
}

export interface Bio {
    text:             string;
    mentions:         any[];
    channelMentions?: any[];
}

export interface Location {
    placeId:     string;
    description: string;
}

export interface UserViewerContext {
    following:           boolean;
    followedBy:          boolean;
    enableNotifications: boolean;
}
