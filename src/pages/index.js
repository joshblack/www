import '../styles.scss';

import { Link } from 'gatsby';
import React from 'react';
import Meta from '../components/Meta';

// TODO: home (about, callout to writing and projects, contact),
// writing, projects
export default function Home() {
  return (
    <>
      <Meta />
      <strong>Josh Black</strong>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/writing">Writing</Link>
        </li>
      </ul>
      <h1>Home</h1>
    </>
  );
}
