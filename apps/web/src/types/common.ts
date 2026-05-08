/** Shared frontend-local utility types */

/** Makes specified keys of T required */
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

/** Strips null/undefined from values */
export type NonNullableRecord<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

/** Page-level props shape for App Router pages */
export type PageProps<
  TParams extends Record<string, string> = Record<string, string>,
  TSearchParams extends Record<string, string | string[] | undefined> = Record<
    string,
    string | string[] | undefined
  >,
> = {
  params: Promise<TParams>;
  searchParams: Promise<TSearchParams>;
};
