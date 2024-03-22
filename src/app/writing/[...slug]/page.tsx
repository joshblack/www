import type { Metadata } from 'next';
import { getPosts, getPostBySlug } from '../../../content';
import { Page } from '../../../components/Page';
import { MDX } from '../../../components/MDX';

type Props = {
  params: {
    slug: Array<string>;
  };
};

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => {
    return {
      slug: post.slug,
    };
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  return {
    title: post.title + ' - Josh Black',
    description: post.description,
  };
}

export default async function PostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  return (
    <Page>
      <main className="p-4 flex flex-col gap-y-6">
        <div className="layout-container">
          <div className="content-grid">
            <h1 className="text-5xl mb-2 mt-[10%]">{post.title}</h1>
            <p className="text-xl text-gray-600 mb-2">{post.description}</p>
            <p className="text-sm text-gray-600">{post.readingTime.text}</p>
          </div>
        </div>
        <div className="layout-container">
          <div className="content-grid">
            <MDX source={post.contents} />
          </div>
        </div>
      </main>
    </Page>
  );
}
