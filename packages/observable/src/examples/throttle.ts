import { interval, throttle } from '../operators';

interval(100)
  .pipe(throttle(1000))
  .subscribe({
    next(value) {
      console.log(value);
    },
  });
