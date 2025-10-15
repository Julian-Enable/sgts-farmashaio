import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Chip,
  Button,
  IconButton,
  Divider,
  TextField,
  Avatar,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Comment as CommentIcon,
  History as HistoryIcon,
  Assignment as AssignIcon,
  Send as SendIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

import { useAuth } from '../context/AuthContext.jsx';
import { ticketService } from '../services/ticketService.js';
import { userService } from '../services/userService.js';
import { TICKET_STATUS, TICKET_PRIORITY } from '../utils/constants.js';

const TicketDetailPage = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estado
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [history, setHistory] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para acciones
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [statusComment, setStatusComment] = useState('');

  // Cargar datos
  useEffect(() => {
    loadTicketData();
  }, [id]);

  const loadTicketData = async () => {
    try {
      setLoading(true);
      setError(null);

      // getTicketById ya retorna el ticket directamente
      const ticketData = await ticketService.getTicketById(id);
      setTicket(ticketData);

      // Cargar comentarios e historial (manejar si no existen los endpoints aún)
      try {
        const commentsData = await ticketService.getTicketComments(id);
        setComments(commentsData || []);
      } catch (err) {
        console.log('Comments not available yet');
        setComments([]);
      }

      try {
        const historyData = await ticketService.getTicketHistory(id);
        setHistory(historyData || []);
      } catch (err) {
        console.log('History not available yet');
        setHistory([]);
      }

      // Cargar técnicos si es admin o técnico
      if (user.role === 'administrador' || user.role === 'tecnico') {
        try {
          console.log('🔧 Cargando técnicos...');
          const techData = await userService.getTechnicians();
          console.log('✅ Técnicos cargados:', techData);
          setTechnicians(techData || []);
        } catch (err) {
          console.error('❌ Error cargando técnicos:', err);
          setTechnicians([]);
        }
      }
    } catch (err) {
      setError('Error al cargar el ticket');
      console.error('Error loading ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      await ticketService.addComment(id, newComment);
      setNewComment('');
      
      // Recargar comentarios
      const commentsResponse = await ticketService.getTicketComments(id);
      setComments(commentsResponse.comments || []);
    } catch (err) {
      setError('Error al agregar comentario');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleStatusChange = async () => {
    try {
      // Obtener el ID del estado seleccionado
      const statusId = TICKET_STATUS[selectedStatus]?.id;
      if (!statusId) {
        setError('Estado inválido seleccionado');
        return;
      }
      
      await ticketService.updateTicketStatus(id, statusId, statusComment);
      setStatusDialogOpen(false);
      setSelectedStatus('');
      setStatusComment('');
      
      // Recargar datos
      await loadTicketData();
    } catch (err) {
      setError('Error al cambiar el estado');
    }
  };

  const handleAssignTicket = async () => {
    try {
      await ticketService.assignTicket(id, selectedTechnician);
      setAssignDialogOpen(false);
      setSelectedTechnician('');
      
      // Recargar datos
      await loadTicketData();
    } catch (err) {
      setError('Error al asignar el ticket');
    }
  };

  // Funciones auxiliares
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
    return new Date(dateString).toLocaleString('es-ES');
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width="60%" height={48} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="80%" height={32} />
                <Skeleton variant="text" width="100%" height={100} />
                <Skeleton variant="rectangular" height={200} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Skeleton variant="rectangular" height={300} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error && !ticket) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          startIcon={<BackIcon />}
          onClick={() => navigate('/tickets')}
        >
          Volver a Tickets
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate('/tickets')} sx={{ mr: 2 }}>
            <BackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1">
              Ticket #{ticket.id}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {ticket.title}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Contenido Principal */}
        <Grid item xs={12} md={8}>
          {/* Información del Ticket */}
          <Card sx={{ mb: 3 }}>
            <CardHeader
              title={ticket.title}
              subheader={`Creado el ${formatDate(ticket.createdAt)}`}
              action={
                <Box display="flex" gap={1}>
                  <Chip
                    label={ticket.status?.name || 'Sin estado'}
                    sx={{ bgcolor: ticket.status?.color || '#gray', color: 'white' }}
                  />
                  <Chip
                    label={ticket.priority?.name || 'Sin prioridad'}
                    sx={{ bgcolor: ticket.priority?.color || '#gray', color: 'white' }}
                    variant="outlined"
                  />
                </Box>
              }
            />
            <Divider />
            <CardContent>
              <Typography variant="body1" paragraph>
                {ticket.description}
              </Typography>
              
              {/* Información adicional */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PersonIcon color="action" />
                    <Typography variant="body2">
                      Creado por: {ticket.requester?.name || 'Desconocido'}
                    </Typography>
                  </Box>
                </Grid>
                {ticket.assignedUser && (
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AssignIcon color="action" />
                      <Typography variant="body2">
                        Asignado a: {ticket.assignedUser?.name || 'Sin asignar'}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <TimeIcon color="action" />
                    <Typography variant="body2">
                      Última actualización: {formatDate(ticket.updatedAt)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Comentarios */}
          <Card>
            <CardHeader
              title={`Comentarios (${comments.length})`}
              avatar={<CommentIcon />}
            />
            <Divider />
            <CardContent>
              {/* Nuevo comentario */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Agregar un comentario..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  startIcon={<SendIcon />}
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || submittingComment}
                >
                  {submittingComment ? 'Enviando...' : 'Comentar'}
                </Button>
              </Box>

              {/* Lista de comentarios */}
              {comments.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No hay comentarios aún
                </Typography>
              ) : (
                <Box>
                  {comments.map((comment, index) => (
                    <Box key={comment.id || index} sx={{ mb: 3 }}>
                      <Box display="flex" alignItems="center" gap={2} mb={1}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {comment.author?.firstName?.[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {comment.author?.firstName} {comment.author?.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(comment.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                      <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Typography variant="body2">
                          {comment.content}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Panel Lateral */}
        <Grid item xs={12} md={4}>
          {/* Acciones */}
          <Card sx={{ mb: 3 }}>
            <CardHeader title="Acciones" />
            <Divider />
            <CardContent>
              <Box display="flex" flexDirection="column" gap={2}>
                {(user.role === 'administrador' || user.role === 'tecnico') && (
                  <>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<CheckIcon />}
                      onClick={() => setStatusDialogOpen(true)}
                    >
                      Cambiar Estado
                    </Button>
                    
                    {user.role === 'administrador' && (
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<AssignIcon />}
                        onClick={() => setAssignDialogOpen(true)}
                      >
                        {ticket.assignedTo ? 'Reasignar' : 'Asignar'}
                      </Button>
                    )}
                  </>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Historial */}
          <Card>
            <CardHeader title="Historial" avatar={<HistoryIcon />} />
            <Divider />
            <CardContent>
              {history.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No hay historial disponible
                </Typography>
              ) : (
                <Box>
                  {history.map((event, index) => (
                    <Paper
                      key={event.id || index}
                      elevation={1}
                      sx={{ 
                        p: 2, 
                        mb: 2, 
                        borderLeft: '4px solid',
                        borderLeftColor: 'primary.main'
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                          {event.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                          {formatDate(event.createdAt)}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        por {event.user?.firstName} {event.user?.lastName}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog Cambiar Estado */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cambiar Estado del Ticket</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel>Nuevo Estado</InputLabel>
            <Select
              value={selectedStatus}
              label="Nuevo Estado"
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {Object.entries(TICKET_STATUS).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Comentario (opcional)"
            placeholder="Agrega un comentario sobre el cambio de estado..."
            value={statusComment}
            onChange={(e) => setStatusComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleStatusChange}
            disabled={!selectedStatus}
          >
            Cambiar Estado
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Asignar Técnico */}
      <Dialog
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {ticket?.assignedTo ? 'Reasignar Ticket' : 'Asignar Ticket'}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Técnico</InputLabel>
            <Select
              value={selectedTechnician}
              label="Técnico"
              onChange={(e) => setSelectedTechnician(e.target.value)}
            >
              {Array.isArray(technicians) && technicians.map((tech) => (
                <MenuItem key={tech.id} value={tech.id}>
                  {tech.name} - {tech.department}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleAssignTicket}
            disabled={!selectedTechnician}
          >
            Asignar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TicketDetailPage;