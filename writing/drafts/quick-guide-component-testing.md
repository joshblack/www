---
title: 'Quick Guide to Component Testing'
description: 'Areas to consider when testing your components in a design system'
date: 2024-06-01
categories: ['design systems']
---

Checklist

- Supports rendering `children`
- Spreads props onto outermost element (e.g. `data-testid`, `className`)
- Test each prop value if the type is an enum
- If there is a default value, test that (this makes sure it doesn't change in the future if that's considered a breaking change)
