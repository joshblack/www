---
title: 'The Observable'
description: 'Building an Observable in JavaScript'
categories: ['javascript', 'async']
---

Observables are one of those funny things in the JavaScript community where you
either are pretty aware of the ecosystem (often through RxJS) or honestly have
never heard of one before reading a random blog post or post on Twitter about
it.

I was very much so in the latter camp. I had heard a bit about observables,
thought they were related to the `Object.observe` proposal from way back when,
and didn't really know if there was a good use-case for an Observable in my
day-to-day work with React or Node.js.

At the end of the day, an Observable is just another tool in your toolkit and it
can be incredibly helpful for modeling certain types of problems. It also isn't
too bad to put together an implementation for your own project to better
understand how it works under the hood.

In this post, let's take a look at what it takes to build a minimal version of
an `Observable`.

## Building an Observable

At it's core, an Observable is a function. This function takes in a single
argument, an object often called an observer, and uses this object to send
roughly three types of events:

- `observer.next(value)`, give the observer the next value in the sequence
- `observer.complete()`, tell the observer that the sequence is completed and no
  new values will be sent
- `observer.error(error)`, tell the observer that an error has occurred, this
  will also stop sending more values

Here's a `countdown` function that roughly uses this contract:

```js
function countdown(observer) {
  observer.next(3);
  observer.next(2);
  observer.next(1);
  observer.complete();
}
```

We could then call this function with an `observer` and receive the values from
the countdown and when the countdown is completed.

```js
countdown({
  next(value) {
    console.log(value); // Receives 3, then 2, then 1
  },
  complete() {
    console.log('Completed');
  },
});
```

And that's, well, kind of it. We will definitely be adding more functionality to
this, but at its core this is an Observable. Everything we do after this will
build on this fundamental example.

With this example we have:

- A way to create an Observable (through our `countdown` function)
- A way to subscribe to an observable (through calling the function with an
  `observer`)
- A way to emit multiple values over time (through `observer.next`)
- A way to signal completion or errors (through `observer.error` or
  `observer.complete`)

For bonus points, we can make this Observable emit values synchronously _or_
asynchronously:

```js
function countdown(observer) {
  let count = 3;
  let intervalId = null;

  intervalId = setInterval(() => {
    if (count === 0) {
      clearInterval(intervalId);
      observer.complete();
      return;
    }
    observer.next(3--);
  }, 1000);
}
```

And the best part is that we don't have to change any of our code for
subscribing to this Observable, although now we have to worry about cleaning up
some things like timers.

## Formalizing things a bit

First up, let's formalize how we **create** and **subscribe** to an Observable.

We will use a class for creating our Observables, and each class will have a
`subscribe` method. Each class will accept a "source", which is copy-and-pasted
from our `countdown` function above. Similarly, we "subscribe" to our Observable
in the same way we called `countdown` above.

```js
class Observable {
  constructor(source) {
    this.source = source;
  }

  subscribe(observer) {
    this.source(observer);
  }
}
```

We can use this class to re-create our Countdown Observable and subscribe to it:

```js
// The callback given to our Observable class is our "source" function
const Countdown = new Observable((observer) => {
  observer.next(3);
  observer.next(2);
  observer.next(1);
  observer.complete();
});

// Subscribing to our Observable is similar to how we called
// the "countdown" function above
Countdown.subscribe({
  next(value) {
    console.log(value);
  },
  complete() {
    console.log('Done!');
  },
});
```

This is looking like a great start. Let's try making another Observable using
this code.

## Building a counter

We mentioned above that Observables can emit values synchronously or
asynchronously so let's take advantage of that to build a counter. This counter
will start at zero, counting upwards by one every second.

```js
const Counter = new Observable((observer) => {
  let count = 0;
  setInterval(() => {
    observer.next(count++);
  }, 1000);
});
```

We can subscribe to this Observable using `subscribe`:

```js
Counter.subscribe({
  next(value) {
    console.log(value); // 0, 1, 2, 3, ...
  },
});
```

However, our counter will keep going on and on for as long as the program is
running. What happens if we want to stop subscribing to values?

### Canceling a subscription

We can update our class definition from above to have `subscribe` return a
`Subscription`. A Subscription in this case is an object that provides an
`unsubscribe` function, and calling this function would "cancel" the
subscription that was created.

```ts
interface Subscription {
  unsubscribe: () => void;
}

class Observable {
  constructor(source) {
    this.source = source;
  }

  subscribe(observer): Subscription {
    const subscription = {
      unsubscribe() {
        // What goes here?
      },
    };

    this.source(observer);

    return subscription;
  }
}
```

And then in our Counter code we could use the returned subscription to
unsubscribe.

```js
const subscription = Counter.subscribe({
  next(value) {
    console.log(value);
  },
});

// Unsubscribe from Counter, stop receiving values
// in `next`
subscription.unsubscribe();
```

But what exactly should we be doing when we call `unsubscribe` in our
`subscribe` method? Really, we're after two things:

- How do we "close" our observable and tell it to stop sending values through
  "next"
- How do we give our observable source a way to clean-up things like timers when
  something unsubscribes from the subscription

### Rethinking subscribe

Our first step to tackle the two questions above will be to figure out how to
remember if our subscription has been closed. We can use this information to
stop the observable source from calling "next".

```ts
class Observable {
  // --- snip ---

  subscribe(observer): Subscription {
    // Keep track of whether the subscription has been closed
    // in a local variable
    let closed = false;

    const subscription = {
      // When `unsubscribe` is called, set `closed` to `true`
      unsubscribe() {
        if (!closed) {
          closed = true;
        }
      },
    };

    this.source(observer);

    return subscription;
  }
}
```

We this change, we use the local variable `closed` and set it to `true` whenever
`subscription.unsubscribe` is called. But how do we use this to stop our source
function from calling `next` on the observer?

In reality, there isn't much we can do to change when `source` calls `next`. H
owever, we can intercept values that it sends to the observer and choose whether
or not to forward them along.

In other words, let's define something called a `Sink`. This will have the exact
same shape as our observer, but will include logic for whether or not to share
values emitted from the source with the observer.

```ts
class Observable {
  // --- snip ---

  subscribe(observer): Subscription {
    // Keep track of whether the subscription has been closed
    // in a local variable
    let closed = false;

    const subscription = {
      // When `unsubscribe` is called, set `closed` to `true`
      unsubscribe() {
        if (!closed) {
          closed = true;
        }
      },
    };

    // Our Sink matches the signature of observer, but adds
    // in logic for determining if we should call observer
    // based on if the subscription is closed
    const sink = {
      next(value) {
        if (!closed) {
          observer.next(value);
        }
      },
      error(err) {
        if (!closed) {
          closed = true;
          observer.error(err);
        }
      },
      complete() {
        if (!closed) {
          c
`
```
