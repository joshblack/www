import {
  white,
  black,
  gray10,
  gray20,
  gray60,
  gray80,
  gray100,
  bodyShort02,
} from '@carbon/elements';
import React from 'react';
import Container from './Container';

export default function Footer() {
  return (
    <footer css={background}>
      <Container css={footer}>
        <span css={madeWith}>
          Made with <span aria-label="Man face-palming">🤦‍♂️ </span> by Josh Black
        </span>
        <ul css={list}>
          {links.map(({ href, text, ...rest }, index) => (
            <li key={href}>
              {index !== 0 && <span css={linkSpacer}>•</span>}
              <a href={href} {...rest} css={link}>
                {text}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}

const links = [
  {
    href: 'mailto:josh@josh.black',
    text: 'Contact',
  },
  {
    href: 'https://github.com/joshblack',
    rel: 'noopener noreferrer',
    target: '_blank',
    text: 'GitHub',
  },
  {
    href: 'https://twitter.com/__joshblack',
    rel: 'noopener noreferrer',
    target: '_blank',
    text: 'Twitter',
  },
];

const background = {
  backgroundColor: gray100,
  height: 'var(--footer-height)',
  paddingTop: '1.25rem',
  paddingBottom: '1.25rem',
};

const footer = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
  '@media (min-width: 480px)': {
    flexDirection: 'row',
  },
};

const list = {
  display: 'flex',
  alignItems: 'center',
  listStyle: 'none',
  margin: 0,
  padding: 0,
  color: gray10,
};

const link = {
  ...bodyShort02,
  color: gray10,
};

const madeWith = {
  ...bodyShort02,
  display: 'flex',
  alignItems: 'center',
  color: gray10,
};

const linkSpacer = {
  margin: '0 0.5rem',
};
