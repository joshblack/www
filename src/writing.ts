import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import z from 'zod';
import matter from 'gray-matter';
import readingTime from 'reading-time';

interface Post {
  id: string;
  slug: string;
  title: string;
  description: string;
  categories: Array<string>;
  contents: string;
  readingTime: ReturnType<typeof readingTime>;
  status: Published | Draft;
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

const CONTENT_DIR = path.join(process.cwd(), 'writing');
const frontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  categories: z.array(z.string()),
  date: z.date(),
});

export async function getPosts(): Promise<Array<Post>> {
  const posts: Array<Post> = [];
  const categories = await fs.readdir(CONTENT_DIR);

  for (const category of categories) {
    const directory = path.join(CONTENT_DIR, category);
    const stats = await fs.stat(path.join(CONTENT_DIR, category));
    if (!stats.isDirectory()) {
      continue;
    }

    const files = await fs.readdir(directory);
    for (const file of files) {
      const filepath = path.join(directory, file);
      const post = await getPost(getPostId(filepath));
      posts.push(post);
    }
  }

  return posts;
}

function getPostId(filepath: string): string {
  return Buffer.from(filepath).toString('base64url');
}

function getFilepathFromId(id: string): string {
  return Buffer.from(id, 'base64url').toString();
}

export async function getPost(id: string): Promise<Post> {
  const filepath = getFilepathFromId(id);
  const category = path.basename(path.dirname(filepath));
  const contents = await fs.readFile(filepath, 'utf-8');
  const meta = matter(contents);
  const frontmatter = frontmatterSchema.safeParse(meta.data);
  if (frontmatter.success === false) {
    const formatted = JSON.stringify(frontmatter.error.format(), null, 2);
    throw new Error(
      `Unable to parse frontmatter for: ${filepath}\n${formatted}`
    );
  }
  const status: Post['status'] =
    category === 'drafts'
      ? { type: 'draft' }
      : { type: 'published', date: new Date(frontmatter.data.date) };
  const slug = path.join(category, path.basename(filepath, '.md'));

  return {
    id,
    slug,
    title: frontmatter.data.title,
    description: frontmatter.data.description,
    categories: frontmatter.data.categories,
    readingTime: readingTime(meta.content),
    contents: meta.content,
    status,
  };
}

type PostsByCategory = Array<[number | 'drafts', Array<Post>]>;

export async function getPostsByCategory(): Promise<PostsByCategory> {
  const posts = await getPosts();
  const categories = new Map();

  for (const post of posts) {
    if (process.env.NODE_ENV !== 'production') {
      if (post.status.type === 'draft') {
        if (!categories.has('drafts')) {
          categories.set('drafts', []);
        }
        categories.set('drafts', categories.get('drafts').concat(post));
      }
    }

    if (post.status.type === 'published') {
      const year = post.status.date.getFullYear();
      if (!categories.has(year)) {
        categories.set(year, []);
      }
      categories.set(year, categories.get(year).concat(post));
    }
  }

  return Array.from(categories).sort((a, b) => {
    if (a[0] === 'drafts' && b[0] === 'drafts') {
      return 0;
    }

    if (a[0] === 'drafts' && b[0] !== 'drafts') {
      return -1;
    }

    if (a[0] !== 'drafts' && b[0] == 'drafts') {
      return 1;
    }

    return b[0] - a[0];
  });
}

export async function getRecentPosts(): Promise<Array<Post>> {
  const posts = await getPosts();
  const published = posts.filter(
    (post): post is PublishedPost => post.status.type === 'published'
  );
  return published.sort((a, b) => {
    return b.status.date.getTime() - a.status.date.getTime();
  });
}

export function getPostBySlug(slug: string): Promise<Post> {
  const filepath = path.join(
    CONTENT_DIR,
    path.format({
      name: slug,
      ext: '.md',
    })
  );
  if (existsSync(filepath)) {
    const id = getPostId(filepath);
    return getPost(id);
  }

  throw new Error(`Unable to get post with slug: ${slug}`);
}
