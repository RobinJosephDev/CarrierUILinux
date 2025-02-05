import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import AppRoutes from './routes';
import CustomNavbar from './components/common/Navbar';
import { UserProvider } from './UserProvider'; // Import UserProvider

const Layout = () => {
  const location = useLocation();

  const hideNavbarRoutes = ['/login'];

  return (
    <UserProvider> {/* Wrap Layout with UserProvider */}
      {!hideNavbarRoutes.includes(location.pathname) && <CustomNavbar />}
      <AppRoutes />
    </UserProvider>
  );
};

const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
