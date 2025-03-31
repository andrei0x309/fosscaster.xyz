export interface TWCSignedKeyRequest {
    result: Result;
}

export interface Result {
    signedKeyRequest: SignedKeyRequest;
}

export interface SignedKeyRequest {
    token:       string;
    deeplinkUrl: string;
    key:         string;
    requestFid:  number;
    state:       string;
    isSponsored: boolean;
}
