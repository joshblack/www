import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Page from '../../components/Page';
import { query } from '../../data';

// TODO: add lambda for generating og images based on text and description
// <meta property="twitter:image" content="" />
// <meta property="og:image" content="" />
// <meta property="image" content="" />
export default function Post({ title, description = '', readingTime, html }) {
  const router = useRouter();
  const slug = router.query.slug || [];
  return (
    <>
      <Head>
        <meta
          key="twitter:creator"
          property="twitter:creator"
          content="@__joshblack"
        />
        <meta
          key="twitter:card"
          property="twitter:card"
          content="summary_large_image"
        />
        <meta key="twitter:title" property="twitter:title" content={title} />
        <meta
          key="twitter:descriptoin"
          property="twitter:description"
          content={description}
        />
        <meta key="og:title" property="og:title" content={title} />
        <meta
          key="og:description"
          property="og:description"
          content={description}
        />
        <meta key="og:type" property="og:type" content="article" />
        <meta
          key="og:url"
          property="og:url"
          content={`https://josh.black/posts/${slug.join('/')}`}
        />
        <meta key="description" property="description" content="Description" />
        <title key="title">{title} - Josh Black</title>
      </Head>
      <Page className="Post">
        <article>
          <header className="Post__header">
            <h1 className="Post__title">{title}</h1>
            <small className="text-3 text-secondary">{readingTime}</small>
          </header>
          <div
            className="markdown"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
      </Page>
    </>
  );
}

export async function getStaticPaths() {
  const result = await query(`
    {
      posts(directory: "/posts") {
        slug
      }
    }
  `);
  const paths = result.data.posts.map((post) => {
    return {
      params: {
        slug: post.slug.split('/'),
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const result = await query(
    `
      query GetPostData($slug: String!) {
        post(directory: "/posts", slug: $slug) {
          frontmatter {
            title
            description
            readingTime {
              text
            }
          }
          remark {
            contents
          }
        }
      }
    `,
    {
      slug: params.slug.join('/'),
    }
  );

  return {
    props: {
      slug: params.slug,
      title: result.data.post.frontmatter.title,
      description: result.data.post.frontmatter.description,
      readingTime: result.data.post.frontmatter.readingTime.text,
      html: result.data.post.remark.contents,
    },
  };
}
