import styled from '@emotion/styled';
import React from 'react';
import Container from './Container';

export default function Main({ children, ...props }) {
  return (
    <main id="skip-to-content" css={main} {...props}>
      {children}
    </main>
  );
}

const main = {
  minHeight: `calc(100vh - var(--header-height) - var(--footer-height))`,
  // overflow: 'hidden',
  // overflowY: 'auto',
  height: '100%',
  paddingTop: '4rem',
  paddingBottom: '4rem',
};
