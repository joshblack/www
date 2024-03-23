import { Page } from '../../components/Page';
import { Link } from '../../components/Link';
import { getPostsByCategory } from '../../writing';

export default async function WritingPage() {
  const categories = await getPostsByCategory();
  console.log(categories);
  return (
    <Page>
      <main className="px-[--page-padding-inline]">
        <div className="grid gap-y-6">
          <h1 className="mt-20 text-3xl">Writing</h1>
          {categories.map(([category, posts]) => {
            return (
              <section key={category} className="grid gap-y-4">
                <h2 id={`${category}`} className="text-2xl font-semibold">
                  {category === 'drafts' ? 'Drafts' : category}
                </h2>
                {posts.map((post) => {
                  return (
                    <article key={post.id} className="text-base leading-none">
                      <h3 className="text-xl">
                        <Link href={`/writing/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="mb-1 text-base">{post.description}</p>
                      <span className="text-sm text-neutral-600">
                        {post.readingTime.text}
                      </span>
                    </article>
                  );
                })}
              </section>
            );
          })}
        </div>
      </main>
    </Page>
  );
}
