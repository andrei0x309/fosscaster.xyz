export interface TUserChannelFollows {
    result: Result;
}

export interface Result {
    channels: Channel[];
}

export interface Channel {
    type:                           ChannelType;
    key:                            string;
    name:                           string;
    imageUrl:                       string;
    fastImageUrl:                   string;
    feeds:                          Feed[];
    description:                    string;
    followerCount:                  number;
    memberCount:                    number;
    showCastSourceLabels:           boolean;
    showCastTags:                   boolean;
    sectionRank:                    number;
    subscribable:                   boolean;
    lead:                           Lead;
    norms?:                         string;
    viewerContext:                  ViewerContext;
    descriptionMentionedUsernames?: string[];
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

export interface ViewerContext {
    following:        boolean;
    isMember:         boolean;
    hasUnseenItems:   boolean;
    favoritePosition: number;
    activityRank?:    number;
}
