import './globals.css';
import { BaseLayout } from '../components/BaseLayout';

export const metadata = {
  title: 'Josh Black',
  description: 'Personal site and blog of Josh Black',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BaseLayout>{children}</BaseLayout>
      </body>
    </html>
  );
}
