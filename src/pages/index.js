import Link from 'next/link';
import * as React from 'react';
import Page from '../components/Page';

export default function Home() {
  return (
    <Page className="home">
      <article>
        <h1 className="home__title">
          Hi there!&nbsp;<span aria-label="Wave">👋</span>
        </h1>
        <p className="home__text">
          My name is Josh Black. I build{' '}
          <a
            href="https://primer.style"
            rel="noopener
                noreferrer">
            design systems at GitHub.
          </a>
        </p>
        <p className="home__text">
          This site is a growing collection of my thoughts and experiences while
          working on software. Some of it is short or incomplete, others are
          ideas that turned out to be completely wrong. My hope is that by
          sharing my personal journey I can help others in some way.
        </p>
        <p className="home__text">
          I write most often about design systems and the process around
          building them. Some of these are hard-earned lessons, others are the
          craziest of experiments. Other times, I'll share more about my
          personal journey navigating my own career and life.
        </p>
        <p className="home__text">
          In terms of this place, it's very much so at the beginning. I'm
          excited to grow it throughout the year, and I'm hoping that what I
          share can help you in some way.
        </p>
        <p className="home__text">
          If anything I'm writing about is something you'd like to talk more
          about, feel free to reach out over on{' '}
          <a href="https://twitter.com/__joshblack" rel="noopener noreferrer">
            Twitter
          </a>
          .
        </p>
        <Link href="/posts">
          <a className="browse-posts">Browse posts</a>
        </Link>
      </article>
      <section>
        <h2 className="home__references-title">
          Looking for a place to start?
        </h2>
        <ul className="home__references">
          <li>
            <Link href="posts/2020/rust-for-javascript-developers-ownership">
              <a>Rust for JavaScript Developers: Ownership</a>
            </Link>
          </li>
          <li>
            <Link href="/posts/2020/the-one-where-it-all-began">
              <a>The one where it all began</a>
            </Link>
          </li>
        </ul>
      </section>
    </Page>
  );
}
