import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Button,
  Divider,
  Avatar,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ConfirmationNumber,
  CheckCircle,
  Close as CloseIcon,
  DoneAll as DoneAllIcon,
  Delete as DeleteIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';

const NotificationsPanel = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useNotifications();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ticket_created':
        return <ConfirmationNumber color="primary" />;
      case 'ticket_assigned':
        return <CheckCircle color="success" />;
      case 'ticket_updated':
        return <ConfirmationNumber color="warning" />;
      default:
        return <CircleIcon color="info" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'ticket_created':
        return 'primary';
      case 'ticket_assigned':
        return 'success';
      case 'ticket_updated':
        return 'warning';
      default:
        return 'info';
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.data?.id) {
      navigate(`/tickets/${notification.data.id}`);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Card sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Notificaciones
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {unreadCount > 0 ? `${unreadCount} sin leer` : 'No tienes notificaciones sin leer'}
              </Typography>
            </Box>
            <Box display="flex" gap={1}>
              {notifications.length > 0 && (
                <>
                  <Button
                    size="small"
                    startIcon={<DoneAllIcon />}
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                  >
                    Marcar todas como leídas
                  </Button>
                  <Button
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={clearNotifications}
                    color="error"
                  >
                    Limpiar
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Lista de Notificaciones */}
      {notifications.length === 0 ? (
        <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <CheckCircle sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>
            <Typography variant="h6" gutterBottom>
              No hay notificaciones
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Te notificaremos cuando haya actualizaciones
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {notifications.map((notification, index) => (
            <Card
              key={notification.id}
              sx={{
                border: '1px solid',
                borderColor: notification.read ? 'divider' : getNotificationColor(notification.type) + '.main',
                bgcolor: notification.read ? 'background.paper' : alpha(theme.palette[getNotificationColor(notification.type)].main, 0.05),
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
              }}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardContent>
                <Box display="flex" gap={2}>
                  {/* Icono */}
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette[getNotificationColor(notification.type)].main, 0.1),
                      color: getNotificationColor(notification.type) + '.main',
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                  </Avatar>

                  {/* Contenido */}
                  <Box flex={1}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={0.5}>
                      <Typography variant="subtitle2" fontWeight={notification.read ? 500 : 700}>
                        {notification.message}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(new Date(notification.timestamp), { 
                          addSuffix: true, 
                          locale: es 
                        })}
                      </Typography>
                      {!notification.read && (
                        <Chip
                          label="Nueva"
                          size="small"
                          color={getNotificationColor(notification.type)}
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default NotificationsPanel;
