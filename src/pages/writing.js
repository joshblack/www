import '../styles.scss';

import { Link } from 'gatsby';
import React from 'react';

export default function Writing() {
  return (
    <>
      <strong>Josh Black</strong>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/writing">Writing</Link>
        </li>
      </ul>
      <h1>Writing</h1>
    </>
  );
}
