import Head from 'next/head';
import PropTypes from 'prop-types';
import Header from './Header';
import Footer from './Footer';

function Page({ className, children, title = 'Josh Black' }) {
  return (
    <>
      <Head>
        <title key={title}>{title}</title>
      </Head>
      <div className="layout">
        <Header />
        <main id="main-content" className={className}>
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}

Page.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
};

export default Page;
