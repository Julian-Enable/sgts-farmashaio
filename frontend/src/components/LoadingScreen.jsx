import React from 'react';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { APP_CONFIG } from '../utils/constants.js';

const LoadingScreen = ({ message = 'Cargando...' }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: theme.palette.primary.main,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      {/* Logo de la aplicación */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 4,
          color: 'white',
        }}
      >
        <Box
          sx={{
            fontSize: '3rem',
            lineHeight: 1,
          }}
        >
          📋
        </Box>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 500,
            color: 'white',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
          }}
        >
          {APP_CONFIG.NAME}
        </Typography>
      </Box>

      {/* Spinner de carga */}
      <CircularProgress
        size={50}
        thickness={4}
        sx={{
          color: 'white',
          mb: 3,
        }}
      />

      {/* Mensaje de carga */}
      <Typography
        variant="body1"
        sx={{
          color: 'white',
          fontSize: '1rem',
          fontWeight: 400,
        }}
      >
        {message}
      </Typography>

      {/* Información adicional */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 32,
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <Typography variant="body2" sx={{ mb: 1 }}>
          {APP_CONFIG.DESCRIPTION}
        </Typography>
        <Typography variant="caption">
          v{APP_CONFIG.VERSION} • {APP_CONFIG.COMPANY}
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingScreen;