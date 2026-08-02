import type { APIRoute } from 'astro';
import { getPosts } from '../writing';

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const urls = [
    'https://josh.black',
    'https://josh.black/writing',
    ...posts
      .filter((post) => post.status.type === 'published')
      .map((post) => `https://josh.black/writing/${post.slug}`),
  ];
  const lastModified = new Date().toISOString();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${lastModified}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
