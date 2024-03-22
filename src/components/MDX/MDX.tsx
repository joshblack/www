import { compile } from './compile';
import classes from './mdx.module.css';

interface MDXProps extends React.PropsWithChildren {
  source?: string;
}

export async function MDX({ children, source }: MDXProps) {
  let content = null;
  if (source) {
    const result = await compile(source);
    content = result.content;
  } else {
    content = children;
  }
  return <div className={classes.markdown}>{content}</div>;
}
