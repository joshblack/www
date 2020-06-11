---
title: Release strategies for design systems
---

Releasing a design system is a problem that starts out relatively simple with plenty of tooling in the space to one that can quickly grow into a release engineering challenge.

As your team and/or the number of teams you're supporing grows, you quickly become faced with a variety of release engineering problems that you'll need to solve.

Top-level notes:

- While your goal should be to have 0 breaking changes, plan to minimize risk (what is risk?)

## Option #1: Don't version your design system

The first rule of release engineering for design systems is that if you can get away with not having to version your library, don't. For a lot of teams, this may be incredibly unreleastic. However, if you're at a company working within a monorepo you may have the opportunity to work on a design system where you don't have to worry about versioning. Instead, you can treat this code as a module or package that is a part of your company's monorepo.

This strategy can present teams with a handful of problems, namely around how do you prevent problems from occuring if your changes break another part of the monorepo. This is one of those situations that seems like a downside to this strategy, but it does effectively make you aware of the surface area of your code at your company. In a versioned world, you would have to wait until after a version is released to learn this insight instead of during the Pull Request phase.

Thankfully changes can still be bucketed in a semver-compatible way with this strategy, and it encourages you and your team to follow best practices for incremental migration of existing code in a way that treats product teams as first-class participants of your design system.

## Option #2: Version your design system

For most teams, this may end up being the path that you take. Versioning is a battled-tested mechanism for shipping a library for a collection of users, but it's not without it's downside. Part of which include:

- Having to develop a strategy around maintenance for versions of your design system
- Dealing with breaking changes

## Packaging your design system

- One big library
- A bunch of small libraries
- One big library composed of a bunch of small libraries

As your library grows, you may end up in situations where you have a team stuck on a previous version. They try to update, but then something else ends up breaking. What can they do? Having fine grained ways to version (e.g. upgrade a single component package) can help them adopt changes incrementally while not having to update the system as a whole
