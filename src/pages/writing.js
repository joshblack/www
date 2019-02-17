import { expressiveHeading04 } from '@carbon/elements';
import { Link } from 'gatsby';
import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Layout from '../components/Layout';
import Main from '../components/Main';
import Meta from '../components/Meta';
import Container from '../components/Container';
import RecentPosts from '../components/RecentPosts';

export default function Writing({ data }) {
  return (
    <Layout>
      <Meta title="Josh Black - Writing" />
      <Header />
      <Main>
        <div className="bx--grid">
          <div className="bx--row">
            <div className="bx--col--auto">
              <h1>Writing</h1>
              <span
                css={{
                  ...expressiveHeading04,
                  display: 'block',
                  marginBottom: '1.5rem',
                }}>
                <em>Thoughts and opinions from Josh Black</em>
              </span>
            </div>
          </div>
          <div className="bx--row">
            <div className="bx--col--auto">
              <p css={{ marginBottom: '1rem' }}>
                Hi there! <span aria-label="waving">👋</span> If you stumbled
                across this page, this is a listing of all the writing I've
                published on this site.
              </p>
              <p css={{ marginBottom: '2rem' }}>
                Feel free to browse some of the recent posts below{' '}
                <span aria-label="point downwards">👇</span>, or view all posts
                in the next section.
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
          <RecentPosts posts={data.recent} />
        </section>
        <section>
          <div className="bx--grid">
            <div className="bx--row">
              <div className="bx--col--auto">
                <header css={{ marginBottom: '1.5rem' }}>
                  <h2>All posts</h2>
                </header>
              </div>
            </div>
          </div>
          <RecentPosts posts={data.all} />
        </section>
      </Main>
      <Footer />
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

  query {
    recent: allMarkdownRemark(
      sort: { fields: [fields___date], order: DESC }
      limit: 5
    ) {
      edges {
        ...PostData
      }
    }

    all: allMarkdownRemark(sort: { fields: [fields___date], order: DESC }) {
      edges {
        ...PostData
      }
    }
  }
`;
