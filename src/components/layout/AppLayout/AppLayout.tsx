import { Outlet } from 'react-router-dom';
import { Header } from '../Header/Header';
import Footer from '../Footer/Footer';
import { ScrollToTop } from './ScrollToTop.ts';

export function AppLayout() {
  return (
    <>
      <ScrollToTop />

      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
