import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';

// Lazy loading de componentes
const LoginPage = React.lazy(() => import('./pages/LoginPage.jsx'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage.jsx'));
const TicketsPage = React.lazy(() => import('./pages/TicketsPage.jsx'));
const TicketDetailPage = React.lazy(() => import('./pages/TicketDetailPage.jsx'));
const CreateTicketPage = React.lazy(() => import('./pages/CreateTicketPage.jsx'));
const UsersPage = React.lazy(() => import('./pages/UsersPage.jsx'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage.jsx'));
const NotificationsPage = React.lazy(() => import('./pages/NotificationsPage.jsx'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage.jsx'));

// Componente de loading para Suspense
const SuspenseLoading = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="400px"
  >
    <CircularProgress size={40} />
  </Box>
);

function App() {
  const { isLoading, isAuthenticated } = useAuth();

  // Mostrar pantalla de carga mientras se restaura la sesión
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<SuspenseLoading />}>
      <Routes>
        {/* Ruta de login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage />
            )
          }
        />

        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard principal */}
          <Route index element={<DashboardPage />} />

          {/* Rutas de tickets */}
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="tickets/new" element={<CreateTicketPage />} />
          <Route path="tickets/:id" element={<TicketDetailPage />} />

          {/* Rutas de usuarios (solo administradores) */}
          <Route
            path="users"
            element={
              <ProtectedRoute requiredRole="administrador">
                <UsersPage />
              </ProtectedRoute>
            }
          />

          {/* Ruta de perfil */}
          <Route path="profile" element={<ProfilePage />} />

          {/* Ruta de notificaciones */}
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;