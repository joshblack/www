---
title: Iterators and Generators
date: 2020-07-10
---

Iterators and generators are a concept in JavaScript that honestly has never
been a part of my day-to-day job. Despite this, I've been fascinated with
understanding how they work and in what situations could they be helpful for my
work.

At its core, an iterator represent a sequence of values. You can iterate over
these values, write helper functions like `map` or `filter` if you're used to
using them with arrays, or build up on top of these concepts and make libraries
like [iterall](https://github.com/leebyron/iterall).

These concepts apply to anything that implements the
[Iterator protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol),
which is a big part of why this is so interesting to work with. Arrays are one
of the best examples, but you could also see iterators pop up in DOM APIs like
`NodeList`, or can implement the iterator protocol for your own data structures.

## The iterator protocol

You can implement a version of the iterator protocol by having an object with a
method called `next`. This method must return a `done` value as a `boolean`,
along with a `value`.

```js
let count = 0;

const counter = {
  next() {
    return {
      done: false,
      value: count++,
    };
  },
};

counter.next(); // { done: false, value: 0 }
counter.next(); // { done: false, value: 1 }
counter.next(); // { done: false, value: 2 }
```

While this example is an iterator, it is not an `iterable`. An `iterable` is
very similar, it uses the `Symbol.iterator` constant to define a function that
returns an object. This object conforms to the iterator protocol we implemented
above.

Updating our counter from above, this could look like:

```js
const counter = {
  [Symbol.iterator]() {
    let count = 0;
    return {
      next() {
        return {
          done: false,
          value: count++,
        };
      },
    };
  },
};

const iterator = counter[Symbol.iterator]();
iterator.next(); // { done: false, value: 0 }
iterator.next(); // { done: false, value: 1 }
iterator.next(); // { done: false, value: 2 }
```

The big difference between the iterator protocol and being iterable is that we
can create multiple iterators for an iterable. This is done whenever we call the
`Symbol.iterator` method defined on an `iterable`.

## Bring on the generators

While we can always take advantage of `Symbol.iterator` to build up an iterable,
another way we can write one is with a
[generator function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*).

Generator functions have a special syntax, `function*`, and they implement both
the iterable and iterator protocols. You can write them much like a regular
function, but instead of `return` being a way to return one value you use
`yield` to "return" multiple values.

Re-writing our counter as a generator, we could write:

```js
function* counter() {
  let count = 0;
  while (true) {
    yield count++;
  }
}

const iterator = counter();
iterator.next(); // { done: false, value: 0 }
iterator.next(); // { done: false, value: 1 }
iterator.next(); // { done: false, value: 2 }
```

In this example, we create an iterator by calling the generator function. In
this function, the `yield` keyword allows us to specify what is next in the
sequence and is what gets returned whenever `iterator.next()` is called.

While this iterator will continue on forever, we could write it to terminate
after a certain value.

```js
function* counter(until) {
  let count = 0;
  while (count <= until) {
    yield count++;
  }
}

const iterator = counter(2);
iterator.next(); // { done: false, value: 0 }
iterator.next(); // { done: false, value: 1 }
iterator.next(); // { done: false, value: 2 }
iterator.next(); // { done: true, value: undefined }
```

Overall, the best parts of generator functions is that they make it incredibly
easy to build up a value that implements both the iterable and iterator
protocol. It also makes it so that we never have to worry about the return value
for the iterator protocol; when the function is done then the iterator returns
done, as well.

## Why does this matter?

All of the conversation above around iterators and generators feels pretty empty
at first glance. There really isn't a great example here of why this is
important, or why would you want to use them in your day-to-day job. Often
times, posts on the web will talk a lot about the how and maybe not as much
about the why. (this post included!)

At the end of the day, iterators provide a common interface for working with a
variety of data structures. Strings, Arrays, Maps, Sets, and more are great
examples of built-in data structures that implement the iterable and iterator
protocols.

If you're working in the DOM, then you might notice that built-ins like
`document.querySelectorAll` returns iterables like `NodeList`. `NodeList` also
has methods like `keys()`, `entries()`, or `values()` that themselves return
iterators.

Finally, you're able to use all of these tools and tricks to implement these
protocols in your own data structures. This creates a predictable,
developer-friendly to work with your own data structures.

## How would I even use an iterator?

If you've read this far and are convinced to try this whole iterator thing out,
you might be wondering if you would need to call the `.next()` methods you've
seen scattered above.

Thankfully, along with iterators and generators there is now a special
`for...of` statement that you can use to consume iterators. Using our most
recent counter example, we could rewrite it in the following way:

```js
function* counter(until) {
  let count = 0;
  while (count <= until) {
    yield count++;
  }
}

for (const count of counter(2)) {
  // ...
}
```

The `for...of` statement works on any iterable, including custom ones that you
wrote. My favorite example of this is with trees where you can implement tree
traversal algorithms as iterables.

## What's next

While this post was focused on the high-level details of iterators and
generators and why you might use them, the next one will focus on some of the
practical situations you might find yourself in on the next step of your
journey.

The coolest part of this journey will be when we get to async iterators, in
particular when we try to translate concepts like `Promise.all` over into the
async iterator world. Looking forward to it!

<br>

Till next time -- Josh

---

We build up our iterator by calling the function `counter`, and then receive the
next item in the sequence by calling the `next()` method:

```js
const iterator = counter(1, 3);
iterator.next(); // { done: false, value: 1 }
iterator.next(); // { done: false, value: 2 }
iterator.next(); // { done: false, value: 3 }
iterator.next(); // { done: true, value: undefined }
```

Writing our own `next` methods can be cumbersome, so JavaScript introduced the
idea of generator functions with a special `yield` keyword to make constructing
iterators easier.

Re-writing our `counter` example from above, we would get

```js
function* counter(from, until) {
  let count = from;
  while (count <= until) {
    yield count++;
  }
}
```

We could use the `next` function in the same way to pull values. There is a
short-cut or special syntax for this called `for...of`.

```js
for (const count of counter(1, 5)) {
  // ... }
```

The `for...of` statement will work for any object that is `iterable`.

## Working with iterators and arrays

```js
function take(iterator, amount) {
  let count = 0;
  for (const item of iterator) {
    if (count > amount) {
      break;
    }
    yield item;
    count++;
  }
}
```

```js
// Collect
Array.from(iterator);
```

```js
function map(iterator, mapFn) {
  for (const item of iterator) {
    yield mapFn(item);
  }
}

function filter(iterator, fn) {
  for (const item of iterator) {
    if (fn(item)) {
      yield item;
    }
  }
}

function reduce(iterator, reducer, initialValue) {
  let result = initialValue;
  if (!initialValue) {
    const { done, value } = iterator.next();
    if (done) {
      return;
    }
    result = value;
  }

  for (const item of iterator) {
    result = reducer(result, item);
  }

  yield result;
}
```

```js
function merge(...iterators) {
  for (const iterator of iterators) {
    for (const item of iterator) {
      yield item;
    }
  }
}
```

## State

## Implementing for a data structure (tree)

## What's next

Coming up next...async iterators

<br>

Till next time -- Josh
