import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Skeleton,
  Fab,
  useTheme,
  useMediaQuery,
  Paper,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  ConfirmationNumber as TicketIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

import { useAuth } from '../context/AuthContext.jsx';
import { ticketService } from '../services/ticketService.js';
import { TICKET_STATUS, TICKET_PRIORITY } from '../utils/constants.js';
import TicketCard from '../components/TicketCard.jsx';

const TicketsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  // Estado
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  // Filtros
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    priority: searchParams.get('priority') || '',
    assignedTo: searchParams.get('assignedTo') || '',
    category: searchParams.get('category') || '',
  });

  // Cargar tickets
  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const tickets = await ticketService.getTickets(filters);
      setTickets(tickets || []);
    } catch (err) {
      setError('Error al cargar los tickets');
      console.error('Error loading tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  // Efectos
  useEffect(() => {
    loadTickets();
  }, [filters]);

  // Handlers
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Actualizar URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      priority: '',
      assignedTo: '',
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

  if (loading && tickets.length === 0) {
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
      {/* Header con gradiente azul como Dashboard */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          borderRadius: 3,
          p: 4,
          mb: 4,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(30%, -30%)',
          },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          sx={{ position: 'relative', zIndex: 1 }}
        >
          <Box>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TicketIcon sx={{ fontSize: 28 }} />
              </Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                Gestión de Tickets
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ opacity: 0.95, fontSize: '1rem' }}>
              {tickets.length} {tickets.length === 1 ? 'ticket encontrado' : 'tickets encontrados'}
            </Typography>
          </Box>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setFilterDialogOpen(true)}
              sx={{
                borderRadius: 2,
                borderWidth: 2,
                borderColor: 'rgba(255, 255, 255, 0.5)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  borderWidth: 2,
                  borderColor: 'white',
                  background: 'rgba(255, 255, 255, 0.1)',
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
                  color: '#1976d2',
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
        </Box>
      </Box>

      {/* Barra de búsqueda y filtros rápidos con diseño moderno */}
      <Card 
        sx={{ 
          mb: 4,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Buscar por título, número o descripción..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
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
            <Grid item xs={6} md={2}>
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
            <Grid item xs={12} md={4}>
              <Box display="flex" gap={1} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ClearIcon />}
                  onClick={clearFilters}
                >
                  Limpiar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Mensaje de error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Lista de tickets con animación */}
      {tickets.length === 0 ? (
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
          {tickets.map((ticket, index) => (
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