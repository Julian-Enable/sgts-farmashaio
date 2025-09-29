import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const UsersPage = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestión de Usuarios
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="body1">
            Panel de administración de usuarios en desarrollo...
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UsersPage;