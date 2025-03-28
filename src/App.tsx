import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import AppRoutes from './routes';
import CustomNavbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import { UserProvider } from './UserProvider';

const Layout: React.FC = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const hideNavbarRoutes = ['/login', '/register'];
  const hideFooterRoutes = ['/login', '/register'];

  return (
    <>
      {token && !hideNavbarRoutes.includes(location.pathname) && <CustomNavbar />}
      <AppRoutes />
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Layout />
      </Router>
    </UserProvider>
  );
};

export default App;
