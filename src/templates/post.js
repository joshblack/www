import '../styles.scss';

import { graphql } from 'gatsby';
import React from 'react';
import Layout from '../components/Layout';

export default function Post({ data }) {
  const { html, fields, frontmatter, timeToRead } = data.markdownRemark;
  return (
    <Layout>
      <div>
        <div css={container}>
          <div css={title}>
            <h1>{frontmatter.title}</h1>
            <span>
              {fields.date} — {timeToRead}min
            </span>
          </div>
          <div
            className="jb--post"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </Layout>
  );
}

const container = {
  width: '100%',
  maxWidth: 600,
  margin: '0 auto',
  paddingTop: '20vh',
};

const title = {
  marginBottom: '3rem',
};

export const pageQuery = graphql`
  query TemplateBlogMarkdown($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      fields {
        date(formatString: "MMMM DD, YYYY")
      }
      frontmatter {
        title
      }
      timeToRead
    }
  }
`;
