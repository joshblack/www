import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Moon32 as Moon, Sun32 as Sun } from '@carbon/icons-react';

export default function Header() {
  const [mode, setMode] = useState(null);
  const router = useRouter();

  // The `window.__colorMode` and `window.__setColorMode` property/method are
  // provided through an IIFE defined in `src/pages/_document.js`
  useLayoutEffect(() => {
    setMode(window.__colorMode);
  }, []);

  useEffect(() => {
    if (mode) {
      window.__setColorMode(mode);
    }
  }, [mode]);

  function onClick() {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }

  return (
    <>
      <a className="show-on-focus interactive-01" href="#main-content">
        Skip to content
      </a>
      <header aria-label="Header" className="header">
        {router.pathname !== '/' && (
          <nav aria-label="Site links" className="header__nav">
            <ul className="header__nav-list">
              <li className="header__nav-list__item">
                <Link href="/">
                  <a className="header__nav-link text-3 interactive-01 font-family-inter">
                    {router.pathname === '/' ? 'Josh Black' : 'Home'}
                  </a>
                </Link>
              </li>
              <li className="header__nav-list__item">
                <Link href="/posts">
                  <a className="header__nav-link text-3 interactive-01 font-family-inter">
                    Posts
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
        )}
        {mode && (
          <button
            aria-label="Toggle light mode"
            onClick={onClick}
            className="header__color-switcher">
            {mode === 'dark' ? <Sun /> : <Moon />}
          </button>
        )}
      </header>
    </>
  );
}
