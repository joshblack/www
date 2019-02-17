import { bodyShort01, gray60 } from '@carbon/elements';
import styled from '@emotion/styled';
import React from 'react';
import { Link } from 'gatsby';

function RecentPosts({ posts }) {
  return (
    <List className="bx--grid">
      {posts.edges.map(post => (
        <li key={post.node.frontmatter.title} className="bx--row">
          <Article
            className="bx--col--auto"
            title={post.node.frontmatter.title}
            description={post.node.frontmatter.description}
            slug={post.node.fields.slug}
            date={post.node.fields.date}
            timeToRead={post.node.timeToRead}
          />
        </li>
      ))}
    </List>
  );
}

const List = styled('ul')({
  listStyle: 'none',
});

function Article({ className, date, description, title, slug, timeToRead }) {
  return (
    <article className={className} css={article}>
      <header css={articleHeader}>
        <h3>
          <Link to={slug} rel="bookmark">
            {title}
          </Link>
        </h3>
        <small css={{ color: gray60 }}>
          {date} • {timeToRead} min read
        </small>
      </header>
      <p>{description}</p>
    </article>
  );
}

const article = {
  marginBottom: '2rem',
  backgroundColor: 'white',
  borderRadius: '1rem',
  padding: '1rem',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
};

const articleHeader = {
  marginBottom: '1rem',
};

export default RecentPosts;
