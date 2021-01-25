---
title: 'Atomic CSS could be a great fit for a Design System'
date: 2021-01-01
---

Some of the challenges that we're experiencing on Carbon:

- Large style sheets
  - Large Sass Compilation times
  - Can't just add the styles, you have to specifically pick certain components
- Managing overrides
  - Sometimes teams will target selectors and override them in ways we don't anticipate
    - Override stuff for height or display
    - Override selectors that include markup that changes to match specificity
  - Breaks encapsulation, there is no rule for how to interface
  
What does Atomic CSS give us:

- Smaller style sheets based on usage
- Depending on bundle concerns, we can just have folks include the library
- We can provide selectors for teams to target that are a part of our public API (or custom properties)
- Specificity for selectors are now all equal

Where Atomic CSS still falls short (for me):

- Building complex styles can make class names complicated
- Hard to create interop with other teams (previously used selectors as ways to share for other implementation)
