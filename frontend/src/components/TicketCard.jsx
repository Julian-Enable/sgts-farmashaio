import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { TICKET_STATUS, TICKET_PRIORITY } from '../utils/constants.js';
import { formatDate } from '../utils/formatters.js';

const TicketCard = ({ ticket }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const statusConfig = TICKET_STATUS[ticket.status] || {};
  const priorityConfig = TICKET_PRIORITY[ticket.priority] || {};

  const handleView = () => {
    navigate(`/tickets/${ticket.id}`);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
          borderColor: 'primary.main',
        },
      }}
    >
      {/* Header con prioridad */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          bgcolor: alpha(theme.palette[priorityConfig.color]?.main || '#000', 0.05),
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          #{ticket.ticketNumber}
        </Typography>
        <Chip
          label={priorityConfig.label || ticket.priority}
          size="small"
          sx={{
            bgcolor: alpha(theme.palette[priorityConfig.color]?.main || '#000', 0.1),
            color: `${priorityConfig.color}.main`,
            fontWeight: 600,
            fontSize: '0.7rem',
            height: '22px',
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        {/* Título */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 600,
            fontSize: '1rem',
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '3em',
          }}
        >
          {ticket.title}
        </Typography>

        {/* Estado y categoría */}
        <Box display="flex" gap={1} mb={2} flexWrap="wrap">
          <Chip
            label={statusConfig.label || ticket.status}
            size="small"
            sx={{
              bgcolor: alpha(theme.palette[statusConfig.color]?.main || '#000', 0.08),
              fontWeight: 600,
              fontSize: '0.75rem',
              '&::before': {
                content: '""',
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: `${statusConfig.color}.main`,
                mr: 0.5,
              },
            }}
          />
          {ticket.categoryName && (
            <Chip
              label={ticket.categoryName}
              size="small"
              icon={<CategoryIcon sx={{ fontSize: 14 }} />}
              sx={{
                bgcolor: alpha(theme.palette.info.main, 0.08),
                fontSize: '0.75rem',
              }}
            />
          )}
        </Box>

        {/* Info adicional */}
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              Creado por: <strong>{ticket.requesterName}</strong>
            </Typography>
          </Box>
          
          {ticket.assignedName && (
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar
                sx={{
                  width: 20,
                  height: 20,
                  fontSize: '0.65rem',
                  bgcolor: 'primary.main',
                }}
              >
                {ticket.assignedName?.charAt(0)}
              </Avatar>
              <Typography variant="caption" color="text.secondary">
                Asignado a: <strong>{ticket.assignedName}</strong>
              </Typography>
            </Box>
          )}
          
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {formatDate(ticket.createdAt)}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions
        sx={{
          px: 2,
          py: 1.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: alpha(theme.palette.primary.main, 0.02),
        }}
      >
        <Tooltip title="Ver detalles">
          <IconButton
            size="small"
            onClick={handleView}
            sx={{
              color: 'primary.main',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <ViewIcon />
          </IconButton>
        </Tooltip>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="caption" color="text.secondary">
          ID: {ticket.id}
        </Typography>
      </CardActions>
    </Card>
  );
};

export default TicketCard;
