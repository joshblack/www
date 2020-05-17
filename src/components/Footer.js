import * as React from 'react';
import {
  LogoTwitter32 as Twitter,
  LogoGithub32 as GitHub,
} from '@carbon/icons-react';

export default function Footer() {
  return (
    <footer className="footer">
      <span className="text-secondary">Josh Black © 2020</span>
      <ul className="footer__links">
        <li className="footer__link-item">
          <a
            className="footer__link"
            href="https://github.com/joshblack"
            rel="noopener noreferrer">
            <span className="sr-only">GitHub</span>
            <GitHub />
          </a>
        </li>
        <li className="footer__link-item">
          <a
            className="footer__link"
            href="https://twitter.com/__joshblack"
            rel="noopener noreferrer">
            <span className="sr-only">Twitter</span>
            <Twitter />
          </a>
        </li>
      </ul>
    </footer>
  );
}
