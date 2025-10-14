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
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Assignment as TicketIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

import { useAuth } from '../context/AuthContext.jsx';
import { ticketService } from '../services/ticketService.js';
import { TICKET_STATUS, TICKET_PRIORITY } from '../utils/constants.js';

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
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="h4" component="h1">
          Gestión de Tickets
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setFilterDialogOpen(true)}
          >
            Filtros
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateTicket}
          >
            Crear Ticket
          </Button>
        </Box>
      </Box>

      {/* Barra de búsqueda y filtros rápidos */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Buscar tickets..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
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

      {/* Lista de tickets */}
      {tickets.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <TicketIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay tickets disponibles
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {Object.values(filters).some(f => f) 
                ? 'No se encontraron tickets con los filtros aplicados.'
                : 'Crea tu primer ticket para empezar.'}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateTicket}
            >
              Crear Primer Ticket
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {tickets.map((ticket) => (
            <Grid item xs={12} md={6} lg={4} key={ticket.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Header del ticket */}
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Typography variant="h6" component="h3" noWrap>
                      #{ticket.id}
                    </Typography>
                    <Box display="flex" gap={0.5}>
                      <Tooltip title="Ver detalles">
                        <IconButton
                          size="small"
                          onClick={() => handleViewTicket(ticket.id)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      {(user.role === 'administrador' || ticket.assignedTo === user.id) && (
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>

                  {/* Título */}
                  <Typography variant="subtitle1" gutterBottom noWrap>
                    {ticket.title}
                  </Typography>

                  {/* Descripción */}
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {ticket.description}
                  </Typography>

                  {/* Estado y Prioridad */}
                  <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                    <Chip
                      label={TICKET_STATUS[ticket.status]?.label || ticket.status}
                      color={getStatusColor(ticket.status)}
                      size="small"
                    />
                    <Chip
                      label={TICKET_PRIORITY[ticket.priority]?.label || ticket.priority}
                      color={getPriorityColor(ticket.priority)}
                      variant="outlined"
                      size="small"
                    />
                  </Box>

                  {/* Información adicional */}
                  <Typography variant="caption" color="text.secondary" display="block">
                    Creado: {formatDate(ticket.createdAt)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Creado por: {ticket.createdBy?.firstName} {ticket.createdBy?.lastName}
                  </Typography>
                  {ticket.assignedTo && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      Asignado a: {ticket.assignedTo?.firstName} {ticket.assignedTo?.lastName}
                    </Typography>
                  )}
                </CardContent>
              </Card>
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