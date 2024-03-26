import { RssIcon } from '@heroicons/react/16/solid';

export function Footer() {
  return (
    <footer className="mt-12 flex items-center justify-between px-[--page-padding-inline] py-4 text-sm text-neutral-600">
      <span>Josh Black © {new Date().getFullYear()}</span>
      <ul className="flex gap-x-4">
        <li>
          <a href="https://josh.black/rss.xml">
            <RssIcon className="h-4 w-4 text-current" />
            <span className="sr-only">RSS feed</span>
          </a>
        </li>
      </ul>
    </footer>
  );
}
