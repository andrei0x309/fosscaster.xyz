export interface TWcProfileCasts {
    result: Result;
    next:   Next;
}

export interface Next {
    cursor: string;
}

export interface Result {
    casts: Cast[];
}

export interface Cast {
    hash:                string;
    threadHash:          string;
    author:              Author;
    text:                string;
    timestamp:           number;
    replies:             Reactions;
    reactions:           Reactions;
    recasts:             Recasts;
    watches:             Reactions;
    tags:                any[];
    quoteCount:          number;
    combinedRecastCount: number;
    viewerContext:       CastViewerContext;
    embeds?:             Embeds;
}

export interface Author {
    fid:               number;
    username:          Username;
    displayName:       DisplayName;
    pfp:               Pfp;
    profile:           Profile;
    followerCount:     number;
    followingCount:    number;
    activeOnFcNetwork: boolean;
    viewerContext:     AuthorViewerContext;
}

export enum DisplayName {
    YupTester = "YupTester",
}

export interface Pfp {
    url:      string;
    verified: boolean;
}

export interface Profile {
    bio:      Bio;
    location: Location;
}

export interface Bio {
    text:            Text;
    mentions:        any[];
    channelMentions: any[];
}

export enum Text {
    BipBotIAmATestingAccount = "Bip bot, i am a testing account...",
}

export interface Location {
    placeId:     string;
    description: string;
}

export enum Username {
    Yuptester = "yuptester",
}

export interface AuthorViewerContext {
    following: boolean;
}

export interface Embeds {
    images:            any[];
    urls:              URL[];
    videos:            any[];
    unknowns:          any[];
    processedCastText: string;
    groupInvites:      any[];
}

export interface URL {
    type:      URLType;
    openGraph: OpenGraph;
}

export interface OpenGraph {
    url:           string;
    sourceUrl:     string;
    title:         string;
    description:   string;
    domain:        Domain;
    image:         string;
    useLargeImage: boolean;
    frame?:        Frame;
}

export enum Domain {
    GithubCOM = "github.com",
    YupLive = "yup.live",
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
    index:  number;
    title:  Title;
    type:   ButtonType;
    target: string;
}

export enum Title {
    JoinYup = "Join Yup",
    MiniApp = "MiniApp",
    VisitYupLive = "Visit Yup.live",
}

export enum ButtonType {
    Link = "link",
}

export enum URLType {
    URL = "url",
}

export interface Reactions {
    count: number;
}

export interface Recasts {
    count:     number;
    recasters: any[];
}

export interface CastViewerContext {
    reacted:    boolean;
    recast:     boolean;
    bookmarked: boolean;
}
