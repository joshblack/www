import { Feed } from 'feed';
import { getPosts } from '../writing';

const today = new Date();
const year = today.getFullYear();
const feedOptions = {
  title: 'Josh Black',
  description: 'Personal site and blog of Josh Black',
  id: 'https://josh@josh.black',
  link: 'https://josh.black',
  language: 'en',
  image: 'https://github.com/joshblack.png',
  favicon: 'https://josh.black/icon.png',
  feedLinks: {
    rss: 'https://josh.black/rss.xml',
    atom: 'https://josh.black/atom.xml',
  },
  copyright: `All rights reserved ${year}, Josh Black`,
  author: {
    name: 'Josh Black',
    email: 'josh@josh.black',
    link: 'https://josh.black',
  },
};

export async function generateFeed() {
  const feed = new Feed(feedOptions);
  const posts = await getPosts();

  for (const post of posts) {
    if (post.status.type !== 'published') {
      continue;
    }

    feed.addItem({
      title: post.title,
      description: post.description,
      link: `https://josh.black/${post.slug}`,
      date: post.status.date,
    });
  }

  return feed;
}
