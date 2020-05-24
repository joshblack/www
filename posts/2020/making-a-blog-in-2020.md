---
title: Making a blog in 2020
date: 2020-06-24
description: Making a blog in 2020 seems way harder than it should be
---

Making a blog in 2020 seems way harder than it should be. A lot of this damage is completely self-inflicted, but some of it comes down to just how many decisions one needs to make to launch even the simplest personal dotcom.

Coming from the front-end world, you may find a proliferation of static-site generators, in particular Gatsby, on the scene. If you're coming from the back-end world, there are a ton of equivalent tools either in frameworks or similar static-site generators.

For some folks, neither option makes sense. HTML and CSS are great and you don't really need all these tools to write your own blog. I think that there is some amount of truth to that, but ultimately that it can undercut how hard it is to get something up online that you feel proud of.

## The first big decision

Part of me was tempted to begin this section with a breakdown of Gatsby, Next.js, etc. I even wrote a couple of lines before realizing that I was jumping the gun when it came to why you build sites.

At the end of the day, the first big decision is around what you hope to accomplish with the site. Is it something personal, just for you? It is to help grow your eminence or career? Is it the beginning of a community that you're hoping to establish?

Ultimately, the answer to this question should be the thing that determines what technical solution you pick. Some of these tools are better than others at certain things as everything is a trade-off for something else.

For me, this blog was very much so a personal space. I wanted room to experiment, to write honestly, and try out things that I'm interested in.

## The first big (technical) decision

Originally, this site was built using Gatsby. Gatsby is an awesome static-site generator that we use extensively over on Carbon. Yet, something about that decision didn't quite land when revising what I was going to do with this site. Part of this was due to a developing personal interest in Next.js, and other parts were due to our experience using it at work.

**Spoiler alert:** I totally ended up picking Next.js and rewrote the site. But before I get into that, I wanted to share that I think Gatsby has an incredible experience for getting up-and-running with markdown-based blogs. I noticed this quickly after starting a Next.js site and I realized that there wasn't something simple / out-of-the-box for getting pages written in markdown up on the site.

In addition, there is a great amount of work on the glue going between markdown and the end result on the page. This could include image optimization, enhancements around codeblocks for syntax highlighting, and just so much more than I'm sure I've yet to run into. I love these parts of Gatsby and quickly tried my best to integrate them into Next.js.

### Next.js is kind of awesome?

The turning point for me with Next.js and Gatsby was realizing that Next.js could sit in the middle-ground between full static-site generator and server runtime. With the release of Next.js 9.3, there were a host of static improvements that really helped me understand what they were trying to go for with the framework. As the build times of our Gatsby sites at work grew, it started to dawn on me that fully static sites are ultimately bound by the number of pages they have to build. In comparison, Next.js could offer me a way to both do a full static build or pick-and-choose which things I wanted static at compile time.

The other big one for me with Next.js was that I could do API endpoints in the `api` folder. While going fully static was enticing, I realized with some of the stuff I was planning to do with the site that I wanted certain endpoints available and cloud function endpoints weren't something I was interesting in using to accomplish that along with a static site.

However, this decision to switch over to Next.js wasn't without taking the hit on some of Gatsby's amazing features out-of-the-box. Dipping into Next.js, I quickly realized that there was a good amount of work I would need to do in order to get back some of this functionality.

### Bringing parts of Gatsby into Next.js

## Finding the right place to deploy

## Everything else

## Looking back

<br>

Till next time -- Josh
