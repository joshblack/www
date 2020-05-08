'use strict';

const { getAllPostSlugs, getPostData } = require('./src/posts');

module.exports = {
  poweredByHeader: false,

  async exportPathMap(defaultPathMap) {
    const pathMap = {
      ...defaultPathMap,
    };

    const slugs = await getAllPostSlugs();
    for (const slug of slugs) {
      const key = ['/posts', ...slug].join('/');
      pathMap[key] = {
        page: '/posts/[...slug]',
        query: {},
      };
    }

    return pathMap;
  },
};
