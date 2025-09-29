import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const NotificationsPage = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Notificaciones
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="body1">
            Centro de notificaciones en desarrollo...
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NotificationsPage;