import type { MetadataRoute } from 'next';
import { generateStaticParams } from './writing/[...slug]/page';

export const baseUrl = 'https://josh.black';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await generateStaticParams();
  return [
    {
      url: 'https://josh.black',
      lastModified: new Date(),
    },
    {
      url: 'https://josh.black/writing',
      lastModified: new Date(),
    },
    ...posts.map(({ slug }) => {
      return {
        url: `https://josh.black/writing/${slug.join('/')}`,
        lastModified: new Date(),
      };
    }),
  ];
}
