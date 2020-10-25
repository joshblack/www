import { Observable } from '../';

const Countdown = new Observable((sink) => {
  sink.next(5);
  sink.next(4);
  sink.next(3);
  sink.next(2);
  sink.next(1);
  sink.complete();
});

Countdown.subscribe({
  next(value) {
    console.log('Countdown: %s', value);
  },
});
