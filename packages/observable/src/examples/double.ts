import { Observable } from '../';
import { interval, take } from '../operators';

interval(1000)
  .map((value) => {
    return value * 2;
  })
  .pipe(take(4))
  .subscribe({
    next(value) {
      console.log(value);
    },
  });
