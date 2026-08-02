import type { APIRoute } from 'astro';
import { generateFeed } from '../feed';

export const GET: APIRoute = async () => {
  const feed = await generateFeed();

  return new Response(feed.atom1(), {
    headers: {
      'Content-Type': 'application/atom+xml',
    },
  });
};
