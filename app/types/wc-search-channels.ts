export interface TWCSearchChannels {
    result: Result;
    next:   Next;
}

export interface Next {
    cursor: string;
}

export interface Result {
    channels: Channel[];
}

export interface Channel {
    type:                 string;
    key:                  string;
    name:                 string;
    imageUrl:             string;
    fastImageUrl:         string;
    feeds:                Feed[];
    followerCount:        number;
    memberCount:          number;
    showCastSourceLabels: boolean;
    showCastTags:         boolean;
    sectionRank:          number;
    subscribable:         boolean;
    publicCasting:        boolean;
    viewerContext:        ViewerContext;
    description?:         string;
}

export interface Feed {
    name: string;
    type: string;
}

export interface ViewerContext {
    following:        boolean;
    isMember:         boolean;
    hasUnseenItems:   boolean;
    favoritePosition: number;
    canCast:          boolean;
}
