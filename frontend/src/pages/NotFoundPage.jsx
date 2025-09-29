import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      textAlign="center"
      gap={2}
    >
      <Typography variant="h1" component="h1" sx={{ fontSize: '4rem', fontWeight: 'bold' }}>
        404
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        Página no encontrada
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        La página que buscas no existe o ha sido movida.
      </Typography>
      <Button
        variant="contained"
        startIcon={<HomeIcon />}
        onClick={() => navigate('/')}
      >
        Volver al Dashboard
      </Button>
    </Box>
  );
};

export default NotFoundPage;