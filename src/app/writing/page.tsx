import { Page } from '../../components/Page';
import { Link } from '../../components/Link';
import { getPostsByYear } from '../../content';
// import { getPosts, type Post } from '../../content';

export default async function WritingPage() {
  const groups = await getPostsByYear();
  return (
    <Page>
      <main className="py-4">
        <div className="grid gap-y-6">
          <div className="layout-container">
            <div className="content-grid">
              <h1 className="font-semibold text-xl">Writing</h1>
            </div>
          </div>
          {Array.from(groups).map(([year, posts]) => {
            return (
              <div className="layout-container">
                <section key={year} className="content-grid">
                  <h2 className="text-xl mb-4" id="drafts">
                    {year === 'draft' ? 'Drafts' : year}
                  </h2>
                  <div className="grid gap-y-5">
                    {posts.map((post) => {
                      return (
                        <article key={post.id} className="leading-tight">
                          <h3>
                            <Link href={post.href}>{post.title}</Link>
                          </h3>
                          <p>{post.description}</p>
                          <span className="text-xs text-neutral-500">
                            {post.readingTime.text}
                          </span>
                        </article>
                      );
                    })}
                  </div>
                </section>
              </div>
            );
          })}
        </div>
      </main>
    </Page>
  );
}
// const posts = await getPosts();
// const postsByYear: Map<number, Array<Post>> = new Map();

// for (const post of posts) {
// if (post.publication.status !== 'published') {
// continue;
// }

// if (!postsByYear.has(post.publication.year)) {
// postsByYear.set(post.publication.year, []);
// }
// postsByYear.get(post.publication.year).push(post);
// }

// const years = Array.from(postsByYear.keys()).sort((a, b) => b - a);

// return (
// <Page>
// <main className="mt-4 p-4 flex flex-col gap-y-4 text-lg">
// <h1 className="text-3xl">Writing</h1>
// <div className="grid gap-y-10">
// {years.map((year) => {
// const posts = postsByYear.get(year);
// return (
// <section>
// <h2 className="font-semibold text-2xl mb-3">{year}</h2>
// <div className="flex flex-col gap-y-6">
// {posts.map((post) => {
// return <Post key={post.id} post={post} />;
// })}
// </div>
// </section>
// );
// })}
// </div>
// </main>
// </Page>
// );
// }

// function Post({ post }) {
// const href = `/writing/${post.slug.join('/')}`;
// return (
// <article key={post.id}>
// <div className="pb-3 leading-tight">
// <h2 className="text-xl">
// <Link href={href} className="underline text-blue-500">
// {post.frontmatter.title}
// </Link>
// </h2>
// <p>{post.frontmatter.description}</p>
// </div>
// {post.frontmatter.categories.length > 0 ? (
// <ul className="flex gap-x-2">
// {post.frontmatter.categories.map((category) => {
// return (
// <li
// key={category}
// className="text-sm bg-gray-200 rounded-lg py-1 px-2">
// {category}
// </li>
// );
// })}
// </ul>
// ) : null}
// </article>
// );
// }
