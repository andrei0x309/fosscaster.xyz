export interface TWCSearchCasts {
    result: Result;
}

export interface Result {
    casts: ResultCast[];
}

export interface ResultCast {
    hash:                string;
    threadHash:          string;
    parentSource?:       ParentSource;
    author:              Author;
    text:                string;
    timestamp:           number;
    mentions?:           Mention[];
    embeds?:             PurpleEmbeds;
    replies:             Reactions;
    reactions:           Reactions;
    recasts:             Recasts;
    watches:             Reactions;
    tags:                Tag[];
    quoteCount:          number;
    combinedRecastCount: number;
    channel?:            Channel;
    viewerContext:       CastViewerContext;
}

export interface Author {
    fid:            number;
    username:       string;
    displayName:    string;
    pfp:            Pfp;
    profile:        PurpleProfile;
    followerCount:  number;
    followingCount: number;
    viewerContext:  AuthorViewerContext;
}

export interface Pfp {
    url:      string;
    verified: boolean;
}

export interface PurpleProfile {
    bio:                 Bio;
    location:            Location;
    earlyWalletAdopter?: boolean;
}

export interface Bio {
    text:            string;
    mentions:        string[];
    channelMentions: string[];
}

export interface Location {
    placeId:     PlaceID;
    description: Description;
}

export enum Description {
    AbeokutaOgunStateNigeria = "Abeokuta, Ogun State, Nigeria",
    Empty = "",
    İstanbulTürkiye = "İstanbul, Türkiye",
}

export enum PlaceID {
    ChIJawhoAASnyhQR0LABvJjZOE = "ChIJawhoAASnyhQR0LABvJj-zOE",
    ChIJfXdmfZLOhARjUeSKPb8NGc = "ChIJf_xdmfZLOhARjUeSKPb8NGc",
    Empty = "",
}

export interface AuthorViewerContext {
    following: boolean;
}

export interface Channel {
    key:           string;
    name:          string;
    imageUrl:      string;
    authorContext: AuthorContext;
    authorRole:    string;
}

export interface AuthorContext {
    role:       string;
    restricted: boolean;
    banned:     boolean;
}

export interface PurpleEmbeds {
    images:            Image[];
    urls:              FluffyURL[];
    videos:            any[];
    unknowns:          any[];
    processedCastText: string;
    groupInvites?:     any[];
    casts?:            EmbedsCast[];
}

export interface EmbedsCast {
    hash:       string;
    threadHash: string;
    author:     Mention;
    text:       string;
    timestamp:  number;
    tags:       any[];
    embeds:     FluffyEmbeds;
}

export interface Mention {
    fid:            number;
    username:       string;
    displayName:    string;
    pfp:            Pfp;
    profile:        MentionProfile;
    followerCount:  number;
    followingCount: number;
}

export interface MentionProfile {
    bio:      Bio;
    location: Location;
}

export interface FluffyEmbeds {
    images:   any[];
    urls:     PurpleURL[];
    videos:   any[];
    unknowns: any[];
}

export interface PurpleURL {
    type:      string;
    openGraph: PurpleOpenGraph;
}

export interface PurpleOpenGraph {
    url:           string;
    sourceUrl:     string;
    title:         string;
    description:   string;
    domain:        string;
    image:         string;
    useLargeImage: boolean;
    frame:         PurpleFrame;
}

export interface PurpleFrame {
    version:          string;
    imageUrl:         string;
    postUrl:          string;
    buttons:          Button[];
    imageAspectRatio: string;
}

export interface Button {
    index:  number;
    title:  string;
    type:   string;
    target: string;
}

export interface Image {
    type:      string;
    url:       string;
    sourceUrl: string;
    media:     Media;
    alt:       string;
}

export interface Media {
    version:      string;
    width:        number;
    height:       number;
    staticRaster: string;
}

export interface FluffyURL {
    type:      string;
    openGraph: FluffyOpenGraph;
}

export interface FluffyOpenGraph {
    url:           string;
    sourceUrl:     string;
    title?:        string;
    description?:  string;
    domain:        string;
    image:         string;
    useLargeImage: boolean;
    frame?:        FluffyFrame;
}

export interface FluffyFrame {
    version:          string;
    frameUrl:         string;
    imageUrl:         string;
    postUrl:          string;
    buttons:          Button[];
    scaffolds?:       Scaffold[];
    imageAspectRatio: string;
}

export interface Scaffold {
    type:        string;
    buttonIndex: number;
    content:     Content;
}

export interface Content {
    target: string;
}

export interface ParentSource {
    type: string;
    url:  string;
}

export interface Reactions {
    count: number;
}

export interface Recasts {
    count:     number;
    recasters: any[];
}

export interface Tag {
    type:     string;
    id:       string;
    name:     string;
    imageUrl: string;
}

export interface CastViewerContext {
    reacted:    boolean;
    recast:     boolean;
    bookmarked: boolean;
}
