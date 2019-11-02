---
title: An intro to Deferred
description: Exploring an async primitive in Node.js
---

_Part 1 of an exploration of concurrent programs in Node.js_

The [`Promise` primitive](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
acts as an intermediate step for a value that will eventually be computed. You
can create a new promise using the `Promise` constructor:

```js
const promise = new Promise(resolve => resolve(1));
```

You can use the value of the `Promise` by using the method `then`:

```js
const promise = new Promise(resolve => resolve(1));

// Promise#then
promise.then(value => {
  console.log(value); // 1
});
```

You can also use `async` functions with the `await` keyword:

```js
const promise = new Promise(resolve => resolve(1));

async function main() {
  const value = await promise;
  console.log(value); // 1
  return value;
}
```

`async` functions are a special type of function in JavaScript. If we wanted to
call the `main` function above, we could do the following:

```js
main()
  .then(value => {
    console.log(value); // 1
  })
  .catch(error => {
    console.error(error);
  });
```

In fact, the `main` function returns a `Promise` where we can use `then` or
`async`/`await` in order to get its value.

### Deferred

```js
class Deferred {
  constructor() {
    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  getPromise() {
    return this._promise;
  }

  resolve(value) {
    this._resolve(value);
  }

  reject(error) {
    this._reject(error);
  }
}
```
