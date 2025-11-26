import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  const location = useLocation();
  
  // Pages where we don't want to show the footer
  const noFooterPages = ['/checkout', '/booking-success'];
  const showFooter = !noFooterPages.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
