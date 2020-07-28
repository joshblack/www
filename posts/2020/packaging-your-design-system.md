---
title: Packaging your design system
---

You might be someone who finally got approval to work on a design system. You're finally at that point where you have a solid collection of components. Or, you could be someone with an established design system looking to learn more about best practices. 

Over in Carbon, the project started out with a single package for all components. Over time, it eventually grew to include a dedicated React library and icon library. Now, we publish over 30 packages and are about to start publishing even more. Why?

## Packaging strategies

There are a couple paths you can take for packaging your components, including:

- A single entry point for all packages
- Per-component packages

I'd like to suggest another technique that we've used for much success (and is by no means new): the fan in approach. 

With tooling, managing the deployment of packages has never been easier along with practices like workspaces. What this sets up for you as a team is the ability to perform local development as if you were working on a single package while working across multiple packages. 

Why even do this, though? What are the challenges you're trying to solve?
