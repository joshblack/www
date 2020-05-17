---
title: Tokens helpers for design systems
status: draft
---

Outline

All tokens follow the following format:

1. List or map (map is great for named things)
2. Function to get the value (useful for product teams)
3. Mixins for multiple values (sometimes can happen)
4. Classes for utility CSS (some teams love it)

Sass has a great feature where you can overload an identifier in a scope and
depending on how you call it it will figure out the right thing to call.

For example:

```scss
@use 'sass:list';

$font-sizes: (16px, 20px, 24px);

@function font-size($step) {
  @return layout.rem(list.nth($font-size-scale, $step + 1));
}

@mixin font-size($step) {
  font-size: font-size($step);
}

@for $i from 0 through list.length($font-size-scale) - 1 {
  .text-#{$i} {
    @include font-size($i);
  }
}
```

Note: would be cool to then take this idea and apply it to CSS Custom Properties
and how this could relate. Topics would include:

- How to support both CSS Custom Properties and fallbacks
- How to emit values from a mixin
