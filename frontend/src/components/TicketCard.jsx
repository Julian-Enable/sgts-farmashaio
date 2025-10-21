import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Avatar,
  Divider,
  alpha,
  useTheme,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { TICKET_STATUS, TICKET_PRIORITY } from '../utils/constants.js';
import { formatDate } from '../utils/formatters.js';

// Función para calcular tiempo transcurrido y color
function getElapsedTimeColor(createdAt) {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now - created;
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours < 2) return { color: 'success', label: 'verde' };
  if (diffHours < 8) return { color: 'warning', label: 'amarillo' };
  return { color: 'error', label: 'rojo' };
}

function getElapsedTimeLabel(createdAt) {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now - created;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `Hace ${diffSec} seg`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Hace ${diffHours} horas`;
  const diffDays = Math.floor(diffHours / 24);
  return `Hace ${diffDays} días`;
}

const TicketCard = ({ ticket }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Manejar si status/priority son objetos o strings
  const statusKey = typeof ticket.status === 'object' ? ticket.status?.name : ticket.status;
  const priorityKey = typeof ticket.priority === 'object' ? ticket.priority?.name : ticket.priority;
  
  const statusConfig = TICKET_STATUS[statusKey] || {};
  const priorityConfig = TICKET_PRIORITY[priorityKey] || {};

  const handleView = () => {
    navigate(`/tickets/${ticket.id}`);
  };

  // Gradiente según prioridad
  const getGradient = () => {
    const color = priorityConfig.color || 'default';
    const gradients = {
      error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      default: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
    };
    return gradients[color] || gradients.default;
  };

  // Calcular color y label de tiempo transcurrido
  const elapsed = getElapsedTimeColor(ticket.createdAt);
  const elapsedLabel = getElapsedTimeLabel(ticket.createdAt);

  return (
    <Card
      onClick={handleView}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s, transform 0.2s',
        borderRadius: 3,
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        background: '#fafdff',
        border: 'none',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-2px) scale(1.01)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
      }}
    >
      <CardContent sx={{ position: 'relative', p: 3, flexGrow: 1 }}>
        {/* Número de ticket, prioridad y tiempo/estado */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: '#1976d2',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '0.85rem',
                background: '#e3f2fd',
                px: 1.2,
                py: 0.5,
                borderRadius: 2,
              }}
            >
              #{ticket.ticketNumber}
            </Typography>
            <Chip
              label={priorityConfig.label || priorityKey || 'Sin prioridad'}
              size="small"
              sx={{
                height: 24,
                bgcolor: priorityConfig.color ? alpha(theme.palette[priorityConfig.color]?.main || '#9e9e9e', 0.13) : alpha('#9e9e9e', 0.13),
                color: priorityConfig.color ? theme.palette[priorityConfig.color]?.main : 'grey.700',
                fontWeight: 700,
                fontSize: '0.8rem',
                borderRadius: 2,
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}
            />
          </Box>
          {/* Si está resuelto o cerrado, mostrar chip verde. Si no, mostrar tiempo transcurrido */}
          {(statusKey?.toLowerCase() === 'cerrado' || statusKey?.toLowerCase() === 'resuelto') ? (
            <Chip
              label={statusKey?.toLowerCase() === 'cerrado' ? 'Cerrado' : 'Resuelto'}
              size="small"
              sx={{
                height: 24,
                bgcolor: alpha(theme.palette.success.main, 0.18),
                color: theme.palette.success.main,
                fontWeight: 700,
                fontSize: '0.85rem',
                borderRadius: 2,
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                px: 2,
              }}
            />
          ) : (
            <Chip
              label={elapsedLabel}
              size="small"
              sx={{
                height: 24,
                bgcolor: alpha(theme.palette[elapsed.color].main, 0.18),
                color: theme.palette[elapsed.color].main,
                fontWeight: 700,
                fontSize: '0.85rem',
                borderRadius: 2,
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                px: 2,
              }}
            />
          )}
        </Box>

        {/* Título */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: '1.1rem',
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.6em',
            lineHeight: 1.3,
          }}
        >
          {ticket.title}
        </Typography>

        {/* Estado y categoría */}
        <Box display="flex" gap={1.5} mb={2} flexWrap="wrap" alignItems="center">
          <Chip
            label={statusConfig.label || statusKey || 'Sin estado'}
            size="small"
            sx={{
              height: 24,
              bgcolor: statusConfig.color ? alpha(theme.palette[statusConfig.color]?.main || '#9e9e9e', 0.13) : alpha('#9e9e9e', 0.13),
              color: statusConfig.color ? theme.palette[statusConfig.color]?.main : 'grey.700',
              fontWeight: 700,
              fontSize: '0.8rem',
              borderRadius: 2,
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
          />
          {ticket.categoryName && (
            <Chip
              label={ticket.categoryName}
              size="small"
              icon={<CategoryIcon sx={{ fontSize: 16, color: theme.palette.info.main }} />}
              sx={{
                height: 24,
                bgcolor: alpha(theme.palette.info.main, 0.13),
                color: theme.palette.info.main,
                fontWeight: 700,
                fontSize: '0.8rem',
                borderRadius: 2,
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}
            />
          )}
        </Box>

        {/* Descripción breve */}
        {ticket.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5,
              fontSize: '0.875rem',
            }}
          >
            {ticket.description}
          </Typography>
        )}

        {/* Divider */}
        <Divider sx={{ my: 2 }} />

        {/* Info compacta, sin avatar circular */}
        <Box display="flex" flexDirection="column" gap={1.2} mt={2}>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            Creado por: {ticket.requesterName || 'Sin creador'}
          </Typography>
          {ticket.assignedName && (
            <Typography 
              variant="caption" 
              color="success.main"
              sx={{ 
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              Asignado a: {ticket.assignedName}
            </Typography>
          )}
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              fontWeight: 500,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <CalendarIcon sx={{ fontSize: 16, color: theme.palette.info.main }} />
            {formatDate(ticket.createdAt)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TicketCard;
