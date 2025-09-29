import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const ProfilePage = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Mi Perfil
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="body1">
            Página de perfil de usuario en desarrollo...
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePage;