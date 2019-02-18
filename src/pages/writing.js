import { expressiveHeading03, expressiveHeading04 } from '@carbon/elements';
import { Link } from 'gatsby';
import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Layout from '../components/Layout';
import Main from '../components/Main';
import Meta from '../components/Meta';
import Container from '../components/Container';
import Posts from '../components/Posts';

export default function Writing({ data }) {
  return (
    <Layout>
      <Meta title="Josh Black - Writing" />
      <Main>
        <Container>
          <h1 css={{ marginBottom: '1.5rem' }}>Writing</h1>
          <section>
            <header css={{ marginBottom: '1.5rem' }}>
              <h2>Recent posts</h2>
            </header>
            <Posts posts={data.allMarkdownRemark.edges.slice(0, 5)} />
          </section>
          <section>
            <header css={{ marginBottom: '1.5rem' }}>
              <h2>All posts</h2>
            </header>
            <Posts posts={data.allMarkdownRemark.edges} />
          </section>
        </Container>
      </Main>
    </Layout>
  );
}

export const pageQuery = graphql`
  fragment PostData on MarkdownRemarkEdge {
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

  {
    allMarkdownRemark(sort: { fields: [fields___date], order: DESC }) {
      edges {
        ...PostData
      }
    }
  }
`;
