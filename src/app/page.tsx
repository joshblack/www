import { Page } from '../components/Page';
import { ExternalLink, Link } from '../components/Link';
import { getRecentPosts } from '../content';

export default async function IndexPage() {
  const posts = await getRecentPosts();
  return (
    <Page>
      <div className="layout-container">
        <div className="content-grid">
          <main className="flex flex-col gap-y-12 text-lg">
            <section>
              <h1 className="text-2xl mt-[25%] mb-4">
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
            </section>
            <section className="grid gap-y-5">
              <h2 className="font-semibold text-xl">Writing</h2>
              <ul className="leading-none grid gap-y-4">
                {posts.slice(0, 5).map((post) => {
                  return (
                    <li key={post.id}>
                      <Link href={post.href} className="text-neutral-900">
                        {post.title}
                      </Link>
                      <div className="text-sm text-neutral-500">
                        {post.description}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {post.publication.status === 'published'
                          ? post.publication.year
                          : ''}
                      </div>
                    </li>
                  );
                })}
              </ul>
              <Link className="text-sm" href="/writing">
                View more writing
              </Link>
            </section>
          </main>
        </div>
      </div>
    </Page>
  );
}
