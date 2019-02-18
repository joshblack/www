import { black, white } from '@carbon/elements';
import { Link } from 'gatsby';
import React from 'react';
import { grid } from '../tools/styles';
import Container from './Container';

export default function Header() {
  return (
    <div css={background}>
      <Container as="header" css={header}>
        <Link to="/" css={logo}>
          JB
        </Link>
        <ul css={list}>
          <li css={listItem}>
            <Link to="/writing">Writing</Link>
          </li>
        </ul>
      </Container>
    </div>
  );
}

const background = {
  backgroundColor: white,
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
};

const header = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 'var(--header-height)',
};

const logo = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: '50%',
  backgroundColor: 'black',
  color: 'white',
  fontWeight: 600,
  fontSize: 20,
  lineHeight: 1,
  userSelect: 'none',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'none',
  },
};

const list = {
  display: 'flex',
  alignItems: 'center',
  margin: 0,
  padding: 0,
  listStyle: 'none',
  '& li:last-of-type': {
    marginRight: 0,
  },
};

const listItem = {
  marginRight: '1rem',
};
