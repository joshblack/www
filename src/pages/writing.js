import '../styles.scss';

import { Link } from 'gatsby';
import React from 'react';
import Layout from '../components/Layout';

export default function Writing() {
  return (
    <Layout>
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
    </Layout>
  );
}
