import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link key="favicon" rel="icon" href="/favicon.ico?v=1.0" />
          <link
            key="inter"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
            rel="stylesheet"
          />
          <script>{analytics}</script>
        </Head>
        <body>
          <script dangerouslySetInnerHTML={{ __html: themeSwitcher }} />
          <Main />
          <NextScript />
          {process.env.NODE_ENV === 'production' && (
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=UA-134220116-1"
            />
          )}
        </body>
      </Html>
    );
  }
}

const analytics = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'UA-134220116-1');
`;

const themeSwitcher = `
/**
 * Helps us to avoid a flicker when choosing a theme that is the opposite of a
 * user's color preference on their machine. For example, if a user has light
 * mode enabled but prefers dark mode on the site. This method is immediately
 * invoked to prevent the background flicker that comes from being in light
 * mode but transitioning to dark right away.
 *
 * Unfortunately, even solutions in CSS wouldn't support this use-case so we're
 * going to stick this in here to help out 😅
 */
(function() {
  let preferredColorMode;

  try {
    preferredColorMode = localStorage.getItem('jb::color-preference');
  } catch (error) {}

  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeQuery.addListener(function (event) {
    setColorMode(event.matches ? 'dark' : 'light');
  });

  setColorMode(preferredColorMode || (darkModeQuery.matches ? 'dark' :
  'light'));

  function setColorMode(mode) {
    preferredColorMode = mode;
    try {
      localStorage.setItem('jb::color-preference', preferredColorMode);
    } catch (error) {}

    if (mode === 'dark') {
      if (document.body.classList.contains('light-mode')) {
        document.body.classList.remove('light-mode');
      }
      document.body.classList.add('dark-mode');
    } else if (mode === 'light') {
      if (document.body.classList.contains('dark-mode')) {
        document.body.classList.remove('dark-mode');
      }
      document.body.classList.add('light-mode');
    }

    // Used in our React code to read the current color preference
    window.__colorMode = preferredColorMode;
  }

  // Used in our React code to set the current color preference
  window.__setColorMode = setColorMode;
})();
`;

export default MyDocument;
