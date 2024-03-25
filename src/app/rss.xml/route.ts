import { Feed } from 'feed';
import { getPosts } from '../../writing';

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
  },
  copyright: 'All rights reserved 2024, Josh Black',
  author: {
    name: 'Josh Black',
    email: 'josh@josh.black',
    link: 'https://josh.black',
  },
};

export async function GET() {
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
  return new Response(feed.rss2());
}
