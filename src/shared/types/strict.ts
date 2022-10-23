export type Strict<T, X extends T> = T & { [K in keyof X]: K extends keyof T ? X[K] : never };
