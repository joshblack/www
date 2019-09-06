---
title: A brave new asynchronous world
description: Exploring traditionally async concepts in Node.js
---

## Introduction

Working through a variety of languages, it might be a struggle to think about
why individuals would want to use Node.js over other server-side languages like
the classics Java and PHP, or the new kids on the block like Golang, Elixir,
Rust, and more.

However, over the past few years Node.js has created a niche for itself at the
UI application level. The ability to interop between JavaScript on the client
and server can result in quite a number of wins. It also can enable important
use-cases like pre-rendering a Single Page Application.

In addition, the proliferation of CLI-based tooling using Node.js has shown that
their is definitely an appetite to do serious work outside of a server context
using this technology.

## Mutual exclusion

### Mutex

```js
class Mutex {
  constructor() {
    this._locked = false;
    this._waiters = [];
  }

  async lock() {
    if (this._locked) {
      const deferred = new Deferred();
      this._waiters.push(deferred);
      return deferred.getPromise();
    }
    this._locked = true;
  }

  unlock() {
    if (this._waiters.length > 0) {
      const waiter = this._waiters.shift();
      waiter.resolve();
      return;
    }
    this._locked = false;
  }
}
```

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
