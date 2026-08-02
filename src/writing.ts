import { getCollection, type CollectionEntry } from 'astro:content';
import readingTime from 'reading-time';

type Entry = CollectionEntry<'writing'>;

export interface Post {
  id: string;
  slug: string;
  title: string;
  description: string;
  categories: Array<string>;
  readingTime: ReturnType<typeof readingTime>;
  status: Published | Draft;
  entry: Entry;
}

interface PublishedPost extends Post {
  status: Published;
}

type Published = {
  type: 'published';
  date: Date;
};

type Draft = {
  type: 'draft';
};

export async function getPosts(): Promise<Array<Post>> {
  const entries = await getCollection('writing');

  return entries.map((entry) => {
    const category = entry.id.split('/')[0];
    const status: Post['status'] =
      category === 'drafts'
        ? { type: 'draft' }
        : { type: 'published', date: entry.data.date };

    return {
      id: entry.id,
      slug: entry.id,
      title: entry.data.title,
      description: entry.data.description,
      categories: entry.data.categories,
      readingTime: readingTime(entry.body ?? ''),
      status,
      entry,
    };
  });
}

type PostsByCategory = Array<[number | 'drafts', Array<Post>]>;

export async function getPostsByCategory(): Promise<PostsByCategory> {
  const posts = await getPosts();
  const categories = new Map<number | 'drafts', Array<Post>>();

  for (const post of posts) {
    if (import.meta.env.DEV && post.status.type === 'draft') {
      categories.set('drafts', (categories.get('drafts') ?? []).concat(post));
    }

    if (post.status.type === 'published') {
      const year = post.status.date.getFullYear();
      categories.set(year, (categories.get(year) ?? []).concat(post));
    }
  }

  return Array.from(categories).sort((a, b) => {
    if (a[0] === 'drafts') {
      return -1;
    }
    if (b[0] === 'drafts') {
      return 1;
    }
    return b[0] - a[0];
  });
}

export async function getRecentPosts(): Promise<Array<PublishedPost>> {
  const posts = await getPosts();
  const published = posts.filter(
    (post): post is PublishedPost => post.status.type === 'published'
  );

  return published.sort((a, b) => {
    return b.status.date.getTime() - a.status.date.getTime();
  });
}
