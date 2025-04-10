export interface FrameEmbedNext {
    frameUrl:         string;
    frameEmbed:       FrameEmbed;
    author:           Author;
    imageAspectRatio: string;
}

export interface Author {
    fid:              number;
    username:         string;
    displayName:      string;
    pfp:              Pfp;
    profile:          Profile;
    followerCount:    number;
    followingCount:   number;
    referrerUsername: string;
    viewerContext:    ViewerContext;
}

export interface Pfp {
    url:      string;
    verified: boolean;
}

export interface Profile {
    bio:                Bio;
    location:           Location;
    earlyWalletAdopter: boolean;
}

export interface Bio {
    text:            string;
    mentions:        any[];
    channelMentions: string[];
}

export interface Location {
    placeId:     string;
    description: string;
}

export interface ViewerContext {
    following:           boolean;
    followedBy:          boolean;
    enableNotifications: boolean;
}

export interface FrameEmbed {
    version:     string;
    imageUrl:    string;
    aspectRatio: string;
    button:      Button;
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
