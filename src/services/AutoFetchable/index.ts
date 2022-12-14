import { makeAutoObservable, onBecomeObserved, onBecomeUnobserved, runInAction, reaction } from 'mobx';
import type { CancellablePromise } from 'mobx/dist/internal';

import { fetchError, fetchLoading, fetchNothing, fetchSucceed } from './utils';

export const autoFetchable = <T>({
  fetch,
  deps = () => void 0,
}: {
  fetch: () => () => CancellablePromise<T> | T;
  deps?: () => unknown;
}) => new AutoFetchable(fetch, deps);

export class AutoFetchable<T> {
  public data = fetchNothing<T>();

  public get value() {
    return this.data.value;
  }

  public get status() {
    return this.data.status;
  }

  public get error() {
    return this.data.error;
  }

  public get isNothing() {
    return this.status === 'nothing';
  }

  public get isSucceed() {
    return this.status === 'succeed';
  }

  public get isLoading() {
    return this.status === 'loading';
  }

  public get isError() {
    return this.status === 'error';
  }

  public get isFetched() {
    return this.data.value !== null;
  }

  public readonly forceUpdate = (value: T) => {
    runInAction(() => {
      this.data = fetchSucceed(value);
    });
  };

  constructor(
    private readonly fetch: () => () => CancellablePromise<T> | T,
    private readonly deps: () => unknown,
  ) {
    makeAutoObservable(this);

    this.runAutoFetcher();
  }

  private readonly runAutoFetcher = () => {
    let disposeListener: () => void = () => void 0;
    let cancelFetch: () => void = () => void 0;

    onBecomeObserved(this, 'data', () => {
      disposeListener = reaction(
        () => [this.fetch(), this.deps()] as const,
        async ([fetch]) => {
          cancelFetch();

          this.data = fetchLoading(this.data.value);

          try {
            const awaitedData = fetch();

            let data: T;

            if ('cancel' in awaitedData) {
              cancelFetch = awaitedData.cancel;
              data = await awaitedData;
            } else data = awaitedData;

            runInAction(() => {
              this.data = fetchSucceed(data);
            });
          } catch (error) {
            runInAction(() => {
              this.data = fetchError(error, this.data.value);
            });
          }
        },
        { fireImmediately: true },
      );
    });

    onBecomeUnobserved(this, 'data', () => {
      disposeListener();
      cancelFetch();
    });
  };
}
