import { Header } from '../Header';
import { Footer } from '../Footer';
import styles from './Page.module.css';

export function Page({ children }: React.PropsWithChildren) {
  return (
    <div className={styles.page}>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
