import { ExternalLink, Link } from '../components/Link';
import { Page } from '../components/Page';
import { getRecentPosts } from '../writing';

export const metadata = {
  alternates: {
    types: {
      'application/atom+xml': 'https://josh.black/atom.xml',
      'application/rss+xml': 'https://josh.black/rss.xml',
    },
  },
};

export default async function IndexPage() {
  const posts = await getRecentPosts();
  return (
    <Page>
      <main className="px-[--page-padding-inline]">
        <h1 className="mb-4 mt-28 text-2xl">
          Hi there <span aria-label="wave">👋</span>
        </h1>
        <p>
          My name is Josh, I build{' '}
          <ExternalLink
            href="https://primer.style"
            rel="noopener noreferrer"
            target="_blank">
            design systems at GitHub
          </ExternalLink>
          . I write about design systems, accessibility, and the web.
        </p>
        <h2 className="mb-6 mt-16 text-xl font-semibold">Recent posts</h2>
        <ul className="grid gap-y-6">
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <article>
                  <Link href={`/writing/${post.slug}`}>{post.title}</Link>
                  <div className="mb-1 text-base">{post.description}</div>
                  <div className="text-sm text-neutral-600">
                    {post.readingTime.text}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </main>
    </Page>
  );
}
