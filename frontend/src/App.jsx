import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

import { useAuth } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Logo from './components/Logo.jsx';

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

// Componente de loading unificado


const LoadingScreen = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, rgb(37,99,235) 0%, rgb(30,64,175) 100%)',
      gap: 3,
    }}
  >
    <Logo variant="full" size="large" />
    <CircularProgress size={40} sx={{ color: 'white' }} />
    <Typography variant="body2" color="white" sx={{ opacity: 0.9, mt: 2 }}>
      Cargando sistema...
    </Typography>
  </Box>
);


function App() {
  const { isLoading, isAuthenticated } = useAuth();

  // Mostrar pantalla de carga mientras se restaura la sesión
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
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

          {/* Ruta de perfil dentro del Layout */}
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