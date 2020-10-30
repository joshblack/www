import { Observable } from '../';

const Counter = new Observable((sink) => {
  let count = 0;
  sink.next(count);

  const intervalId = setInterval(() => {
    sink.next(++count);
  }, 1000);

  return () => {
    clearInterval(intervalId);
  };
});

const subscription = Counter.subscribe({
  next(value) {
    console.log('Counter: %s', value);
  },
});

setTimeout(() => {
  subscription.unsubscribe();
}, 10000);
