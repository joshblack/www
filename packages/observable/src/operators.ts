import { Observable } from './';

// Operators are functions, they include:
//
// Pipeable operators, a function that takes in an observable and returns
// another observable
//
// Creation operators, called as a standalone functions to create a new
// observable

// Creation operators
export function interval(period: number): Observable<number> {
  return new Observable((sink) => {
    let count = 0;

    sink.next(count);

    const intervalId = setInterval(() => {
      sink.next(++count);
    }, period);

    return () => {
      clearInterval(intervalId);
    };
  });
}

// Filtering operators
export function take<T>(
  maxAmount: number
): (source: Observable<T>) => Observable<T> {
  return (source) => {
    return new Observable((sink) => {
      let amount = 0;

      if (amount >= maxAmount) {
        sink.complete();
        return;
      }

      const subscription = source.subscribe({
        complete: sink.complete,
        error: sink.error,
        next: (value) => {
          amount++;

          sink.next(value);

          if (amount >= maxAmount) {
            sink.complete();
          }
        },
      });

      return () => {
        subscription.unsubscribe();
      };
    });
  };
}

export function retry<T>(
  maxAttempts = 1
): (source: Observable<T>) => Observable<T> {
  return (source) => {
    return new Observable((sink) => {
      let attemptCount = 0;
      let subscription = null;

      function handleError(error) {
        if (attemptCount >= maxAttempts) {
          sink.error(error);
          return;
        }
        attemptCount++;
        subscription = source.subscribe({
          complete: sink.complete,
          error: handleError,
          next: sink.next,
        });
      }

      subscription = source.subscribe({
        complete: sink.complete,
        error: handleError,
        next: sink.next,
      });

      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    });
  };
}

export function throttle<T>(
  period: number
): (source: Observable<T>) => Observable<T> {
  return (source) => {
    return new Observable((sink) => {
      const data = [];
      const sourceSubscription = source.subscribe({
        complete: sink.complete,
        error: sink.error,
        next(value) {
          data.push(value);
        },
      });
      const intervalSubscription = interval(period).subscribe({
        next() {
          if (data.length > 0) {
            sink.next(data.shift());
          }
        },
      });

      return () => {
        sourceSubscription.unsubscribe();
        intervalSubscription.unsubscribe();
      };
    });
  };
}
