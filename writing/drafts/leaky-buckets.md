---
title: Leaky Buckets
description: Finding ways to deal with everything that can go wrong
---

- There are few (if any) cases where we can catch 100% of what can go wrong
- Instead, we should look for ways for teams to grow their understanding of what can go wrong, how to identify it, how to remediate it, and how to prevent it
- Sometimes folks can have pre-existing knowledge that they can apply to the problem, but it's important that this is developer with a group and a project over time (no two projects are the same)
- This flow is very similar to things like post mortems, incident reviews, etc
- You want a recurring, regular check-in for talking about things that go wrong
- You want ways to classify what exactly went wrong (areas plus details are a great place to start)
- Identify ways to address them or tackle them at the source (whether through reviews, linters, tests, tooling, etc)
- Know that, no matter what, you'll likely never hit 100% (but you can try) and each step will get you closer
- Examples for design system causes (template issues?)
- A big challenge with this is reducing your surface area to _exactly what you need_
- This can be incredibly hard for front-end projects like design systems because of Hyrum's law
- Things like class names, specific CSS properties (like flexbox), position, z-index, internal semantics, etc all complicate this
- Ideally teams follow a rule that they only test with what they know (meaning they only use information that they've given to the component)
- Some things, like styles, will need to be specifically tested for to prevent regressions (like changing a flex layout that accepts children)
- Maintain some kind of versioning guide so that it's clear when something follows semver versus not
- Ideally, develop tooling to check against unintended usage
- Find ways for folks to opt-out safely, when needed
