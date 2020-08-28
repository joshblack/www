---
title: 'Rust for JavaScript Developers: Ownership'
date: 2020-08-30
---

Getting into Rust from JavaScript can be challenging at times. One of the harder
concepts you encounter early on when writing Rust is the idea of **ownership**.

Coming from a JavaScript background, it can be challenging to translate certain
patterns or concepts that are prevalent from this ecosystem into Rust.

For example, let's make a `Counter` class:

```js
class Counter {
  constructor() {
    this.count = 0;
  }

  increment() {
    this.count += 1;
  }

  decrement() {
    this.count -= 1;
  }
}
```

In JavaScript, we know that we can make new instances of this class by calling
`new Counter()` and that this instance will have the methods `increment` and
`decrement` to update the internal `count` property. What would this look like
in Rust, and how does ownership come into play?

## Building a `struct` in Rust

Whenever you think of writing a `class` in JavaScript, you will likely want a
`struct` in Rust. A `struct` is similar to objects that you would find in
JavaScript, with one big difference being that they must be explicitly typed.

For example, in JavaScript we can create an object by writing the following:

```js
const counter = { count: 0 };
```

In Rust, we would have something that looks more like:

```rust
struct Counter {
  // Note: i32 is the type for the count field in the Counter struct.
  // It represents signed (postive and negative) integers in Rust
  count: i32,
}

fn main() {
  let counter = Counter { count: 0 };
}
```

These forms are roughly equivalent, but there is a big difference in terms of
how you can interact with `count` in either language.

### Immutable vs mutable

In JavaScript, you can mutate `count` directly in the object, or the `Counter`
class we made above.

```js
const counter = { count: 0 };

counter.count = 2;
```

If we tried to do something similar in Rust, however, we would run into the
following problem:

```rust
fn main() {
  let counter = Counter { count: 0 };
  // error[E0594]: cannot assign to `counter.count`, as `counter` is
  //               not declared as mutable
  counter.count = 1;
}
```

Here, we see that Rust considers the value of `counter` to be **immutable** and
so it cannot be changed unless it's declared as mutable.

Surprisingly, if you're coming from the JavaScript side you might have expected
this to be the way `const` worked. However, in JavaScript what `const` provides
is an immutable reference to a value, not that the value itself is immutable.

This means that while we can't reassign the `const` variable, its value can
still potentially change.

```js
const count = 1;
// TypeError: Assignment to constant variable.
count = 2;

const counter = { count: 0 };
// Totally works
counter.count = 1;
```

In Rust, **values are immutable by default**. This means that we can't change
any of `counter`'s properties, unless we define the value as mutable.
Thankfully, we can update our source code to use `let mut` to define our
`counter` as mutable:

```rust
fn main() {
  let mut counter = Counter { count: 0 };
  counter.count = 1;
}
```

## Adding in some instance methods

We've played around with making a `struct`, basing it on objects in JavaScript,
but what about the `Counter` class? How do we get there?

In JavaScript, we create new instances of a class using the `new` operator,
meaning that `new Counter()` gives us another instance of a counter. This will
then call the `constructor` for the `Counter` class before returning the class
instance.

We can do something similar in Rust by using the `impl` block for the `Counter`
type:

```rust
impl Counter {
  fn new() -> Self {
    Self { count: 0 }
  }
}

fn main() {
  let mut counter = Counter::new();
  counter.count = 1;
}
```

Here, we add an _associated function_ to the `impl` block for the `Counter`
type. From a JavaScript perspective, this is similar to a static method on a
class. We can call it using `Counter::new()` and it will give us back a
`Counter` struct like we saw before, very similar to a `constructor` in
JavaScript.

_Note: the associated function specifies that it returns `Self` over in:
`fn new() -> Self`. Here, `Self` refers to the type that the `impl` is for, in
this case `Counter`_

If we wanted to add in our instance methods `increment` and `decrement`, we
would do something similar but this time we include the `self` argument. Inside
of our `impl` block, if a function takes in `self` then we can call it using a
method-call syntax, like `counter.increment()`.

```rust
struct Counter {
  count: i32,
}

impl Counter {
  fn new() -> Self {
    Self { count: 0 }
  }

  fn increment(self) {
    self.count += 1;
  }
}

fn main() {
  let mut counter = Counter::new();
  counter.increment();
}
```

However, we run into a problem here. When running the program, we would see this
error for `increment`:

```rust
impl Counter {
  fn new() -> Self {
    Self { count: 0 }
  }

  // error[E0594]: cannot assign to `self.count`, as `self` is not
  //               declared as mutable
  fn increment(self) {
    self.count += 1;
  }
}
```

Turns out, we ran into the same problem that we had with `let counter`. Here,
`self` is immutable and we can't change it's value. We can turn this to a
mutable reference by using `&mut self`:

```rust
impl Counter {
  fn new() -> Self {
    Self { count: 0 }
  }

  // ✅
  fn increment(&mut self) {
    self.count += 1;
  }

  fn decrement(&mut self) {
    self.count -= 1;
  }
}

fn main() {
  let mut counter = Counter::new();
  counter.increment();
}
```

## Bringing ownership into the picture

So, what's going on here? Why is this even related to ownership in the first
place if we can change the type signatures and everything works?

One of the most interesting parts about this program when learning about
ownership in Rust is when we change `let mut counter` to `let counter`.

If you're trying to translate this from a JavaScript background, it would
totally make sense that one would think this would work. We don't want the
`counter` to change, but each of the instance methods can totally change the
internal structure.

When we run the program with this change, we get the following message:

```rust
fn main() {
  let counter = Counter::new();
  // error[E0596]: cannot borrow `counter` as mutable, as it is not
  //               declared as mutable
  counter.increment();
}
```

Wait, what? What is this `borrow` and why is it coming up now?

As it turns out, all of the functions and values that we are working with will
have to follow Rust's rules of **ownership**. When we call `increment`,
`counter` is _moved_ to the `increment` method.

We could illustrate this clearly if we changed `increment` back to when it took
in `self`:

```rust
impl Counter {
  fn new() -> Self {
    Self { count: 0 }
  }

  fn increment(self) {
    println!("{}", self.count);
  }
}

fn main() {
  let counter = Counter::new();
  counter.increment();

  // error[E0382]: borrow of moved value: `counter`
  println("{:?}", counter);
}
```

When the `counter` value is moved to the `increment` method, our `main` function
no longer has ownership over them. This falls in line with Rust's
[rules of ownership](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#ownership-rules):

- Each value in Rust has a variable that’s called its owner.
- There can only be one owner at a time.

In our `main` function, `counter` is the owner of the value from
`Counter::new()`. The owner of `counter` is then moved to the `increment` method
and then dropped from the scope.

As a result, when we use `println!` to try and print the value we get an error.
In this case, we are trying to borrow a value that has already moved.

## Rewinding to the solution

So we had a solution above that seemed to work, and then we talked about some
problems that came up with ownership by changing the solution. How could we
rewind from where we are to understand why each piece of our implementation not
only works but why it works in terms of ownership?

First up, let's try and change the type of the `self` argument in `increment`.
When it is specified as `self`, we know that its immutable and that it takes
ownership of `self`. If we don't want to take ownership of a value, and instead
want to borrow it, we can use the mutable reference type (`&mut`) that we saw in
the solution.

Here, we use a mutable reference to borrow an owned value (in this case, our
`counter`):

```rust
impl Counter {
  fn new() -> Self {
    Self { count: 0 }
  }

  fn increment(&mut self) {
    self.count += 1;
  }
}

fn main() {
  let counter = Counter::new();
  counter.increment();

  // error[E0382]: borrow of moved value: `counter`
  println("{:?}", counter);
}
```

When we run this code we get an error similar to the one we got before:

```rust
fn main() {
  let counter = Counter::new();
  // error[E0596]: cannot borrow `counter` as mutable, as it is
  //                not declared as mutable
  counter.increment();

  println("{:?}", counter);
}
```

Now, we know that `increment` is trying to borrow `counter` and we can update
the type from `let` to `let mut`:

```rust
fn main() {
  let mut counter = Counter::new();
  counter.increment();

  println("{:?}", counter);
}
```

## Wrapping up

Ownership in Rust can be tricky sometimes, but using it is well worth the
trade-off. Here, we touched on some parts of Rust and JavaScript like
immutability and ownership.

In the end, we hopefully came to a spot where we feel confident in translating
some of the concepts that we might find in a JavaScript codebase over to a Rust
codebase.

<br>

Till next time -- Josh
