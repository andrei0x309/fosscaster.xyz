export interface TWCTopFrames {
    result: Result;
    next:   Next;
}

export interface Next {
    cursor: string;
}

export interface Result {
    frames: Frame[];
}

export interface Frame {
    domain:                string;
    name:                  string;
    iconUrl:               string;
    homeUrl:               string;
    imageUrl?:             string;
    buttonTitle?:          string;
    splashImageUrl:        string;
    splashBackgroundColor: string;
    author:                Author;
    supportsNotifications: boolean;
    viewerContext:         FrameViewerContext;
}

export interface Author {
    fid:               number;
    username:          string;
    displayName:       string;
    pfp:               Pfp;
    profile:           Profile;
    followerCount:     number;
    followingCount:    number;
    referrerUsername?: string;
    viewerContext:     AuthorViewerContext;
}

export interface Pfp {
    url:      string;
    verified: boolean;
}

export interface Profile {
    bio:                 Bio;
    location:            Location;
    earlyWalletAdopter?: boolean;
    totalEarned?:        number;
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

export interface AuthorViewerContext {
    following:  boolean;
    followedBy: boolean;
}

export interface FrameViewerContext {
    favorited?:            boolean;
    notificationsEnabled?: boolean;
    notificationDetails?:  NotificationDetails;
}

export interface NotificationDetails {
    token: string;
    url:   string;
}
