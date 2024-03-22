import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import z from 'zod';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const WRITING_DIR = path.join(CONTENT_DIR, 'writing');
const FRONTMATTER_SCHEMA = z
  .object({
    title: z.string(),
    description: z.string(),
    categories: z.array(z.string()),
  })
  .required();

interface Post {
  id: string;
  filepath: string;
  slug: Slug;
  href: string;
  title: string;
  description: string;
  categories: Array<string>;
  contents: string;
  publication: Published | Draft;
  readingTime: ReturnType<typeof readingTime>;
}

interface PublishedPost extends Post {
  publication: Published;
}

type Published = {
  year: number;
  status: 'published';
};

type Draft = {
  status: 'draft';
};

type Slug = Array<string>;

export async function getPosts(): Promise<Array<Post>> {
  const posts: Array<Post> = [];
  for (const category of await fs.readdir(WRITING_DIR)) {
    const directory = path.join(WRITING_DIR, category);
    const stats = await fs.lstat(directory);
    if (!stats.isDirectory()) {
      continue;
    }

    for (const name of await fs.readdir(directory)) {
      const filepath = path.join(directory, name);
      const basename = path.basename(filepath, '.md');
      const slug: Slug = [category, basename];
      const post = await getPostBySlug(slug);
      posts.push(post);
    }
  }

  return posts;
}

export async function getPublishedPosts(): Promise<Array<PublishedPost>> {
  const posts = await getPosts();
  return posts.filter((post): post is PublishedPost => {
    return post.publication.status === 'published';
  });
}

export async function getRecentPosts(): Promise<Array<Post>> {
  const posts = await getPublishedPosts();
  return posts.sort((a, b) => {
    return b.publication.year - a.publication.year;
  });
}

export async function getPostsByYear(): Promise<
  Array<[number | 'draft', Array<Post>]>
> {
  const posts = await getPosts();
  const years = new Map();

  for (const post of posts) {
    if (post.publication.status !== 'published') {
      if (process.env.NODE_ENV !== 'production') {
        if (!years.has('draft')) {
          years.set('draft', []);
        }
        years.set('draft', years.get('draft').concat(post));
      }
      continue;
    }

    const year = post.publication.year;
    if (!years.has(year)) {
      years.set(year, []);
    }
    years.set(year, years.get(year).concat(post));
  }

  return Array.from(years).sort((a, b) => {
    if (a[0] === 'draft') {
      return -1;
    }
    if (b[0] === 'draft') {
      return 1;
    }
    return b[0] - a[0];
  });
}

function getPostId(slug: Slug) {
  return slug.join(':');
}

function getPathsFromId(id: string): Slug {
  return id.split(':') as Slug;
}

export function getPostBySlug(slug: Slug): Promise<Post> {
  const id = getPostId(slug);
  return getPost(id);
}

async function getPost(id: string): Promise<Post> {
  const slug = getPathsFromId(id);
  const filepath = path.format({
    name: path.join(WRITING_DIR, ...slug),
    ext: '.md',
  });
  const contents = await fs.readFile(filepath, 'utf8');
  const frontmatter = matter(contents);
  const publication: Published | Draft =
    slug[0] === 'drafts'
      ? { status: 'draft' }
      : { status: 'published', year: parseInt(slug[0], 10) };
  const result = FRONTMATTER_SCHEMA.safeParse(frontmatter.data);
  if (!result.success) {
    const formatted = JSON.stringify(result.error.format(), null, 2);
    throw new Error(`Error parsing frontmatter for: ${filepath}\n${formatted}`);
  }

  return {
    id,
    filepath,
    slug,
    href: '/writing/' + slug.join('/'),
    ...result.data,
    contents,
    publication,
    readingTime: readingTime(frontmatter.content),
  };
}

// export async function getPostSlug(): Promise<Slug> {
// throw new Error('Not implemented');
// }
