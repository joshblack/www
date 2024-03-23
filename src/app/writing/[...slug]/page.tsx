import type { Metadata } from 'next';
import { Page } from '../../../components/Page';
import { getPosts, getPostBySlug } from '../../../writing';
import { MDX } from '../../../components/MDX';

type Props = {
  params: {
    slug: Array<string>;
  };
};

export default async function PostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug.join('/'));
  return (
    <Page>
      <main className="px-[--page-padding-inline]">
        <h1 className="mb-4 mt-32 text-5xl">{post.title}</h1>
        <p>{post.description}</p>
        <div className="mb-16 text-base text-neutral-600">
          {post.readingTime.text}
        </div>
        <MDX source={post.contents} />
      </main>
    </Page>
  );
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => {
    return {
      slug: post.slug.split('/'),
    };
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug.join('/'));
  return {
    title: post.title + ' - Josh Black',
    description: post.description,
  };
}
