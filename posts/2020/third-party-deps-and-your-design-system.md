---
title: 'Third party components and your Design System'
date: 2021-02-01
---

- Bringing in third party components to your design system totally makes sense
- Your team is limited, there is a much bigger ecosystem out there for your framework of choice, it seems logical
- So, what's the catch?
- Depending on the third party component or library, you may be tempted to expose options to your user to configure the library or component (downshift is our example over on carbon)
- This isn't necessarily a problem, but it can result in some, namely:
  - Your major versions are now tied to the library's major versions (unless you want to invest in interop between versions)
  - Your API is now Downshifts API (tied into the point above too)
  - It makes it harder to move away from using the library as more code is tied into the library
- What can you do about it?
  - Offer recipes and examples that use your styled components with libraries of the day
  - Don't expose ways to interact with the library from consumers, only use it to power use-cases that you want your component to have
