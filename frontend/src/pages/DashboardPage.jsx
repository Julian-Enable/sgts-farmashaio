import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  useTheme,
} from '@mui/material';
import {
  ConfirmationNumber,
  Assignment,
  Schedule,
  CheckCircle,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';

const DashboardPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Stats de ejemplo (en producción vendrían de la API)
  const stats = {
    total: 0,
    nuevos: 0,
    enProgreso: 0,
    resueltos: 0,
    misTickets: 0,
  };

  const StatCard = ({ title, value, color, icon, description }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Box
            sx={{
              backgroundColor: `${color}.main`,
              color: 'white',
              borderRadius: 2,
              p: 1,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h4" component="div" color={`${color}.main`}>
            {value}
          </Typography>
        </Box>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          ¡Bienvenido, {user?.firstName}!
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Chip
            label={user?.role === 'empleado' ? 'Empleado' : user?.role === 'tecnico' ? 'Técnico' : 'Administrador'}
            color={user?.role === 'administrador' ? 'error' : user?.role === 'tecnico' ? 'warning' : 'info'}
          />
          <Typography variant="body1" color="text.secondary">
            {user?.department}
          </Typography>
        </Box>
      </Box>

      {/* Estadísticas */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Tickets"
            value={stats.total}
            color="primary"
            icon={<ConfirmationNumber />}
            description="Todos los tickets en el sistema"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Nuevos"
            value={stats.nuevos}
            color="info"
            icon={<Assignment />}
            description="Tickets recién creados"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="En Progreso"
            value={stats.enProgreso}
            color="warning"
            icon={<Schedule />}
            description="Tickets siendo atendidos"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Resueltos"
            value={stats.resueltos}
            color="success"
            icon={<CheckCircle />}
            description="Tickets completados"
          />
        </Grid>
      </Grid>

      {/* Acciones Rápidas */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Acciones Rápidas
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/tickets/new')}
            >
              Crear Ticket
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/tickets')}
            >
              Ver Todos los Tickets
            </Button>
            {user?.role !== 'empleado' && (
              <Button
                variant="outlined"
                onClick={() => navigate('/tickets?assignedTo=me')}
              >
                Mis Asignados
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardPage;