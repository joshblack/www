import './global.css';

export const metadata = {
  title: 'Josh Black',
  description: 'Personal website and blog for Josh Black',
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
