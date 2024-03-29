---
title: 'The Observable'
description:
  'Dive deep into Observables, how they work, and how to build your own'
categories: []
date: 2020-10-25
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
          closed = true;
          observer.complete();
        }
      },
    };

    this.source(sink);

    return subscription;
  }
}
```

With this change, now we can call `subscription.unsubscribe` and it will stop
our observer from receiving any additional values <span
aria-label="celebrate">🎉</span>

However, we still need to figure out our clean-up step. In particular, when we
cancel our Counter subscription how will we cancel any pending timers that
currently exist?

### Rethinking our Observable source

When defining our Observable source, let's formalize it by saying that a
`Source` is a function that takes in a `Sink` and either returns nothing or a
function that is run to "clean-up" the source.

```ts
interface Source {
  (sink): void | (() => void);
}
```

We can then use this definition to update our `Counter` Observable:

```js
const Counter = new Observable((observer) => {
  let count = 0;
  let intervalId = null;

  intervalId = setInterval(() => {
    observer.next(count++);
  }, 1000);

  return () => {
    clearInterval(intervalId);
  };
});
```

This update has our source return a function where we clear the active interval
that we have. However, now we have to update our `subscribe` method to take
advantage of this clean-up function.

```ts
class Observable {
  // --- snip ---

  subscribe(observer): Subscription {
    // Keep track of our clean-up function in
    // a local variable
    let cleanup = null;
    let closed = false;

    // Helper function to make sure cleanup is run
    // only once
    function runCleanup() {
      if (cleanup) {
        cleanup();
        cleanup = null;
      }
    }

    const subscription = {
      unsubscribe() {
        if (!closed) {
          closed = true;
          runCleanup();
        }
      },
    };

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
          runCleanup();
        }
      },
      complete() {
        if (!closed) {
          closed = true;
          observer.complete();
          runCleanup();
        }
      },
    };

    cleanup = this.source(sink);

    return subscription;
  }
}
```

And that's it! We added support for a clean-up function by tracking it with the
local variable `cleanup`, and whenever we "close" our subscription we call
`runCleanup` to make sure that this function is called once, and only once.

## Wrapping up

So there we have it. We made an `Observable` class that supports creating and
subscribing to Observables. It's definitely not complete yet, and you'll find
way more robust implementations in libraries like RxJS, but I hope it was
helpful to learn some of the core concepts that go into building this primitive.

If you're curious about more formal definitions for the topics that were touched
on in this post, definitely check-out the appendix below!

### Appendix

#### TypeScript

Here are some of the formal types for the concepts talked about in this post

```ts
interface Subscription {
  unsubscribe: () => void;
}

// In the appendix, you'll see types here annotated as generic
// types over T. T in this case is a placeholder for whatever
// the value is that the Observable emits in `next`
interface Sink<T> {
  next: (value: T) => void;
  error: (err: Error) => void;
  complete: () => void;
}

// Unlike in our post, Source includes Subscription as a return type.
// This is helpful when working with operators or higher
// order observables
interface Source<T> {
  (sink: Sink<T>): void | Subscription | (() => void);
}

// We did not really touch on this in the post, but an observer
// does not have to provide every method we talked about. More
// often than not, it will only include one or two instead of
// all of them.
type Observer<T> = {
  next?: (value: T) => void;
  error?: (err: Error) => void;
  complete?: () => void;
};
```

### Implementation

```ts
export class Observable<T> {
  _source: Source<T>;

  constructor(source: Source<T>) {
    this._source = source;
  }

  subscribe(observer: Observer<T>): Subscription {
    return subscribe(this._source, observer);
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
```
