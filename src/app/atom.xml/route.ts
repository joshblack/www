import { generateFeed } from '../feed';

export async function GET() {
  const feed = await generateFeed();
  return new Response(feed.atom1(), {
    headers: {
      'Content-Type': 'application/atom+xml',
    },
  });
}
