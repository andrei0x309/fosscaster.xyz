export interface TWCOnboardingAuth {
    result: Result;
}

export interface Result {
    state: State;
    token: Token;
}

export interface State {
    id:                            string;
    email:                         string;
    user:                          User;
    hasOnboarding:                 boolean;
    hasConfirmedEmail:             boolean;
    handledConnectAddress:         boolean;
    canRegisterUsername:           boolean;
    needsRegistrationPayment:      boolean;
    hasFid:                        boolean;
    hasFname:                      boolean;
    hasDelegatedSigner:            boolean;
    hasSetupProfile:               boolean;
    hasCompletedRegistration:      boolean;
    hasStorage:                    boolean;
    handledPushNotificationsNudge: boolean;
    handledContactsNudge:          boolean;
    handledInterestsNudge:         boolean;
    hasValidPaidInvite:            boolean;
    hasPhone:                      boolean;
    needsPhone:                    boolean;
    sponsoredRegisterEligible:     boolean;
}

export interface User {
    fid:               number;
    displayName:       string;
    profile:           Profile;
    followerCount:     number;
    followingCount:    number;
    activeOnFcNetwork: boolean;
    viewerContext:     ViewerContext;
}

export interface Profile {
    bio:      Bio;
    location: Location;
}

export interface Bio {
    text:     string;
    mentions: any[];
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

export interface Token {
    secret:    string;
    expiresAt: number;
}
