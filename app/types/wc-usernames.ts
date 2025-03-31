export interface WCUsernames {
    result: Result;
}

export interface Result {
    usernames:                 Username[];
    usernameUpdateLimitMillis: number;
}

export interface Username {
    type: string;
    name: string;
}
