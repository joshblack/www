import chrome from 'chrome-aws-lambda';
import { chromium } from 'playwright';

const shouldDebugHtml = process.env.OG_HTML_DEBUG === '1';
const exePath =
  process.platform === 'win32'
    ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    : process.platform === 'linux'
    ? '/usr/bin/google-chrome'
    : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export default async function handler(req, res) {
  const { title } = req.query;

  if (!title) {
    res.statusCode = 422;
    res.end('Expected the title query parameter');
    return;
  }

  if (shouldDebugHtml) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    const html = getHtml(title);
    res.end(html);
    return;
  }

  const file = await getScreenshot(title);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'image/png');
  res.end(file);
}

const screenshots = new Map();
async function getScreenshot(title) {
  if (screenshots.has(title)) {
    return screenshots.get(title);
  }

  const page = await getPage();
  const html = getHtml(title);
  await page.setViewportSize({
    width: 1200,
    height: 630,
  });
  await page.setContent(html);
  const file = await page.screenshot({ type: 'png' });
  screenshots.set(title, file);
  return file;
}

async function getOptions() {
  return {
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: process.env.NODE_ENV === 'production' ? chrome.headless : true,
  };
}

let _page;
async function getPage() {
  if (_page) {
    return _page;
  }
  const options = await getOptions();
  const browser = await chromium.launch(options);
  const context = await browser.newContext();
  _page = context.newPage();
  return _page;
}

/**
 * @param {string} title
 */
function getHtml(title) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Generated Image</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
    rel="stylesheet"
  />
  <style>
    html {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
    }

    *, *::before, *::after {
      box-sizing: inherit;
    }

    body {
      color: white;
      font-family: 'Inter';
      margin: 0;
      width: 100%;
      height: 100%;
      background-color: #121212;
      background:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj48ZGVmcz48cGF0dGVybiBpZD0icGF0dGVybiIgd2lkdGg9IjIwLjc4IiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgNjkuMjgyMDMyMzAyNzU1MSw4MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDI3MCkiPjxyZWN0IGlkPSJwYXR0ZXJuLWJhY2tncm91bmQiIHg9IjAiIHk9IjAiIHdpZHRoPSI0MDAlIiBoZWlnaHQ9IjQwMCUiIGZpbGw9IiMxMjEyMTIiLz4gIDwhLS0tLT4gPCEtLS0tPiAgPHBhdGggZD0iTTg2LjYsNzBMNjkuMjgsODBMNTEuOTYsNzBMNTEuOTYsNTBMNjkuMjgsNDBMODYuNiw1MHogTTUxLjk2LDkwTDM0LjY0LDEwMEwxNy4zMiw5MEwxNy4zMiw3MEwzNC42NCw2MEw1MS45Niw3MHogTTE3LjMyLDcwTDAsODBMLTE3LjMyLDcwTC0xNy4zMiw1MEwwLDQwTDE3LjMyLDUweiBNMTcuMzIsMzBMMCw0MEwtMTcuMzIsMzBMLTE3LjMyLDEwTDAsMEwxNy4zMiwxMHogTTUxLjk2LDEwTDM0LjY0LDIwTDE3LjMyLDEwTDE3LjMyLC0xMEwzNC42NCwtMjBMNTEuOTYsLTEweiBNODYuNiwzMEw2OS4yOCw0MEw1MS45NiwzMEw1MS45NiwxMEw2OS4yOCwwTDg2LjYsMTAgeiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9IiMxYTIwMmMiIHNoYXBlLXJlbmRlcmluZz0iYXV0byIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZpbGw9InRyYW5zcGFyZW50Ii8+ICAgPCEtLS0tPiA8IS0tLS0+ICA8cGF0aCBkPSJNMzYuMzcsNDFMMzYuMzcsNDNMMzQuNjQsNDJMMzIuOTEsNDNMMzIuOTEsNDFMMzEuMTgsNDBMMzIuOTEsMzlMMzIuOTEsMzdMMzQuNjQsMzhMMzYuMzcsMzdMMzYuMzcsMzlMMzguMTEsNDAgeiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9IiM0YTU1NjgiIHNoYXBlLXJlbmRlcmluZz0iYXV0byIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIGZpbGw9InRyYW5zcGFyZW50Ii8+ICA8L3BhdHRlcm4+PC9kZWZzPiA8cmVjdCBmaWxsPSJ1cmwoI3BhdHRlcm4pIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAlIiB5PSIwIiB4PSIwIi8+PC9zdmc+");
    }

    .card {
      display: grid;
      grid-template-areas:
        "title"
        "watermark";
      grid-template-rows: minmax(0, 1fr) max-content;
      width: 100%;
      height: 100%;
      padding: 3rem;
    }

    .card-title {
      font-size: 96px;
      font-weight: bold;
      grid-area: title;
      overflow: hidden;
      margin-bottom: 2rem;
    }

    .card-watermark {
      grid-area: watermark;
      align-self: center;
      justify-self: end;
      font-size: 64px;
      font-weight: bold;
      background: #ff7d97;
      background: linear-gradient(#ff7d97, #FFA4B6);
      padding: 2rem;
      border-radius: 50%;
    }
  </style>
</head>
<body>
  <article class="card">
    <header class="card-title">${title}</header>
    <span class="card-watermark">JB</span>
  </article>
</body>
</html>
`;
}
