type Observer<T> = {
  start?: (subscription: Subscription) => void;
  next?: (value: T) => void;
  error?: (err: Error) => void;
  complete?: () => void;
};

interface Subscription {
  unsubscribe: () => void;
}

interface Sink<T> {
  next: (value: T) => void;
  error: (err: Error) => void;
  complete: () => void;
}

interface Source<T> {
  (sink: Sink<T>): void | Subscription | (() => void);
}

export class Observable<T> {
  _source: Source<T>;

  constructor(source: Source<T>) {
    this._source = source;
  }

  subscribe(observer: Observer<T>): Subscription {
    return subscribe(this._source, observer);
  }

  concat<U>(next: Observable<U>): Observable<T | U> {
    return new Observable((sink) => {
      let current = this.subscribe({
        next: sink.next,
        error: sink.error,
        complete() {
          current = next.subscribe(sink);
        },
      });

      return () => {
        if (current) {
          current.unsubscribe();
        }
      };
    });
  }

  map<U>(mapFn: (T) => U): Observable<U> {
    return new Observable((sink) => {
      return this.subscribe({
        complete: sink.complete,
        error: sink.error,
        next(value: T) {
          try {
            const mapValue = mapFn(value);
            sink.next(mapValue);
          } catch (error) {
            sink.error(error);
          }
        },
      });
    });
  }

  pipe(...operators): Observable<unknown> {
    return operators.reduce((acc, operator) => {
      return operator(acc);
    }, this);
  }
}

function subscribe<T>(source: Source<T>, observer: Observer<T>): Subscription {
  let cleanup = null;
  let closed = false;

  const subscription = {
    unsubscribe() {
      if (!closed) {
        closed = true;
        runCleanup();
      }
    },
  };

  if (observer.start) {
    observer.start(subscription);
  }

  if (closed) {
    return subscription;
  }

  const sink: Sink<T> = {
    next: (value) => {
      if (!closed && observer.next) {
        observer.next(value);
      }
    },
    error: (error) => {
      if (!closed) {
        if (observer.error) {
          observer.error(error);
        }
        runCleanup();
      }
    },
    complete: () => {
      if (!closed) {
        closed = true;
        runCleanup();
      }
    },
  };
  cleanup = source(sink);

  function runCleanup() {
    if (cleanup) {
      if (cleanup.unsubscribe) {
        cleanup.unsubscribe();
      } else {
        cleanup();
      }
      cleanup = null;
    }
  }

  return subscription;
}
