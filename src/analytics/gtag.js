import * as React from 'react';

export const GA_SITE_ID = 'UA-134220116-1';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export function pageview(url) {
  window.gtag('config', GA_SITE_ID, {
    page_path: url,
  });
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export function event({ action, category, label, value }) {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

export const snippet = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', '${GA_SITE_ID}', {
  page_path: window.location.pathname,
});
`;

export const head = (
  <script
    dangerouslySetInnerHTML={{
      __html: snippet,
    }}
  />
);

export const script = (
  <script
    async
    src={`https://www.googletagmanager.com/gtag/js?id=${GA_SITE_ID}`}
  />
);
