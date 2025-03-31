export interface TFCFnameTransfer {
    transfers: Transfer[];
}

export interface Transfer {
    id:               number;
    timestamp:        number;
    username:         string;
    owner:            string;
    from:             number;
    to:               number;
    user_signature:   string;
    server_signature: string;
}
