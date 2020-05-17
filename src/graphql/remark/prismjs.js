'use strict';

const visit = require('unist-util-visit');
const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/');

const loadedLanguages = new Set(Object.keys(Prism.languages));

function plugin() {
  function transformer(tree, file) {
    visit(tree, 'code', (node) => {
      if (!loadedLanguages.has(node.lang)) {
        loadLanguages([node.lang]);
        loadedLanguages.add(node.lang);
      }

      const highlightedCode = Prism.highlight(
        node.value,
        Prism.languages[node.lang],
        node.lang
      );
      const className = `language-${node.lang}`;
      node.type = 'html';
      node.value =
        `<pre class="codeblock ${className}" aria-label="Code snippet" tabindex="0">` +
        `<code class="${className}">` +
        highlightedCode +
        `</code>` +
        `</pre>`;
    });
  }

  return transformer;
}

module.exports = plugin;
