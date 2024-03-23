---
title: 'Building an LRU cache'
description: 'Learn how to make an LRU cache in JavaScript'
date: 2020-11-01
categories: []
---

An LRU Cache is a solid next step when you're trying to implement a cache but
don't want to run out of memory as you save more and more items in your cache.

The strategy behind how to determine what to remove from the cache comes from
the name: LRU (Least Recently Used). As we add more items to our cache, and run
out of space, we remove items that we haven't used in a while.

While in other languages we may dive into data structures to implement this kind
of cache, in JavaScript we can leverage some properties of `Map` to build up a
minimal implementation of an LRU Cache.

## Building the LRU Cache

At it's core, when we make an LRU Cache we need two things: a `capacity`, so
that we know when our cache is full, and a Map that we can use as the cache
itself. We can build out the skeleton of our LRU Cache using a class:

```js
class LRUCache {
  constructor(capacity) {
    this.cache = new Map();
    this.capacity = capacity;
  }
}

// Woohoo! We're done, right? 😅
// Fun(?) detail, 5e3 is short-hand for 5000
const cache = new LRUCache(5e3);
```

Next up, we would need to mirror the methods that we would expect to get from a
Map:

- `has` to check if the cache has an entry for a given key
- `get` to get a value from the cache for a given key (if it exists)
- `set` to set a value in the cache with a given key.

We should be able to use these methods in the same way we would with a Map:

```js
const cache = new LRUCache(3);

cache.has('a'); // false
cache.set('a', 1);
cache.has('a'); // true
cache.get('a'); // 1
```

Going back to our class above, we can use the underlying Map that we have to
emulate this behavior:

```js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  has(key) {
    return this.cache.has(key);
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, value) {
    this.cache.set(key, value);
  }
}
```

However, we run into a problem when we add more items to a cache than the
capacity that we specify when we create an `LRUCache`:

```js
const cache = new LRUCache(3);

cache.set('a', 1);
cache.set('b', 2);
cache.set('c', 3);
cache.set('d', 4);

console.log(cache); // Map { 'a' => 1, 'b' => 2, 'c' => 3, 'd' => 4 }
```

Looking at `cache` after we add our fourth item (our cache is only supposed to
hold 3!) it becomes very clear that we just are adding items to our Map, but
we're never removing items if they exceed the capacity.

### Removing items from our LRU Cache

Let's see if we can update our `set` method to remove an item from our cache if
we have too many items.

To start off, we can use the `size` property on a Map to know how many items we
have stored in it. We can then compare this to the capacity capacity, but how
will we know what item to remove?

```js
class LRUCache {
  // --- snip ---

  set(key, value) {
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      // What should we remove from our cache?
    }
  }

  // --- snip ---
}
```

Thankfully, we can make use of an interesting property for Maps in JavaScript.
It turns out that we can get the keys for a Map by using the `keys()` method,
which returns an iterator. The order of the keys that we get from this iterator
match the order in which they were added to the Map.

Breaking this down, it looks like:

```js
const m = new Map();

m.set('a', 1);
m.set('b', 2);
m.set('c', 3);

// [Map Iterator] { 'a', 'b', 'c' }
console.log(m.keys());

// Iterators have a .next() method which will return
// an object like the following
// { done: false, value: 'a' }
console.log(m.next());
```

Going back to our `set` method, we can use this `keys()` trick to get the oldest
item and remove it from our Map.

```js
class LRUCache {
  // --- snip ---

  set(key, value) {
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      const { done, value } = this.cache.keys().next();
      if (!done) {
        this.cache.delete(value);
      }
    }
  }

  // --- snip ---
}
```

And this works great! If ever have too many items in our cache, and we try to
add more, then we will remove an item to make up for it.

However, there is one last catch to finish up our LRU Cache. While it's true
that we're removing the oldest item from our cache, it may still be removing an
item that is being used. Here's a quick example:

```js
// We only allow two items in our cache
const cache = new LRUCache(2);

cache.set('a', 1);
cache.set('b', 2);

// The item with the key of 'a' is "most recently used"
const value = cache.get('a');

// However, when we add a new entry, then 'a' is
// removed. We would have expected 'b' to be gone
// since we just used 'a'
cache.set('c', 3);
console.log(cache.has('a')); // false
```

As it turns out, right now our LRU Cache is more like a "Least recently added"
cache. In the example above, we end up evicting the first thing added to the
cache, not the item which was hasn't been accessed in a while.

### Marking something as used

So, what's the trick? How do we mark something as "used" in our least-recently
used cache?

For our use-case, we're going to say that something is "used" when it is
retrieved using the `get` method. From our `keys()` trick from above, we know
that the order of keys is derived from the order in which things are added to
our Map. We can use this to re-write our `get` method to set our value again to
move it to the end of the list, effectively giving us our LRU Cache.

```js
class LRUCache {
  // --- snip ---

  get(key) {
    const value = this.cache.get(key);
    if (value) {
      // Here we remove our item from the cache, and then
      // add it back again to re-order the keys
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  // --- snip ---
}
```

And there we have it! An implementation of an LRU Cache. Putting it all
together, it looks like:

```js
class LRUCache {
  constructor(capacity) {
    this.cache = new Map();
    this.capacity = capacity;
  }

  has(key) {
    return this.cache.has(key);
  }

  get(key) {
    const value = this.cache.get(key);
    if (value) {
      // Here we remove our item from the cache, and then
      // add it back again to re-order the keys
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key, value) {
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      const { done, value } = this.cache.keys().next();
      if (!done) {
        this.cache.delete(value);
      }
    }
  }
}
```

## Wrapping up

In this post, we talked about a particular type of cache eviction algorithm
called Least Recently Used (LRU) and implemented it in what we called
`LRUCache`.

Using this type of cache is helpful if you want to cap the number of items you
keep in your cache. Limiting items in a cache can be helpful for performance,
namely by limiting the amount of memory the cache takes up. This also has the
added benefit of working for long-running applications where the cache can grow
over a long period of time.

Either way, I hope it was fun taking a quick look at a way to implement this
type of cache in JavaScript! Hope you find it helpful for whatever project
you're working on.
