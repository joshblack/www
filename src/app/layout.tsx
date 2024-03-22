import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
