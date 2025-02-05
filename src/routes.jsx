import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';

import ShipmentPage from './pages/Sales/ShipmentPage';
import AddShipmentForm from './components/Sales/AddShipment/AddShipmentForm';
import EditShipmentForm from './components/Sales/EditShipment/EditShipmentForm';

import PrivateRoute from './components/common/PrivateRoute';
import UserProvider from './UserProvider';
import QuotePage from './pages/Sales/QuotePage';
import AddQuoteForm from './components/Sales/AddQuote/AddQuoteForm';
import EditQuoteForm from './components/Sales/EditQuote/EditQuoteForm';

const AppRoutes = () => (
  <UserProvider>
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <ShipmentPage />
          </PrivateRoute>
        }
      />

      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/shipment"
        element={
          <PrivateRoute>
            <ShipmentPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/shipment/add-shipment"
        element={
          <PrivateRoute>
            <AddShipmentForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/shipment/:id"
        element={
          <PrivateRoute>
            <EditShipmentForm />
          </PrivateRoute>
        }
      />

      <Route
        path="/quote"
        element={
          <PrivateRoute>
            <QuotePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/quote/add-quote"
        element={
          <PrivateRoute>
            <AddQuoteForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/quote/:id"
        element={
          <PrivateRoute>
            <EditQuoteForm />
          </PrivateRoute>
        }
      />
    </Routes>
  </UserProvider>
);

export default AppRoutes;
