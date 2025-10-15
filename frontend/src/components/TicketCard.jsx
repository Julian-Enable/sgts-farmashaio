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
    const gradients = {
      error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      default: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
    };
    return gradients[priorityConfig.color] || gradients.default;
  };

  return (
    <Card
      onClick={handleView}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        border: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${alpha(theme.palette[priorityConfig.color]?.main || theme.palette.grey.main, 0.15)}`,
        },
      }}
    >
      {/* Gradiente de fondo sutil */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '120px',
          height: '120px',
          background: getGradient(),
          opacity: 0.08,
          borderRadius: '50%',
          transform: 'translate(30%, -30%)',
        }}
      />

      <CardContent sx={{ position: 'relative', p: 3, flexGrow: 1 }}>
        {/* Número de ticket y prioridad */}
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: '0.75rem',
            }}
          >
            #{ticket.ticketNumber}
          </Typography>
          <Chip
            label={priorityConfig.label || priorityKey || 'Sin prioridad'}
            size="small"
            sx={{
              height: 24,
              bgcolor: alpha(theme.palette[priorityConfig.color]?.main || '#9e9e9e', 0.1),
              color: `${priorityConfig.color || 'grey'}.main`,
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
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

        {/* Estado */}
        <Box display="flex" gap={1} mb={2} flexWrap="wrap" alignItems="center">
          <Chip
            label={statusConfig.label || statusKey || 'Sin estado'}
            size="small"
            sx={{
              height: 24,
              bgcolor: alpha(theme.palette[statusConfig.color]?.main || '#9e9e9e', 0.1),
              color: `${statusConfig.color || 'grey'}.main`,
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
          {ticket.categoryName && (
            <Chip
              label={ticket.categoryName}
              size="small"
              icon={<CategoryIcon sx={{ fontSize: 14 }} />}
              sx={{
                height: 24,
                bgcolor: alpha(theme.palette.info.main, 0.08),
                fontSize: '0.75rem',
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

        {/* Info compacta */}
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              fontWeight: 500,
              fontSize: '0.75rem',
            }}
          >
            Creado por: {ticket.requesterName || 'Sin creador'}
          </Typography>
          
          {ticket.assignedName && (
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar
                sx={{
                  width: 20,
                  height: 20,
                  fontSize: '0.7rem',
                  bgcolor: 'success.main',
                }}
              >
                {ticket.assignedName?.charAt(0)}
              </Avatar>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  fontWeight: 500,
                  fontSize: '0.75rem',
                }}
              >
                {ticket.assignedName}
              </Typography>
            </Box>
          )}
          
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              fontWeight: 500,
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <CalendarIcon sx={{ fontSize: 14 }} />
            {formatDate(ticket.createdAt)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TicketCard;
