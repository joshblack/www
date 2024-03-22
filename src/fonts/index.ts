import localFont from 'next/font/local';

export const sans = localFont({
  src: './ClashGrotesk/Fonts/web/ClashGrotesk-Variable.woff2',
  variable: '--font-sans',
});

export const body = localFont({
  src: './Archivo/Fonts/web/Archivo-Variable.woff2',
  variable: '--font-body',
});

export const mono = localFont({
  src: './JetBrainsMono/Fonts/web/JetBrainsMono-Variable.woff2',
  variable: '--font-mono',
});
