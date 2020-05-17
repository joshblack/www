import '../styles.scss';
import * as React from 'react';
import ReactDOM from 'react-dom';

let didInitializeAxe = false;

if (process.env.NODE_ENV !== 'production') {
  if (typeof window !== 'undefined' && didInitializeAxe === false) {
    const axe = require('react-axe');
    axe(React, ReactDOM, 1000);
    didInitializeAxe = true;
  }
}

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
