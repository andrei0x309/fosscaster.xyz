export interface TWCFrame {
    result: Result;
}

export interface Result {
    frame: Frame;
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

export interface Author {
    fid:            number;
    username:       string;
    displayName:    string;
    pfp:            Pfp;
    profile:        Profile;
    followerCount:  number;
    followingCount: number;
    viewerContext:  AuthorViewerContext;
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
    channelMentions: any[];
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
    favorited:            boolean;
    notificationsEnabled: boolean;
    notificationDetails:  NotificationDetails;
}

export interface NotificationDetails {
    token: string;
    url:   string;
}
