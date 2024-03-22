import * as React from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import classes from './Page.module.css';

export function Page({ children }: React.PropsWithChildren) {
  return (
    <div className={classes.page}>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
