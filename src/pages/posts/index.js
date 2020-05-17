import Head from 'next/head';
import Link from 'next/link';
import * as React from 'react';
import Page from '../../components/Page';
import { query } from '../../data';

export default function Posts({ posts }) {
  return (
    <Page>
      <Head>
        <title key="title">Posts - Josh Black</title>
      </Head>
      <h1 className="posts-page__title">Posts</h1>
      <ul className="posts-list">
        {posts.map((post) => {
          return (
            <li key={post.slug} className="posts-list-item aspect-ratio">
              <article className="post aspect-ratio-object">
                <header className="post__header">
                  <Link href={`/posts/${post.slug}`}>
                    <a className="post__link">{post.frontmatter.title}</a>
                  </Link>
                </header>
                <p className="post__description">
                  {post.frontmatter.description}
                </p>
                <footer className="post__footer">
                  <div className="post__details">
                    <small className="post__time-to-read">
                      {post.frontmatter.readingTime.text}
                    </small>
                    {post.frontmatter.status === 'DRAFT' && (
                      <span className="post__status">
                        {post.frontmatter.status}
                      </span>
                    )}
                  </div>
                </footer>
              </article>
            </li>
          );
        })}
      </ul>
    </Page>
  );

  return (
    <>
      <Header />
      <main id="main-content" className="posts-page"></main>
      <Footer />
    </>
  );
}

export async function getStaticProps() {
  const result = await query(`
    {
      posts(directory: "/posts") {
        slug
        frontmatter {
          title
          description
          status
          readingTime {
            text
          }
        }
      }
    }
  `);
  return {
    props: {
      posts: result.data.posts.filter(
        (post) => post.frontmatter.status !== 'DRAFT'
      ),
    },
  };
}
