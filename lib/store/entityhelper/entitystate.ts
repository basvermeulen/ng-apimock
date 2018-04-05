export interface Dictionary<T> {
    [key: number]: T;
    [key: string]: T;
}

export interface EntityState<T> {
    ids: string[] | number[];
    entities: Dictionary<T>
}


