export type FetchData<T, D = T> =
  | {
      status: 'nothing' | 'loading';
      value: D;
      error: null;
    }
  | {
      status: 'error';
      value: D;
      error: string;
    }
  | {
      status: 'succeed';
      value: T;
      error: null;
    };
