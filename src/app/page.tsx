import { ExternalLink } from '../components/Link';
import { Page } from '../components/Page';

export default function IndexPage() {
  return (
    <Page>
      <main className="px-[--page-padding-inline]">
        <h1 className="mb-4 mt-[25%] text-2xl">
          Hi there <span aria-label="wave">👋</span>
        </h1>
        <p>
          My name is Josh, I build{' '}
          <ExternalLink
            href="https://primer.style"
            rel="noopener noreferrer"
            target="_blank">
            design systems at GitHub
          </ExternalLink>
          . I write about design systems, accessibility, and the web.
        </p>
      </main>
    </Page>
  );
}
