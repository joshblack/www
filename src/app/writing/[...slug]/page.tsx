import type { Metadata } from 'next';
import { Page } from '../../../components/Page';
import { getPosts, getPostBySlug } from '../../../writing';
import { MDX } from '../../../components/MDX';

type Props = {
  params: Promise<{
    slug: Array<string>;
  }>;
};

export default async function PostPage(props: Props) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug.join('/'));
  return (
    <Page>
      <main className="px-[--page-padding-inline]">
        <h1 className="mt-32 mb-4 text-5xl">{post.title}</h1>
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

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const post = await getPostBySlug(params.slug.join('/'));
  return {
    title: post.title + ' - Josh Black',
    description: post.description,
  };
}
