import Link from 'next/link';
// import styles from './Header.module.css';

const links: Array<{ title: string; href: string }> = [
  // {
  // title: 'Writing',
  // href: '/writing',
  // },
];

export function Header() {
  return (
    <header className="flex h-12 items-center justify-between px-[--page-padding-inline]">
      <Link className="font-semibold" href="/">
        Josh Black
      </Link>
      <nav aria-label="Navigation" className="h-full">
        <ul className="flex h-full items-center">
          {links.map((link) => {
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center rounded-md px-2 py-1 text-neutral-700 hover:bg-neutral-200">
                  {link.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
