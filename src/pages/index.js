import { bodyShort01, expressiveHeading04, gray60 } from '@carbon/elements';
import React from 'react';
import { graphql } from 'gatsby';
import Header from '../components/Header';
import Layout from '../components/Layout';
import Main from '../components/Main';
import Meta from '../components/Meta';
import Footer from '../components/Footer';
import Container from '../components/Container';
import ExternalLink from '../components/ExternalLink';
import RecentPosts from '../components/RecentPosts';

export default function Home({ data }) {
  return (
    <Layout>
      <Meta title="Josh Black" />
      <Header />
      <Main>
        <div className="bx--grid">
          <div className="bx--row">
            <div className="bx--col--auto">
              <h1>Josh Black</h1>
              <span
                css={{
                  ...expressiveHeading04,
                  display: 'block',
                  marginBottom: '1.5rem',
                }}>
                <em>Software Engineer</em>
              </span>
            </div>
          </div>
          <div className="bx--row">
            <div className="bx--col--auto">
              <p css={{ marginBottom: '1rem' }}>
                Hi there! <span aria-label="waving">👋</span> I'm a software
                engineer based in Austin, Texas. I'm currently building a{' '}
                <ExternalLink href="https://www.carbondesignsystem.com">
                  design system for IBM.
                </ExternalLink>
              </p>
              <p css={{ marginBottom: '2rem' }}>
                When not working, I spend my time writing and reading. Check out
                some of my posts below. Want to get in touch?{' '}
                <a href="mailto:josh@josh.black">Send me an email.</a>
              </p>
            </div>
          </div>
        </div>
        <section>
          <div className="bx--grid">
            <div className="bx--row">
              <div className="bx--col--auto">
                <header css={{ marginBottom: '1.5rem' }}>
                  <h2>Recent posts</h2>
                </header>
              </div>
            </div>
          </div>
          <RecentPosts posts={data.allMarkdownRemark} />
        </section>
      </Main>
      <Footer />
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
