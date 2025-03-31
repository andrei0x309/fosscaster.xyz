export interface TWCNotifsUnseen {
    result: Result;
}

export interface Result {
    notificationsCount:   number;
    inboxCount:           number;
    channelFeeds:         ChannelFeed[];
    warpTransactionCount: number;
}

export interface ChannelFeed {
    channelKey:  string;
    feedType:    FeedType;
    hasNewItems: boolean;
}

export enum FeedType {
    Curated = "curated",
    Default = "default",
    Priority = "priority",
}
