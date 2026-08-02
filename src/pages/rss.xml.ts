import type { APIRoute } from 'astro';
import { generateFeed } from '../feed';

export const GET: APIRoute = async () => {
  const feed = await generateFeed();

  return new Response(feed.rss2(), {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  });
};
