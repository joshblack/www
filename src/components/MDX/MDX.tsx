import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import classes from './markdown.module.css';

interface Props {
  source: string;
}

export async function MDX({ source }: Props) {
  const { content } = await compileMDX({
    source,
    components: {},
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        format: 'mdx',
        useDynamicImport: true,
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [
            // @ts-expect-error this seems to be an incorrect error
            rehypePrettyCode,
            {
              /**
               * @see https://shiki.style/themes#themes
               */
              theme: 'github-light',
            },
          ],
        ],
      },
    },
  });

  return <div className={classes.md}>{content}</div>;
}
