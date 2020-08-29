import '../styles.scss';

import Router from 'next/router';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { pageview } from '../analytics/gtag';

let didInitializeAxe = false;

if (process.env.NODE_ENV !== 'production') {
  if (typeof window !== 'undefined' && didInitializeAxe === false) {
    const axe = require('react-axe');
    axe(React, ReactDOM, 1000);
    didInitializeAxe = true;
  }
}

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    function handleRouteChange(url) {
      if (process.env.NODE_ENV === 'production') {
        pageview(url);
      }
    }
    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return <Component {...pageProps} />;
}
