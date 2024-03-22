import Link from 'next/link';
import styles from './Header.module.css';

const links = [
  {
    title: 'Writing',
    href: '/writing',
  },
];

export function Header() {
  return (
    <div className="layout-container">
      <div className="content-grid">
        <header className="h-12 flex items-center justify-between">
          <Link className="font-semibold" href="/">
            Josh Black
          </Link>
          <nav aria-label="Navigation" className="h-full">
            <ul className="flex items-center h-full">
              {links.map((link) => {
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center px-2 py-1 rounded-md text-neutral-700 hover:bg-neutral-200">
                      {link.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </header>
      </div>
    </div>
  );
}
