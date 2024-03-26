import { Page } from '../components/Page';

export default function NotFound() {
  return (
    <Page>
      <main className="grid items-center px-[--page-padding-inline]">
        <div>
          <h1 className="text-3xl font-semibold">Not found</h1>
          <p>This page does not exist.</p>
        </div>
      </main>
    </Page>
  );
}
