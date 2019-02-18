import {
  bodyShort02,
  expressiveHeading03,
  expressiveHeading04,
  gray60,
} from '@carbon/elements';
import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import Main from '../components/Main';
import Meta from '../components/Meta';
import Container from '../components/Container';
import ExternalLink from '../components/ExternalLink';
import Posts from '../components/Posts';

export default function Home({ data }) {
  return (
    <Layout>
      <Meta title="Josh Black" />
      <Main>
        <Container>
          <h1>Josh Black</h1>
          <span
            css={{
              ...expressiveHeading04,
              display: 'block',
              marginBottom: '3rem',
            }}>
            <em>Software Engineer</em>
          </span>
          <p css={{ ...expressiveHeading04, marginBottom: '2rem' }}>
            Hi there! <span aria-label="waving">👋</span> I’m a software
            engineer based in Austin, Texas. I’m currently building a{' '}
            <ExternalLink href="https://www.carbondesignsystem.com">
              design system for IBM.
            </ExternalLink>
          </p>
          <p css={{ ...expressiveHeading03, marginBottom: '4rem' }}>
            Want to get in touch?{' '}
            <a href="mailto:josh@josh.black">Send me an email.</a>
          </p>
        </Container>
        <Container as="section">
          <header css={{ marginBottom: '1.5rem' }}>
            <h2>Recent posts</h2>
          </header>
          <Posts posts={data.allMarkdownRemark.edges} />
        </Container>
      </Main>
    </Layout>
  );
}

export const query = graphql`
  {
    allMarkdownRemark(
      sort: { fields: [fields___date], order: DESC }
      limit: 5
    ) {
      edges {
        node {
          frontmatter {
            title
            description
          }
          fields {
            date(formatString: "MMMM DD, YYYY")
            slug
          }
          timeToRead
        }
      }
    }
  }
`;
