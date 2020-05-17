import { promises as fs } from 'fs';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLEnumType,
} from 'graphql';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import remark from 'remark';

const Post = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    filepath: {
      type: new GraphQLNonNull(GraphQLString),
    },
    dirname: {
      type: new GraphQLNonNull(GraphQLString),
    },
    basename: {
      type: new GraphQLNonNull(GraphQLString),
    },
    extension: {
      type: new GraphQLNonNull(GraphQLString),
    },
    data: {
      type: new GraphQLNonNull(GraphQLString),
    },
    slug: {
      type: new GraphQLNonNull(GraphQLString),
    },
    remark: {
      type: new GraphQLObjectType({
        name: 'Remark',
        fields: () => ({
          contents: {
            type: new GraphQLNonNull(GraphQLString),
          },
        }),
      }),
    },
    frontmatter: {
      type: new GraphQLObjectType({
        name: 'Frontmatter',
        fields: () => ({
          title: {
            type: new GraphQLNonNull(GraphQLString),
          },
          description: {
            type: new GraphQLNonNull(GraphQLString),
          },
          date: {
            type: new GraphQLNonNull(GraphQLString),
          },
          status: {
            type: new GraphQLEnumType({
              name: 'status',
              values: {
                DRAFT: {
                  value: 'draft',
                },
                PUBLISHED: {
                  value: 'published',
                },
              },
            }),
          },
          readingTime: {
            type: new GraphQLNonNull(
              new GraphQLObjectType({
                name: 'ReadingTime',
                fields: {
                  text: {
                    type: new GraphQLNonNull(GraphQLString),
                  },
                  minutes: {
                    type: new GraphQLNonNull(GraphQLInt),
                  },
                  time: {
                    type: new GraphQLNonNull(GraphQLInt),
                  },
                  words: {
                    type: new GraphQLNonNull(GraphQLInt),
                  },
                },
              })
            ),
          },
        }),
      }),
    },
  }),
});

const PostsQuery = {
  type: new GraphQLList(Post),
  args: {
    directory: {
      type: new GraphQLNonNull(GraphQLString),
      defaultValue: '/',
    },
  },
  async resolve(root, args, ctx) {
    const rootDirectory = path.join(ctx.root, args.directory);
    const files = [];
    const queue = [rootDirectory];

    while (queue.length > 0) {
      const filepath = queue.shift();
      const stats = await fs.stat(filepath);

      if (stats.isDirectory()) {
        const children = await fs.readdir(filepath);
        queue.push(...children.map((child) => path.join(filepath, child)));
        continue;
      }

      const extension = path.extname(filepath);
      if (extension !== '.md') {
        continue;
      }

      const file = await getFileInfo(rootDirectory, filepath);
      files.push(file);
    }

    return files;
  },
};

async function getFileInfo(rootDirectory, filepath) {
  const extension = path.extname(filepath);
  const relativePath = path.relative(rootDirectory, filepath);
  const directory = path.dirname(relativePath);
  const basename = path.basename(filepath, '.md');
  const stats = await fs.stat(filepath);
  let slug;

  if (directory === '.') {
    slug = basename;
  } else {
    slug = path.join(directory, basename);
  }

  const data = await fs.readFile(filepath, 'utf8');
  const frontmatter = matter(data);
  const html = await remark()
    .use(require('@fec/remark-a11y-emoji'))
    .use(require('@silvenon/remark-smartypants'))
    .use(require('remark-autolink-headings'))
    .use(require('./remark/prismjs'))
    .use(require('remark-html'))
    .process(frontmatter.content);

  let date;
  if (frontmatter.data.date) {
    date = new Date(frontmatter.data.date);
  } else {
    date = new Date(stats.birthtimeMs);
  }

  const file = {
    filepath,
    extension,
    basename,
    data,
    slug,
    dirname: path.dirname(filepath),
    frontmatter: {
      ...frontmatter.data,
      description:
        frontmatter.data.description ||
        frontmatter.content.slice(0, 128).trim(),
      readingTime: readingTime(frontmatter.content),
      date: date.toISOString(),
    },
    remark: {
      contents: html.contents,
    },
  };

  return file;
}

const PostQuery = {
  name: 'PostQuery',
  type: Post,
  args: {
    directory: {
      type: new GraphQLNonNull(GraphQLString),
      defaultValue: '/',
    },
    slug: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  async resolve(root, args, ctx) {
    const rootDirectory = path.join(ctx.root, args.directory);
    const filepath = path.format({
      dir: rootDirectory,
      name: args.slug,
      ext: '.md',
    });
    const file = await getFileInfo(rootDirectory, filepath);
    return file;
  },
};

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: () => ({
      posts: PostsQuery,
      post: PostQuery,
    }),
  }),
});
