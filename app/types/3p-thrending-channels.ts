export interface TThirdPThrendingChannels {
    object:         TThirdPThrendingChannelObject;
    cast_count_1d:  string;
    cast_count_7d:  string;
    cast_count_30d: string;
    channel:        Channel;
    fullData:       FullData;
}

export interface Channel {
    id:              string;
    url:             string;
    name:            string;
    description:     string;
    object:          ChannelObject;
    follower_count:  number;
    member_count:    number;
    image_url:       string;
    created_at:      number;
    parent_url:      string;
    moderator_fids:  number[];
    lead:            Lead;
    pinnedCastHash?: string;
    headerImageUrl?: string;
}

export interface Lead {
    object?:             LeadObject;
    fid?:                number;
    custody_address?:    string;
    username?:           string;
    display_name?:       string;
    pfp_url?:            string;
    profile?:            Profile;
    follower_count?:     number;
    following_count?:    number;
    verifications:       string[];
    verified_addresses?: VerifiedAddresses;
    active_status?:      ActiveStatus;
    power_badge?:        boolean;
}

export enum ActiveStatus {
    Active = "active",
    Inactive = "inactive",
}

export enum LeadObject {
    User = "user",
}

export interface Profile {
    bio: Bio;
}

export interface Bio {
    text: string;
}

export interface VerifiedAddresses {
    eth_addresses: string[];
    sol_addresses: string[];
}

export enum ChannelObject {
    Channel = "channel",
}

export interface FullData {
    _id:                string;
    __v:                number;
    channel_created_at: Date;
    createdAt:          Date;
    description:        string;
    id:                 string;
    image_url:          string;
    lead:               Lead;
    name:               string;
    object:             ChannelObject;
    parent_url:         string;
    updatedAt:          Date;
    url:                string;
}

export enum TThirdPThrendingChannelObject {
    ChannelActivity = "channel_activity",
}
