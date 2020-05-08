const { promises: fs } = require('fs');
const matter = require('gray-matter');
const path = require('path');
const remark = require('remark');
const remarkHTML = require('remark-html');

const POSTS_DIRECTORY = path.join(process.cwd(), 'posts');

async function getAllPostSlugs() {
  const filepaths = [];

  async function traverse(filepath) {
    const stats = await fs.stat(filepath);
    if (!stats.isDirectory()) {
      filepaths.push(filepath);
      return;
    }

    const filenames = await fs.readdir(filepath);
    return Promise.all(
      filenames.map((filename) => traverse(path.join(filepath, filename)))
    );
  }

  await traverse(POSTS_DIRECTORY);

  return filepaths.map((filepath) => {
    const relativePath = path.relative(POSTS_DIRECTORY, filepath);
    const directory = path.dirname(relativePath);
    const basename = path.basename(filepath, '.md');

    if (directory === '.') {
      return [basename];
    }

    return [...directory.split(path.sep), basename];
  });
}

async function getPostData(slug) {
  const filepath = `${path.join(POSTS_DIRECTORY, ...slug)}.md`;
  const data = await fs.readFile(filepath);
  const result = matter(data);
  const html = await remark().use(remarkHTML).process(result.content);

  return {
    slug,
    html: html.toString(),
    metadata: result.data,
  };
}

module.exports = {
  getAllPostSlugs,
  getPostData,
};
