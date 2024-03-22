import cx from 'clsx';
import NextLink from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';

type LinkProps = ComponentPropsWithoutRef<typeof NextLink>;

export function Link(props: LinkProps) {
  return (
    <NextLink
      {...props}
      className={cx('underline text-slate-600', props.className)}
    />
  );
}

export function ExternalLink(props: LinkProps) {
  return <Link {...props} rel="noopener noreferrer" target="_blank" />;
}
