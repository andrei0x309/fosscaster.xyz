export interface WCTweet {
    payloadV2: string | TweetString
}

export interface TweetString {
    __typename:         string;
    lang:               string;
    favorite_count:     number;
    possibly_sensitive: boolean;
    created_at:         Date;
    display_text_range: number[];
    entities:           Entities;
    id_str:             string;
    text:               string;
    user:               User;
    edit_control:       EditControl;
    mediaDetails:       MediaDetail[];
    photos:             Photo[];
    conversation_count: number;
    news_action_type:   string;
    isEdited:           boolean;
    isStaleEdit:        boolean;
}

export interface EditControl {
    edit_tweet_ids:       string[];
    editable_until_msecs: string;
    is_edit_eligible:     boolean;
    edits_remaining:      string;
}

export interface Entities {
    hashtags:      any[];
    urls:          any[];
    user_mentions: any[];
    symbols:       any[];
    media:         Media[];
}

export interface Media {
    display_url:  string;
    expanded_url: string;
    indices:      number[];
    url:          string;
}

export interface MediaDetail {
    display_url:            string;
    expanded_url:           string;
    ext_media_availability: EXTMediaAvailability;
    indices:                number[];
    media_url_https:        string;
    original_info:          OriginalInfo;
    sizes:                  Sizes;
    type:                   string;
    url:                    string;
}

export interface EXTMediaAvailability {
    status: string;
}

export interface OriginalInfo {
    height:      number;
    width:       number;
    focus_rects: CropCandidate[];
}

export interface CropCandidate {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface Sizes {
    large:  Large;
    medium: Large;
    small:  Large;
    thumb:  Large;
}

export interface Large {
    h:      number;
    resize: string;
    w:      number;
}

export interface Photo {
    backgroundColor: BackgroundColor;
    cropCandidates:  CropCandidate[];
    expandedUrl:     string;
    url:             string;
    width:           number;
    height:          number;
}

export interface BackgroundColor {
    red:   number;
    green: number;
    blue:  number;
}

export interface User {
    id_str:                  string;
    name:                    string;
    profile_image_url_https: string;
    screen_name:             string;
    verified:                boolean;
    is_blue_verified:        boolean;
    profile_image_shape:     string;
}
