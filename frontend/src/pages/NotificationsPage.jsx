import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  Tabs,
  Tab,
  Pagination,
  Tooltip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  MarkEmailRead as MarkEmailReadIcon,
  ConfirmationNumber as TicketIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { notificationService } from '../services/notificationService.js';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/formatters.js';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [tabValue, setTabValue] = useState(0); // 0: Todas, 1: No leídas
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  });

  useEffect(() => {
    loadNotifications();
  }, [tabValue, page]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationService.getNotifications({
        page: page,
        limit: 20,
        unreadOnly: tabValue === 1
      });
      setNotifications(response.notifications || []);
      setPagination(response.pagination || {});
    } catch (err) {
      setError('Error al cargar notificaciones: ' + err.message);
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setSuccess('Notificación marcada como leída');
      loadNotifications();
    } catch (err) {
      setError('Error al marcar notificación como leída');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setSuccess('Todas las notificaciones marcadas como leídas');
      loadNotifications();
    } catch (err) {
      setError('Error al marcar todas como leídas');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setSuccess('Notificación eliminada');
      loadNotifications();
    } catch (err) {
      setError('Error al eliminar notificación');
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.ticket_id) {
      navigate(`/tickets/${notification.ticket_id}`);
    }
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ticket_created':
      case 'ticket_assigned':
      case 'ticket_updated':
        return <TicketIcon color="primary" />;
      case 'ticket_commented':
        return <InfoIcon color="info" />;
      case 'ticket_priority_changed':
        return <WarningIcon color="warning" />;
      case 'ticket_closed':
        return <CheckCircleIcon color="success" />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getNotificationColor = (notification) => {
    if (!notification.is_read) {
      return 'rgba(25, 118, 210, 0.08)'; // Azul claro para no leídas
    }
    return 'transparent';
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Notificaciones
        </Typography>
        <Button
          variant="outlined"
          startIcon={<MarkEmailReadIcon />}
          onClick={handleMarkAllAsRead}
          disabled={loading || notifications.length === 0}
        >
          Marcar todas como leídas
        </Button>
      </Box>

      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>{success}</Alert>}

      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => { setTabValue(newValue); setPage(1); }}>
          <Tab label="Todas" />
          <Tab label="No leídas" />
        </Tabs>
      </Paper>

      {/* Lista de notificaciones */}
      <Card>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={4}>
            <CircularProgress />
          </Box>
        ) : notifications.length === 0 ? (
          <CardContent>
            <Box display="flex" flexDirection="column" alignItems="center" py={4}>
              <NotificationsIcon sx={{ fontSize: 64, color: 'action.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No hay notificaciones
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tabValue === 1 ? 'No tienes notificaciones sin leer' : 'Aún no has recibido ninguna notificación'}
              </Typography>
            </Box>
          </CardContent>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    backgroundColor: getNotificationColor(notification),
                    cursor: notification.ticket_id ? 'pointer' : 'default',
                    '&:hover': {
                      backgroundColor: notification.ticket_id ? 'action.hover' : getNotificationColor(notification)
                    },
                    py: 2
                  }}
                  onClick={() => handleNotificationClick(notification)}
                  secondaryAction={
                    <Box display="flex" gap={1}>
                      {!notification.is_read && (
                        <Tooltip title="Marcar como leída">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(notification.id);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Typography variant="body1" component="span" fontWeight={notification.is_read ? 'normal' : 'bold'}>
                          {notification.message}
                        </Typography>
                        {!notification.is_read && (
                          <Chip label="Nueva" size="small" color="primary" />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box display="flex" flexDirection="column" gap={0.5}>
                        {notification.ticket_number && (
                          <Typography variant="caption" color="text.secondary">
                            Ticket #{notification.ticket_number} - {notification.ticket_title}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(notification.created_at)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Card>

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={pagination.totalPages}
            page={page}
            onChange={(e, newPage) => setPage(newPage)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Información de totales */}
      {notifications.length > 0 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Typography variant="body2" color="text.secondary">
            Mostrando {notifications.length} de {pagination.totalItems} notificaciones
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default NotificationsPage;