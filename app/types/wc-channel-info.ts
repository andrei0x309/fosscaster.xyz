export interface TWCChannelInfo {
    result: Result;
}

export interface Result {
    channel: Channel;
}

export interface Channel {
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
    lead:                 Lead;
    norms:                string;
    viewerContext:        ViewerContext;
}

export interface Feed {
    name: string;
    type: string;
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

export interface ViewerContext {
    following:        boolean;
    isMember:         boolean;
    hasUnseenItems:   boolean;
    favoritePosition: number;
}
