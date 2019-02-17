import { bodyLong02 } from '@carbon/elements';
import { graphql } from 'gatsby';
import React from 'react';
import Container from '../components/Container';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Layout from '../components/Layout';
import Main from '../components/Main';
import Meta from '../components/Meta';

export default function Post({ data }) {
  const { html, fields, frontmatter, timeToRead } = data.markdownRemark;
  return (
    <Layout>
      <Meta title={frontmatter.title} />
      <Header />
      <Main>
        <article>
          <Container as="header" css={header}>
            <h1>{frontmatter.title}</h1>
            <small css={{ display: 'block', marginBottom: '1rem' }}>
              {fields.date} — {timeToRead}min
            </small>
          </Container>
          <Container
            className="jb--post"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
      </Main>
      <Footer />
    </Layout>
  );
}

const header = {
  marginBottom: '4rem',
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
        description
      }
      timeToRead
    }
  }
`;
