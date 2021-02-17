---
title: 'Component Composition'
date: 2021-03-01
---

What do you even want to "compose"?

- Pass in props to a component
  - Configure behavior (`onClick`)
  - Configure style (`className`, `style`, etc)
  - `ref`s for focus management
  - Content / Positioning / Layout
  
  
  
How can you compose this stuff??

- Layout / Positioning
  - Allow arbitrary children
  - Accept array and determine layout programmatically
  
It's all about a balance between constraints and flexibility, along with offering escape hatches when your system does not provide what someone needs.
