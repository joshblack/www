import { compileMDX } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkSmartypants from 'remark-smartypants';
import nord from 'tm-themes/themes/nord.json';

export function compile(source: string) {
  return compileMDX({
    source,
    components: {},
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        format: 'mdx',
        useDynamicImport: true,
        remarkPlugins: [remarkSmartypants],
        rehypePlugins: [
          [
            // @ts-expect-error this seems to be expected usage
            rehypePrettyCode,
            {
              theme: 'github-light',
            },
          ],
        ],
      },
    },
  });
}
