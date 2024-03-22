---
title: Things you missed when moving to a Monorepo
description: ''
categories: []
---

- Broken links from your website
- Broken links from your docs
- Examples that used specific file paths in your repo (like if using codesandbox
  to generate them)
- Publishing steps, versioning steps
- CI jobs that don't run on `main`
- Anything that depends on a specific `package.json` path from your old main
  package
