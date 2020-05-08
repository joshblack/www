import Head from 'next/head';
import { useRouter } from 'next/router';
import { getAllPostSlugs, getPostData } from '../../posts';

export default function Post({ html, metadata }) {
  const router = useRouter();
  const slug = router.query.slug || [];
  return (
    <>
      <Head>
        <meta property="twitter:creator" content="@__joshblack" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Title" />
        <meta property="twitter:description" content="Description" />
        <meta property="twitter:image" content="" />

        <meta property="og:title" content="Title" />
        <meta property="og:description" content="Description" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="" />

        <meta property="og:image" content="" />

        <meta property="description" content="Description" />
        <meta property="image" content="" />
      </Head>
      <h1>{`/${slug.join('/')}`}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}

export async function getStaticPaths() {
  const slugs = await getAllPostSlugs();
  const paths = slugs.map((slug) => {
    return {
      params: {
        slug,
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const data = await getPostData(params.slug);
  return {
    props: data,
  };
}
