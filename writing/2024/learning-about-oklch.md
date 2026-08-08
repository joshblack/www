---
title: Looking at OKLCH
description: 'An exploration of the tools and concepts around OKLCH'
categories: ['color', 'design tokens', 'design systems', 'css']
date: 2024-03-27
---

I first learned about `oklch` when exploring tooling for creating palettes in
design systems.

Over at Primer, there was a tool developed called Prism that looked to make it
[easier to build out themes](https://github.blog/2022-06-14-accelerating-github-theme-creation-with-color-tooling/).
This was probably the first time I had ever seen a color palette layed out in
this way, where each grade was a column and the visualization that the tool
produced showed you the curves used to produce each color.

In the case of Prism, the different channels corresponded to `hsl` and so you
could see how these values changed as you went from the first grade in a swatch
all the way to the last one. You could even interact with each curve
individually and immediately see the outcome in the palette.

At the end of the day, I thought this tool was an absolute blast. It introduced
me to new concepts in the color space and I wanted to keep exploring and
learning more about how other design systems thought about this with their color
systems.

## Perceptually Uniform Color Spaces

When exploring how to build tooling in this space, I had a vague memory of a
blog post from Stripe talking about doing this back in 2019. Thankfully,
searching for color systems and Stripe lead me to:
[Designing accessible color systems](https://stripe.com/blog/accessible-color-systems).

I love this post. It has an incredible tooling demo in the "Visualizing color"
section. It also introduced me to the concept of _perceptually uniform color
spaces_. At the time, `hsl` had seemed like the color format to solve all of our
problems. It wasn't until going through this post that I realized that not only
does `hsl` cover the same RGB color model as `rgb` and `hex` but that moving
between colors in this space leads to
[awkward in-between colors](https://raphlinus.github.io/color/2021/01/18/oklab-critique.html).

With this realization, I decided to look more into the CIELAB (or Lab) color
model mentioned in the post. This eventually lead me to `oklch`.

## Introducing oklch

[OKLCH in CSS](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
was the first comprehensive overview I ever read about `oklch` and it was
fantastic. Not only did it try to simplify exactly what `oklch` was but it also
included practically examples for moving towards this format for teams.

It also included a fantastic benefit early on that really caught my attention:

> OKLCH frees designers from the need to manually choose every color. They can
> define a formula, choose a few colors, and **an entire design system palette
> is automatically generated**.

This realization made me immediately want to dive in and start exploring how to
use this very different color space to anything I had previously used.
Thankfully for me, the post also included a fantastic tool over at
[https://oklch.com](https://oklch.com/).

## Color pickers and system builders

## Links & Resources

This is a collection of links from the article plus others that come up that I
find valuable as they relate to OKLCH.

- [Designing accessible color systems](https://stripe.com/blog/accessible-color-systems)
- [A perceptual color space for image processing](https://bottosson.github.io/posts/oklab)
- [OKLCH in CSS](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
- [OKLCH Color Picker](https://oklch.com/)
- [Huetones](https://huetone.ardov.me/)
  - [Huetones GitHub Repo](https://github.com/ardov/huetone)
- [OK LCH, I'm Convinced](https://blog.jim-nielsen.com/2023/ok-lch-im-convinced/)
- [An interactive review of Oklab](https://raphlinus.github.io/color/2021/01/18/oklab-critique.html)
- [LCH colors in CSS: what, why, and how?](https://lea.verou.me/blog/2020/04/lch-colors-in-css-what-why-and-how/)
