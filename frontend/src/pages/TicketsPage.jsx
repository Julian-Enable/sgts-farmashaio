import React, { useState, useEffect } from 'react';
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
  Chip,
  InputAdornment,
  Pagination,
  TablePagination,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import TicketCard from '../components/TicketCard';
import { TICKET_STATUS, TICKET_PRIORITY } from '../utils/constants';
import { ConfirmationNumber as TicketIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { ticketService } from '../services/ticketService';

const TicketsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    priority: searchParams.get('priority') || '',
    category: searchParams.get('category') || '',
  });
  
  // Paginación
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 0);
  const [rowsPerPage, setRowsPerPage] = useState(parseInt(searchParams.get('perPage')) || 10);
  
  // Ordenamiento
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');
  
  // Vista
  const [viewMode, setViewMode] = useState(searchParams.get('view') || 'grid');
  
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Detectar si es móvil
  const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 600px)').matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 600px)');
    const handleResize = () => setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleResize);
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  const [ticketsData, setTicketsData] = useState({
    tickets: [],
    total: 0,
  });

  // Cargar tickets
  useEffect(() => {
    setLoading(true);
    ticketService.getTickets()
      .then((data) => {
        setTicketsData({
          tickets: data.tickets || [],
          total: data.total || 0,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading tickets:', err);
        setError('Error al cargar los tickets');
        setLoading(false);
      });
  }, []);

  // Aplicar filtros y ordenamiento a los tickets
  const getFilteredAndSortedTickets = () => {
    let filtered = [...ticketsData.tickets];

    // Filtro de búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(ticket => 
        ticket.title?.toLowerCase().includes(searchLower) ||
        ticket.description?.toLowerCase().includes(searchLower) ||
        ticket.id?.toString().includes(searchLower)
      );
    }

    // Filtro de estado
    if (filters.status) {
      filtered = filtered.filter(ticket => 
        ticket.statusName?.toLowerCase() === TICKET_STATUS[filters.status]?.label?.toLowerCase() ||
        ticket.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Filtro de prioridad
    if (filters.priority) {
      filtered = filtered.filter(ticket => {
        const priorityName = typeof ticket.priorityName === 'string' ? ticket.priorityName.toLowerCase() : '';
        const priority = typeof ticket.priority === 'string' ? ticket.priority.toLowerCase() : '';
        const filterPriority = typeof filters.priority === 'string' ? filters.priority.toLowerCase() : '';
        const labelPriority = TICKET_PRIORITY[filters.priority]?.label?.toLowerCase() || '';
        return priorityName === labelPriority || priority === filterPriority;
      });
    }

    // Filtro de categoría
    if (filters.category) {
      filtered = filtered.filter(ticket => 
        ticket.categoryName?.toLowerCase().includes(filters.category.toLowerCase()) ||
        ticket.category?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt || 0).getTime();
          bValue = new Date(b.createdAt || 0).getTime();
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt || 0).getTime();
          bValue = new Date(b.updatedAt || 0).getTime();
          break;
        case 'priority':
          const priorityOrder = { 'critica': 5, 'alta': 4, 'media': 3, 'baja': 2, 'muy-baja': 1 };
          aValue = priorityOrder[typeof a.priority === 'string' ? a.priority.toLowerCase() : ''] || 0;
          bValue = priorityOrder[typeof b.priority === 'string' ? b.priority.toLowerCase() : ''] || 0;
          break;
        case 'status':
          aValue = a.statusName || '';
          bValue = b.statusName || '';
          break;
        case 'title':
          aValue = a.title?.toLowerCase() || '';
          bValue = b.title?.toLowerCase() || '';
          break;
        default:
          aValue = a.id || 0;
          bValue = b.id || 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return filtered;
  };

  const filteredTickets = getFilteredAndSortedTickets();

  // Paginación
  const paginatedTickets = filteredTickets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filters,
      [key]: value,
    };
    setFilters(newFilters);
    setPage(0); // Reset a la primera página cuando cambian los filtros

    // Actualizar URL params
    updateURLParams({ ...newFilters, page: 0 });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    updateURLParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    updateURLParams({ perPage: newRowsPerPage, page: 0 });
  };

  const handleSortChange = (field) => {
    const newOrder = sortBy === field && sortOrder === 'desc' ? 'asc' : 'desc';
    setSortBy(field);
    setSortOrder(newOrder);
    updateURLParams({ sortBy: field, sortOrder: newOrder });
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
      updateURLParams({ view: newView });
    }
  };

  const updateURLParams = (updates) => {
    const params = new URLSearchParams(searchParams);
    
    // Actualizar con nuevos valores
    Object.entries({ ...filters, page, rowsPerPage, sortBy, sortOrder, viewMode, ...updates }).forEach(([key, value]) => {
      if (value) {
        params.set(key === 'rowsPerPage' ? 'perPage' : key, value.toString());
      } else {
        params.delete(key === 'rowsPerPage' ? 'perPage' : key);
      }
    });
    
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      priority: '',
      category: '',
    });
    setPage(0);
    setSearchParams({});
  };

  const handleCreateTicket = () => {
    navigate('/tickets/create');
  };

  // Contar filtros activos
  const activeFiltersCount = Object.values(filters).filter(v => v).length;

  if (loading && ticketsData.tickets.length === 0) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Tickets
        </Typography>
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
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
      {/* Header moderno con gradiente */}
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
        
        <Box position="relative" zIndex={1}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            Gestión de Tickets
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
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
              Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
            
            {activeFiltersCount > 0 && (
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                sx={{
                  borderRadius: 2,
                  borderWidth: 2,
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': {
                    borderWidth: 2,
                    borderColor: 'white',
                  },
                }}
              >
                Limpiar Filtros
              </Button>
            )}
            
            {(user?.role === 'empleado' || user?.role === 'administrador') && (
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
        </Box>
      </Paper>

      {/* Barra de búsqueda y controles */}
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={9}>
              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Buscar por título, descripción o número de ticket..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ borderRadius: 3, bgcolor: 'background.paper' }}
                />
                <FormControl fullWidth size="small" sx={{ minWidth: 220, borderRadius: 3 }}>
                  <InputLabel>Ordenar por</InputLabel>
                  <Select
                    value={sortBy}
                    label="Ordenar por"
                    onChange={(e) => handleSortChange(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <SortIcon />
                      </InputAdornment>
                    }
                    sx={{ borderRadius: 3, bgcolor: 'background.paper', height: 40 }}
                  >
                    <MenuItem value="createdAt">Fecha de creación</MenuItem>
                    <MenuItem value="updatedAt">Última actualización</MenuItem>
                    <MenuItem value="priority">Prioridad</MenuItem>
                    <MenuItem value="status">Estado</MenuItem>
                    <MenuItem value="title">Título</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Box display="flex" justifyContent="flex-end" gap={1}>
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={handleViewChange}
                  size="small"
                >
                  <ToggleButton value="grid" aria-label="vista de cuadrícula">
                    <GridViewIcon />
                  </ToggleButton>
                  <ToggleButton value="list" aria-label="vista de lista">
                    <ListViewIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
                
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleSortChange(sortBy)}
                  sx={{ minWidth: 'auto', px: 1 }}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Chips de filtros activos */}
      {activeFiltersCount > 0 && (
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {filters.status && (
            <Chip
              label={`Estado: ${TICKET_STATUS[filters.status]?.label || filters.status}`}
              onDelete={() => handleFilterChange('status', '')}
              color="primary"
            />
          )}
          {filters.priority && (
            <Chip
              label={`Prioridad: ${TICKET_PRIORITY[filters.priority]?.label || filters.priority}`}
              onDelete={() => handleFilterChange('priority', '')}
              color="warning"
            />
          )}
          {filters.category && (
            <Chip
              label={`Categoría: ${filters.category}`}
              onDelete={() => handleFilterChange('category', '')}
              color="secondary"
            />
          )}
        </Box>
      )}

      {/* Mensaje de error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Información de resultados y paginación superior */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Mostrando {paginatedTickets.length > 0 ? page * rowsPerPage + 1 : 0} - {Math.min((page + 1) * rowsPerPage, filteredTickets.length)} de {filteredTickets.length} tickets
          {filteredTickets.length !== ticketsData.total && ` (${ticketsData.total} total)`}
        </Typography>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            displayEmpty
          >
            <MenuItem value={10}>10 por página</MenuItem>
            <MenuItem value={20}>20 por página</MenuItem>
            <MenuItem value={50}>50 por página</MenuItem>
            <MenuItem value={100}>100 por página</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Lista de tickets */}
      {filteredTickets.length === 0 ? (
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
              {activeFiltersCount > 0
                ? 'No se encontraron tickets con los filtros aplicados. Intenta ajustar tus criterios de búsqueda.'
                : 'Aún no tienes tickets creados. Crea tu primer ticket para comenzar a gestionar solicitudes.'}
            </Typography>
            {activeFiltersCount > 0 ? (
              <Button
                variant="contained"
                size="large"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                sx={{
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  px: 4,
                  py: 1.5,
                }}
              >
                Limpiar Filtros
              </Button>
            ) : (
              (user?.role === 'empleado' || user?.role === 'administrador') && (
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
              )
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <Grid container spacing={viewMode === 'grid' ? 3 : 2}>
            {paginatedTickets.map((ticket, index) => (
              <Grid
                item
                xs={12}
                sm={viewMode === 'grid' ? 6 : 12}
                lg={viewMode === 'grid' ? 4 : 12}
                key={ticket.id}
                sx={{
                  animation: 'fadeInUp 0.4s ease-out',
                  animationDelay: `${index * 0.03}s`,
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
                <TicketCard ticket={ticket} viewMode={viewMode} />
              </Grid>
            ))}
          </Grid>

          {/* Paginación inferior */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Stack spacing={2} alignItems="center">
              <Pagination
                count={Math.ceil(filteredTickets.length / rowsPerPage)}
                page={page + 1}
                onChange={(e, newPage) => handleChangePage(e, newPage - 1)}
                color="primary"
                size={isMobile ? 'small' : 'large'}
                showFirstButton
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2,
                    fontWeight: 600,
                  },
                }}
              />
              
              <Typography variant="caption" color="text.secondary">
                Página {page + 1} de {Math.ceil(filteredTickets.length / rowsPerPage)}
              </Typography>
            </Stack>
          </Box>
        </>
      )}

      {/* FAB para móvil */}
      {isMobile && (user?.role === 'empleado' || user?.role === 'administrador') && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            boxShadow: '0 4px 14px rgba(25, 118, 210, 0.4)',
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
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.5rem' }}>
          Filtros Avanzados
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Buscar en título y descripción"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Categoría"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                placeholder="Ej: Software, Hardware, Red..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={clearFilters}
            startIcon={<ClearIcon />}
            sx={{ fontWeight: 600 }}
          >
            Limpiar Todo
          </Button>
          <Button 
            onClick={() => setFilterDialogOpen(false)}
            variant="contained"
            sx={{ fontWeight: 600 }}
          >
            Aplicar Filtros
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TicketsPage;