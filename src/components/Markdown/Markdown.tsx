import cx from 'clsx';
import { mono } from '../../fonts';
import styles from './Markdown.module.css';

type Props = {
  contents: string;
};

export function Markdown({ contents }: Props) {
  return (
    <div
      className={cx(mono.variable, styles.markdown)}
      dangerouslySetInnerHTML={{ __html: contents }}
    />
  );
}
