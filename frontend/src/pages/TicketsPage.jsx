import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import TicketCard from '../components/TicketCard';
import { TICKET_STATUS, TICKET_PRIORITY } from '../utils/constants';
import { ConfirmationNumber as TicketIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import ticketService from '../services/ticketService';

const TicketsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    category: '',
  });
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Detectar si es móvil usando window.matchMedia
  const isMobile = window.matchMedia('(max-width: 600px)').matches;

  // Simulación de datos y carga
  const [ticketsData, setTicketsData] = useState({
    tickets: [],
    total: 0,
  });

  useEffect(() => {
    setLoading(true);
    ticketService.getTickets()
      .then((data) => {
        setTicketsData({
          tickets: data.tickets,
          total: data.total,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError('Error al cargar los tickets');
        setLoading(false);
      });
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      category: '',
    });
    setSearchParams({});
  };

  const handleCreateTicket = () => {
    navigate('/tickets/create');
  };

  const handleViewTicket = (ticketId) => {
    navigate(`/tickets/${ticketId}`);
  };

  const getStatusColor = (status) => {
    const colors = {
      nuevo: 'primary',
      asignado: 'warning',
      'en-progreso': 'info',
      'esperando-usuario': 'secondary',
      resuelto: 'success',
      cerrado: 'default',
    };
    return colors[status] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'muy-baja': 'success',
      baja: 'info',
      media: 'warning',
      alta: 'error',
      critica: 'error',
    };
    return colors[priority] || 'default';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && ticketsData.tickets.length === 0) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Tickets
        </Typography>
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="80%" height={32} />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="rectangular" height={60} sx={{ mt: 1 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header moderno con gradiente - Idéntico al Dashboard */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Pattern de fondo */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(30%, -30%)',
          }}
        />
        <Box position="relative" sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setFilterDialogOpen(true)}
            sx={{
              borderRadius: 2,
              borderWidth: 2,
              borderColor: 'rgba(255, 255, 255, 0.5)',
              color: 'white',
              background: 'rgba(30,64,175,0.7)',
              fontWeight: 700,
              px: 3,
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              '&:hover': {
                borderWidth: 2,
                borderColor: 'white',
                background: 'rgba(30,64,175,1)',
              },
            }}
          >
            Filtros
          </Button>
          {/* Solo empleados y admins pueden crear tickets */}
          {(user.role === 'empleado' || user.role === 'administrador') && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateTicket}
              sx={{
                borderRadius: 2,
                background: 'white',
                color: '#2563eb',
                fontWeight: 600,
                px: 3,
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Crear Ticket
            </Button>
          )}
        </Box>
      </Paper>

      {/* Barra de búsqueda y filtros rápidos con diseño moderno */}
      {/* ...existing code... */}

      {/* Mensaje de error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Lista de tickets con animación */}
      {ticketsData.tickets.length === 0 ? (
        <Card
          sx={{
            borderRadius: 3,
            textAlign: 'center',
            py: 8,
            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(21, 101, 192, 0.05) 100%)',
            border: '2px dashed',
            borderColor: 'divider',
          }}
        >
          <CardContent>
            <Box
              sx={{
                width: 120,
                height: 120,
                margin: '0 auto 24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': {
                    transform: 'scale(1)',
                    opacity: 1,
                  },
                  '50%': {
                    transform: 'scale(1.05)',
                    opacity: 0.9,
                  },
                },
              }}
            >
              <TicketIcon sx={{ fontSize: 64, color: 'white' }} />
            </Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
              No hay tickets disponibles
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4} sx={{ maxWidth: 500, mx: 'auto' }}>
              {Object.values(filters).some(f => f)
                ? 'No se encontraron tickets con los filtros aplicados. Intenta ajustar tus criterios de búsqueda.'
                : 'Aún no tienes tickets creados. Crea tu primer ticket para comenzar a gestionar solicitudes.'}
            </Typography>
            {(user.role === 'empleado' || user.role === 'administrador') && (
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={handleCreateTicket}
                sx={{
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  boxShadow: '0 4px 14px rgba(25, 118, 210, 0.4)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.6)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Crear Primer Ticket
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {ticketsData.tickets.map((ticket, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              lg={4}
              key={ticket.id}
              sx={{
                animation: 'fadeInUp 0.5s ease-out',
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both',
                '@keyframes fadeInUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(20px)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              <TicketCard ticket={ticket} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* FAB para móvil */}
      {isMobile && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
          onClick={handleCreateTicket}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Dialog de filtros avanzados */}
      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Filtros Avanzados</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Buscar en título y descripción"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filters.status}
                  label="Estado"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {Object.entries(TICKET_STATUS).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Prioridad</InputLabel>
                <Select
                  value={filters.priority}
                  label="Prioridad"
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                >
                  <MenuItem value="">Todas</MenuItem>
                  {Object.entries(TICKET_PRIORITY).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={clearFilters}>Limpiar Todo</Button>
          <Button onClick={() => setFilterDialogOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TicketsPage;