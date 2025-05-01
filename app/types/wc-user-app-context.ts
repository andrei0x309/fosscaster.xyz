export interface TWCUserAppContext {
    context: Context;
}

export interface Context {
    canAddLinks:                      boolean;
    showConnectedApps:                boolean;
    signerRequestsEnabled:            boolean;
    prompts:                          any[];
    castActions:                      CastAction[];
    canAddCastAction:                 boolean;
    adminForChannelKeys:              string[];
    modOfChannelKeys:                 string[];
    memberOfChannelKeys:              string[];
    canEditAllChannels:               boolean;
    canUploadVideo:                   boolean;
    statsigEnabled:                   boolean;
    shouldPromptForPushNotifications: boolean;
    shouldPromptForAppStoreReview:    boolean;
    enabledCastAction:                CastAction;
    notificationTabsV2:               NotificationTabsV2[];
    regularCastByteLimit:             number;
    longCastByteLimit:                number;
    newUserStatus:                    NewUserStatus;
}

export interface CastAction {
    id:        string;
    name:      string;
    octicon:   string;
    actionUrl: string;
    action:    Action;
}

export interface Action {
    actionType: string;
    postUrl:    string;
}

export interface NewUserStatus {
}

export interface NotificationTabsV2 {
    id:   string;
    name: string;
}
