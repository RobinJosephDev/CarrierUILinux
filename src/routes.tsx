import { Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import ProtectedRoute from './components/common/ProtectedRoute';
import UserProvider from './UserProvider';

const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const ShipmentPage = lazy(() => import('./pages/Sales/ShipmentPage'));
const QuotePage = lazy(() => import('./pages/Sales/QuotePage'));

const AppRoutes: React.FC = () => (
  <UserProvider>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ShipmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shipment"
          element={
            <ProtectedRoute>
              <ShipmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quote"
          element={
            <ProtectedRoute>
              <QuotePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  </UserProvider>
);

export default AppRoutes;
