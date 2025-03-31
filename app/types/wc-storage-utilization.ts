export interface TWCStorageUtilization {
    result: Result;
}

export interface Result {
    storageUtilization: StorageUtilization;
}

export interface StorageUtilization {
    rentedUnits: number;
    casts:       Casts;
    reactions:   Casts;
    links:       Casts;
}

export interface Casts {
    used:   number;
    rented: number;
}
