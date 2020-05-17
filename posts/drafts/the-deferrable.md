---
title: The Deferrable
description: How to build a Deferrable in JavaScript
status: draft
---

Getting first-class support for a `Promise` in JavaScript was awesome. The usage
of Promises have really helped to tackle the asynchronous nature of the things
we do on the web, and in Node.js. While Promises do bring a lot to the table, it
isn't necessarily the end-all, be-all of asynchronous programming. Observables
are a great example of another incredibly useful concept in this space.

One concept close to the idea of a `Promise` is the deferabble, or the Deferred.
This pattern allows you to control when a promise is fulfilled or rejected and
can be useful for coordinating between asynchronous processes or decorating
promises like you would functions or objects.

## How to make a Deferabble

One implementation of `Deferred` may look like the following:

```js
// Deferred.js
export function create() {
  let resolve;
  let reject;
  let promise = new Promise((deferredResolve, deferredReject) => {
    resolve = deferredResolve;
    reject = deferredReject;
  });
  return [promise, resolve, reject];
}
```

With this approach, we take advantage of the fact that a `Promise` is eager and
will evaluate the given callback, allowing us to assign the promise's native
`resolve` and `reject` values to variables that we have in scope.

Creating and using a `Deferred` with this method would look like the following:

```js
// index.js
import * as Deferred from './Deferred';

async function main() {
  const [promise, resolve, reject] = Deferred.create();

  // At this point, the Promise is pending until we
  // manually call `resolve` or `reject`
  setTimeout(() => {
    resolve();
  }, 1000:

  // We can still use and interact with the promise
  // like we would with other promises
  await promise;
}
```

You can also construct a `Deferred` with a `class` in the following way:

```js
// Deferred.js
export default class Deferred {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  catch(...args) {
    return Promise.prototype.catch.apply(this.promise, args);
  }

  then(...args) {
    return Promise.prototype.then.apply(this.promise, args);
  }
}
```

The usage of this class would be similar to `Deferred.create`, but instead you
can treat the `deferred` as a promise (or thenable) directly:

```js
import Deferred from './Deferred';

async function main() {
  const deferred = new Deferred();

  setTimeout(() => {
    deferred.resolve();
  }, 1000:

  await deferred;
}
```

Both implementations allow you to access the underlying promise and
resolve/reject methods, but the class-based implementation will allow you to
treat the returned value like a promise.

## When would I use this?

A `Deferred` value is helpful when you want to use application logic to
determine when a `Promise`, or thenable, should resolve. This is distinct from a
traditional use-case of a `Promise` where it is tied to CPU or I/O bound work,
like a network request using `fetch`.

In the case of a network request, you are unable to control when the `Promise`
is fulfilled or rejected. The state of the `Promise` is tied to the resource for
which you made the request.

By contrast, a `Deferred` value will be resolved when you as the programmer
decide it should be resolved.

This fact is particularly useful in two situations:

- When you want to handle coordination between parts of your codebase, enabling
  processes to proceed under conditions defined by your application
- When you want to add additional behavior to a `Promise`, like retrying a
  network request until it resolves

### Coordinating concurrent processes

As the amount of asynchronous JavaScript that one writes increases, you may find
yourself running into classic concurrency control problems like
[mutual exclusion](https://en.wikipedia.org/wiki/Mutual_exclusion). In
particular, when relying on patterns like `Promise.all` to coordinate a set of
tasks that may all want to work on a shared resource.

An arbitrary example of this may be a counter, where each operation is suspended
for a random period of time.

```js
// Suspend for an arbitrary amount of time,
// ranging from 0 to 1000ms
function sleep() {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 1000);
  });
}

async function main() {
  // The current count is considered our shared
  // resource
  let count = 0;

  // Each of our operations on `count` will
  // suspend for a random amount of time before
  // mutating the value of `count`
  async function add(amount) {
    await sleep();
    count = count + amount;
  }

  async function multiply(amount) {
    await sleep();
    count = count * amount;
  }

  // Wait for all of our operations to finish
  await Promise.all([add(1), add(2), multiply(3)]);

  // What values could `count` take on here?
  console.log(count);
}
```

In a synchronous world, we would expect the final value of `count` to be
`(0 + 1 + 2) * 3 = 9`. However, now that each process (in this case `add` or
`multiply`) will have to wait for an arbitrary amount of time we could have the
following possible outcomes:

| First         | Second        | Third         | `count` |
| ------------- | ------------- | ------------- | ------- |
| `add(1)`      | `add(2)`      | `multiply(3)` | `9`     |
| `add(1)`      | `multiply(3)` | `add(2)`      | `5`     |
| `add(2)`      | `add(1)`      | `multiply(3)` | `9`     |
| `add(2)`      | `multiply(3)` | `add(1)`      | `7`     |
| `multiply(3)` | `add(1)`      | `add(2)`      | `3`     |
| `multiply(3)` | `add(2)`      | `add(1)`      | `3`     |

This could be an excellent reason for choosing not to use `Promise.all` and
instead process these promises sequentially. Clearly the order of operations
matters if we care about getting a consistent outcome and running these
operations in parallel doesn't make much sense because of that property.

However, if we imagine that we still wanted to use `Promise.all` because most of
the work could be ran in parallel what could we do? Would we want to pull out
specific promises into specific collections that we process either in series or
in parallel? What if we couldn't tell to which group a promise belonged? While
this example is contrived, I hope that there is some flexibility here for
motivating the problem where we have a shared resource that multiple processes
are trying to mutate.

If we want deterministic ordering here, we could take advantage of the fact that
a `Promise` is eager (similar to how we created a `Deferred` value above) and
take advantage of a `Mutex` to control access to the shared `count` value.

### The `Mutex` class

A `Mutex` in this example is going to be our attempt to tackle the mutual
exclusion problem. It takes on the following shape:

```ts
interface Mutex {
  lock(): Promise<void>;
  unlock(): void;
}
```

We would create a `Mutex` for each resource for which we want to control access
across processes. Each process would then call `mutex.lock()` before beginning
the work it needs to accomplish. When it's done, the process would finally call
`mutex.unlock()` to free up the resource.

```js
export async function worker(mutex) {
  await mutex.lock();

  // Perform some work

  mutex.unlock;
}
```

It's important to note that the call to `await mutex.lock()` guarantees that
only one `worker` is interacting with the shared resource at one point in time.
This method ends up returning a promise generated by our `Deferred` helpers from
above. It is resolved when our base `Mutex` class decides that it's time for the
next worker to perform some work. At this point, the `Mutex` class will
programmatically call the `resolve` counterpart for a worker's `Deferred` value
which will free up the worker to perform work on the resource.

Based on this behavior, a `Mutex` class can be implemented in the following
fashion:

```js
// Mutex.js
import * as Deferred from './Deferred';

export class Mutex {
  constructor() {
    // We store all requests to `mutex.lock()`
    // in a queue of requests. This queue holds the
    // `resolve` values from `Deferred.create()`
    this._lockRequests = [];
    this._locked = false;
  }

  lock() {
    // If the mutex is not locked, we can resolve immediately
    if (this._locked === false) {
      this._locked = true;
      return;
    }

    // Otherwise, we create a promise and resolve pair
    // using `Deferred.create()`.
    //
    // The `promise` is returned to the caller of `mutex.lock()`
    // and `resolve` is programmatically called in `unlock` below
    const [promise, resolve] = Deferred.create();
    this._lockRequests.push(resolve);
    return promise;
  }

  unlock() {
    // When a worker is done, it should call `mutex.unlock()`
    // This tells the mutex to try and process the next
    // lock request.
    //
    // Grabbing the first value will give us the corresponding
    // `resolve` which we can call to resolve the promise
    // given to the worker by `mutex.lock`
    if (this._lockRequests.length > 0) {
      const processRequest = this._lockRequests.shift();
      processRequest();
      return;
    }

    this._locked = false;
  }
}
```

### Bringing it together

Now that we've implemented a `Mutex` class, we can update our example above to
have each process (`add` and `multiply`) call out to the `mutex` that protects
the shared `count` value.

```js
import { Mutex } from './Mutex';

async function main() {
  const mutex = new Mutex();
  let count = 0;

  async function add(amount) {
    await mutex.lock();

    await sleep();
    count = count + amount;

    mutex.unlock();
  }

  async function multiply(amount) {
    await mutex.lock();

    await sleep();
    count = count * amount;

    mutex.unlock();
  }

  await Promise.all([add(1), add(2), multiply(3)]);

  console.log(count); // 9
}
```

Each call to `add` and `multiply` now locks the `count` resource from being
modified by any other calls to `add` or `multiply`. The calls are then processed
in order, and at the end of each `mutex.unlock()` is called which frees the next
operation to run.

While this example could clearly be updated to have each operation run in
series, I hope this shows how we can use a `Deferred` to control exactly when a
`Promise` gets resolved.

In this case, we create a `Promise` through `mutex.lock()` and we control
exactly when that promised is resolved based on the order in which
`mutex.lock()` was called in the program. If it was called second, it'll resolve
second. If it was called last, it'll resolve last. The best part is that we
control exactly when these values are resolved by calling the `Deferred`'s
resolve value in our base `Mutex` class.

---

This is a great point to stop reading, Abbey!

---

### Adding behavior to a `Promise`

A `Promise` by itself represents a value that will eventually be resolved,
either by being fulfilled or rejected. In the previous section, we talked about
how to control the resolution of a `Promise`, but what if we wanted to change
the behavior of a `Promise`?

For example, imagine we are working on a library that makes network requests to
an API. This could be something that runs on the front-end, or the back-end, we
just know that it uses something like `fetch` to make a request and returns a
response.

While we work on this library, we may notice that sometimes the requests that
we're making don't always succeed. Sometimes this is totally due to application
or user error, but sometimes it just seems like the requests fail sporadically
either due to connectivity issues or something else going on in the request
chain.

At this point, you decide to implement a retry mechanism for your network
request, thinking that if you just re-sent the request most of the time it will
succeed the second time.

In your library, you may start out writing something that looks like:

```js
function fetchWithRetries(url, options = {}) {
  const { maxAttempts = 3, ...fetchOptions } = options;

  return fetch(url, fetchOptions).catch((error) => {
    // What now???
  });
}
```

This hits at one of the fundamental challenges we run into while working with a
`Promise`: once it has been resolved it's state will never change.

To get around this limitation, we could have our function return a `Promise` and
then make the call to `fetch` separately.

```js
const MAX_ATTEMPTS_ERROR = new Error('Maximum number of attempts exceeded');

function fetchWithRetries(url, options = {}) {
  const { maxAttempts = 3, ...fetchOptions } = options;

  return new Promise((resolve, reject) => {
    let numAttempts = 0;

    function attempt() {
      if (numAttempts >= attempts) {
        reject(MAX_ATTEMPTS_ERROR);
        return;
      }

      fetch(url, fetchOptions)
        .then(resolve, () => {
          numAttempts += 1;
          attempt();
        })
        .catch(reject);
    }

    attempt();
  });
}
```

If we look closely, we notice that this pattern is very similar to our previous
`Deferred` patterns. We create a `Promise` and return it directly. This
`Promise` is resolved based on application-level logic, in this case we are
attempting the request multiple times.

If we wanted to refactor this piece of code to use a `Deferred`, this would
become:

```js
import * as Deferred from './Deferred';

const MAX_ATTEMPTS_ERROR = new Error('Maximum number of attempts exceeded');

function fetchWithRetries(url, options = {}) {
  const { maxAttempts = 3, ...fetchOptions } = options;
  const [promise, resolve, reject] = Deferred.create();

  let numAttempts = 0;

  function attempt() {
    if (numAttempts >= attempts) {
      reject(MAX_ATTEMPTS_ERROR);
      return;
    }

    fetch(url, fetchOptions)
      .then(resolve, () => {
        numAttempts += 1;
        attempt();
      })
      .catch(reject);
  }

  attempt();

  return promise;
}
```

If we took it one step further, we could abstract this pattern into a `retry`
function that takes on the shape:

```ts
type RetryFn<T> = (() => Promise<T>, maxAttempts: Number) => Promise<T> | Error;
```

For example:

```js
// helpers.js
import * as Deferred from './Deferred';

const MAX_ATTEMPTS_ERROR = new Error('Maximum number of attempts exceeded');

export function retry(makePromise, maxAttempts) {
  const [promise, resolve, reject] = Deferred.create();
  let numAttempts = 0;

  function attempt() {
    if (numAttempts >= attempts) {
      reject(MAX_ATTEMPTS_ERROR);
      return;
    }

    makePromise()
      .then(resolve, () => {
        numAttempts += 1;
        attempt();
      })
      .catch(reject);
  }

  attempt();

  return promise;
}
```

And then we could use this in our `fetchWithRetries` helper:

```js
import { retry } from './helpers';

function fetchWithRetries(url, options = {}) {
  const { maxAttempts = 3, ...fetchOptions } = options;
  return retry(() => fetch(url, fetchOptions), maxAttempts);
}
```
