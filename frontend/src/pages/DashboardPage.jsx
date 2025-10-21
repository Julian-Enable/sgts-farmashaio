import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  useTheme,
  CircularProgress,
  Alert,
  alpha,
  Paper,
} from '@mui/material';
import {
  ConfirmationNumber,
  Assignment,
  Schedule,
  CheckCircle,
  Add as AddIcon,
  TrendingUp,
  TrendingDown,
  AccessTime,
  People,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  ShowChart as ShowChartIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { ticketService } from '../services/ticketService.js';

// Constantes para estados
const TICKET_STATUS = {
  NUEVO: 'Nuevo',
  ASIGNADO: 'Asignado',
  EN_PROGRESO: 'En Progreso',
  ESPERANDO_USUARIO: 'Esperando Usuario',
  RESUELTO: 'Resuelto',
  CERRADO: 'Cerrado',
  CANCELADO: 'Cancelado',
};

const RESOLVED_STATUSES = [TICKET_STATUS.RESUELTO, TICKET_STATUS.CERRADO];

const DashboardPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    total: 0,
    nuevos: 0,
    enProgreso: 0,
    resueltos: 0,
    misTickets: 0,
  });
  const [previousStats, setPreviousStats] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar estadísticas y tickets
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, ticketsResult] = await Promise.all([
          ticketService.getTicketStats(),
          ticketService.getTickets(),
        ]);
        
        // Guardar stats anteriores para calcular tendencias
        setPreviousStats(stats);
        
        setStats(statsData || {
          total: 0,
          nuevos: 0,
          enProgreso: 0,
          resueltos: 0,
          misTickets: 0,
        });
        setTickets(ticketsResult.tickets || []);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Error al cargar datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Calcular tendencia
  const calculateTrend = (current, previous) => {
    if (!previous || previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0,
    };
  };

  // Validar y parsear fecha
  const parseDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  // Procesar datos para gráficos
  const getStatusChartData = () => {
    if (tickets.length === 0) return [];
    
    const statusCount = {};
    tickets.forEach(ticket => {
      const status = ticket.statusName || 'Sin estado';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    return Object.entries(statusCount).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const getCategoryChartData = () => {
    if (tickets.length === 0) return [];
    
    const categoryCount = {};
    tickets.forEach(ticket => {
      const category = ticket.categoryName || 'Sin categoría';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    return Object.entries(categoryCount).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const getPriorityChartData = () => {
    if (tickets.length === 0) return [];
    
    const priorityCount = {};
    tickets.forEach(ticket => {
      const priority = ticket.priorityName || 'Sin prioridad';
      priorityCount[priority] = (priorityCount[priority] || 0) + 1;
    });

    return Object.entries(priorityCount).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const getTimelineChartData = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
      
      const dayTickets = tickets.filter(ticket => {
        const ticketDate = parseDate(ticket.createdAt);
        if (!ticketDate) return false;
        ticketDate.setHours(0, 0, 0, 0);
        return ticketDate.getTime() === date.getTime();
      });

      last7Days.push({
        date: dateStr,
        nuevos: dayTickets.filter(t => t.statusName === TICKET_STATUS.NUEVO).length,
        resueltos: dayTickets.filter(t => RESOLVED_STATUSES.includes(t.statusName)).length,
        total: dayTickets.length,
      });
    }

    return last7Days;
  };

  // Calcular tiempo promedio de resolución
  const getAvgResolutionTime = () => {
    const resolvedTickets = tickets.filter(ticket => 
      RESOLVED_STATUSES.includes(ticket.statusName)
    );
    
    if (resolvedTickets.length === 0) return 0;
    
    const totalMs = resolvedTickets.reduce((acc, ticket) => {
      const created = parseDate(ticket.createdAt);
      const updated = parseDate(ticket.updatedAt);
      
      if (!created || !updated) return acc;
      return acc + (updated.getTime() - created.getTime());
    }, 0);
    
    if (totalMs === 0) return 0;
    
    const avgMs = totalMs / resolvedTickets.length;
    // Convertir a horas
    return (avgMs / (1000 * 60 * 60)).toFixed(2);
  };

  // Últimos tickets resueltos con tiempo de resolución
  const getLastResolvedTickets = () => {
    return tickets
      .filter(ticket => RESOLVED_STATUSES.includes(ticket.statusName))
      .sort((a, b) => {
        const dateA = parseDate(b.updatedAt);
        const dateB = parseDate(a.updatedAt);
        if (!dateA || !dateB) return 0;
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5)
      .map(ticket => {
        const created = parseDate(ticket.createdAt);
        const updated = parseDate(ticket.updatedAt);
        const resolutionTime = (created && updated) 
          ? ((updated.getTime() - created.getTime()) / (1000 * 60 * 60)).toFixed(2)
          : '0.00';
        
        return {
          ...ticket,
          resolutionTime,
        };
      });
  };

  // Colores para los gráficos
  const STATUS_COLORS = {
    [TICKET_STATUS.NUEVO]: '#2563eb',
    [TICKET_STATUS.ASIGNADO]: '#0ea5e9',
    [TICKET_STATUS.EN_PROGRESO]: '#f59e0b',
    [TICKET_STATUS.ESPERANDO_USUARIO]: '#fbbf24',
    [TICKET_STATUS.RESUELTO]: '#10b981',
    [TICKET_STATUS.CERRADO]: '#6b7280',
    [TICKET_STATUS.CANCELADO]: '#ef4444',
  };

  const CHART_COLORS = ['#2563eb', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const StatCard = ({ title, value, color, icon, trend, gradient }) => (
    <Card 
      sx={{ 
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${alpha(theme.palette[color].main, 0.15)}`,
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
          background: gradient,
          opacity: 0.08,
          borderRadius: '50%',
          transform: 'translate(30%, -30%)',
        }}
      />
      
      <CardContent sx={{ position: 'relative', p: 3 }}>
        {/* Icono y Valor */}
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              background: gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: `0 4px 12px ${alpha(theme.palette[color].main, 0.3)}`,
            }}
          >
            {icon}
          </Box>
          {trend && (
            <Chip
              size="small"
              label={`${trend.isPositive ? '+' : '-'}${trend.value}%`}
              icon={trend.isPositive ? 
                <TrendingUp sx={{ fontSize: '0.9rem !important' }} /> : 
                <TrendingDown sx={{ fontSize: '0.9rem !important' }} />
              }
              sx={{
                height: 24,
                bgcolor: alpha(
                  trend.isPositive ? theme.palette.success.main : theme.palette.error.main, 
                  0.1
                ),
                color: trend.isPositive ? 'success.main' : 'error.main',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
          )}
        </Box>

        {/* Título */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            fontWeight: 500,
            mb: 1,
            fontSize: '0.875rem',
          }}
        >
          {title}
        </Typography>

        {/* Valor grande */}
        <Typography 
          variant="h3" 
          component="div" 
          sx={{ 
            fontWeight: 700,
            color: 'text.primary',
            fontSize: '2.5rem',
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  const EmptyChartMessage = ({ message }) => (
    <Box 
      display="flex" 
      alignItems="center" 
      justifyContent="center" 
      height={300}
    >
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );

  return (
    <>
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
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
            ¡Hola, {user?.firstName || 'Usuario'}!
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 2, fontWeight: 400 }}>
            Aquí está el resumen de tus tickets
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip
              label={user?.role === 'empleado' ? 'Empleado' : user?.role === 'tecnico' ? 'Técnico' : 'Administrador'}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 600,
                backdropFilter: 'blur(10px)',
              }}
            />
            {user?.department && (
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {user.department}
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Estadísticas con diseño moderno */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Total de Tickets"
                value={stats.total}
                color="primary"
                icon={<ConfirmationNumber sx={{ fontSize: 28 }} />}
                gradient="linear-gradient(135deg, #2563eb 0%, #1e40af 100%)"
                trend={previousStats ? calculateTrend(stats.total, previousStats.total) : null}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Nuevos"
                value={stats.nuevos}
                color="info"
                icon={<Assignment sx={{ fontSize: 28 }} />}
                gradient="linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
                trend={previousStats ? calculateTrend(stats.nuevos, previousStats.nuevos) : null}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="En Progreso"
                value={stats.enProgreso}
                color="warning"
                icon={<Schedule sx={{ fontSize: 28 }} />}
                gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                trend={previousStats ? calculateTrend(stats.enProgreso, previousStats.enProgreso) : null}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Resueltos"
                value={stats.resueltos}
                color="success"
                icon={<CheckCircle sx={{ fontSize: 28 }} />}
                gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                trend={previousStats ? calculateTrend(stats.resueltos, previousStats.resueltos) : null}
              />
            </Grid>
          </Grid>

          {/* Acciones Rápidas con diseño moderno */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'primary.main',
                      }}
                    >
                      <AccessTime />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Acciones Rápidas
                    </Typography>
                  </Box>
                  
                  <Box display="flex" gap={2} flexWrap="wrap">
                    {(user?.role === 'empleado' || user?.role === 'administrador') && (
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/tickets/new')}
                        sx={{
                          px: 3,
                          py: 1.5,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                          '&:hover': {
                            boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                          },
                        }}
                      >
                        Crear Nuevo Ticket
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/tickets')}
                      sx={{
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        borderWidth: 2,
                        '&:hover': {
                          borderWidth: 2,
                        },
                      }}
                    >
                      Ver Todos los Tickets
                    </Button>
                    {(user?.role === 'tecnico' || user?.role === 'administrador') && (
                      <Button
                        variant="outlined"
                        size="large"
                        startIcon={<People />}
                        onClick={() => navigate('/tickets?assignedTo=me')}
                        sx={{
                          px: 3,
                          py: 1.5,
                          borderRadius: 2,
                          borderWidth: 2,
                          '&:hover': {
                            borderWidth: 2,
                          },
                        }}
                      >
                        Mis Tickets Asignados
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Info Card */}
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    Resumen
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Tasa de resolución
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            flex: 1,
                            height: 8,
                            bgcolor: '#e2e8f0',
                            borderRadius: 1,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${stats.total > 0 ? (stats.resueltos / stats.total) * 100 : 0}%`,
                              height: '100%',
                              bgcolor: 'success.main',
                              transition: 'width 0.5s ease',
                            }}
                          />
                        </Box>
                        <Typography variant="body2" fontWeight={600}>
                          {stats.total > 0 ? Math.round((stats.resueltos / stats.total) * 100) : 0}%
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Tickets activos
                      </Typography>
                      <Typography variant="h4" fontWeight={700} color="primary.main">
                        {stats.nuevos + stats.enProgreso}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Tiempo promedio de resolución
                      </Typography>
                      <Typography variant="h4" fontWeight={700} color="success.main">
                        {getAvgResolutionTime()} h
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Gráficos de Análisis */}
          <Grid container spacing={3} mt={1}>
            {/* Gráfico de Estado de Tickets (Dona) */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'primary.main',
                      }}
                    >
                      <PieChartIcon />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Tickets por Estado
                    </Typography>
                  </Box>
                  
                  {getStatusChartData().length === 0 ? (
                    <EmptyChartMessage message="No hay datos de tickets disponibles" />
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={getStatusChartData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {getStatusChartData().map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={STATUS_COLORS[entry.name] || CHART_COLORS[index % CHART_COLORS.length]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Gráfico de Tickets por Categoría (Dona) */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'secondary.main',
                      }}
                    >
                      <CategoryIcon />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Tickets por Categoría
                    </Typography>
                  </Box>
                  
                  {getCategoryChartData().length === 0 ? (
                    <EmptyChartMessage message="No hay datos de categorías disponibles" />
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={getCategoryChartData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {getCategoryChartData().map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={CHART_COLORS[index % CHART_COLORS.length]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Gráfico de Tickets por Prioridad (Barras) */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'warning.main',
                      }}
                    >
                      <BarChartIcon />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Tickets por Prioridad
                    </Typography>
                  </Box>
                  
                  {getPriorityChartData().length === 0 ? (
                    <EmptyChartMessage message="No hay datos de prioridades disponibles" />
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={getPriorityChartData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Gráfico de Evolución (Línea) */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'success.main',
                      }}
                    >
                      <ShowChartIcon />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Evolución Últimos 7 Días
                    </Typography>
                  </Box>
                  
                  {getTimelineChartData().every(d => d.total === 0) ? (
                    <EmptyChartMessage message="No hay datos de tickets en los últimos 7 días" />
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={getTimelineChartData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone"
                          dataKey="nuevos"
                          stroke="#2563eb"
                          strokeWidth={2}
                          activeDot={{ r: 4 }}
                        />
                        <Line 
                          type="monotone"
                          dataKey="resueltos"
                          stroke="#10b981"
                          strokeWidth={2}
                          activeDot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Últimos Tickets Resueltos */}
          <Grid container spacing={3} mt={4}>
            <Grid item xs={12}>
              <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    Últimos Tickets Resueltos
                  </Typography>
                  
                  {getLastResolvedTickets().length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No hay tickets resueltos recientemente.
                    </Typography>
                  ) : (
                    <Grid container spacing={2}>
                      {getLastResolvedTickets().map(ticket => (
                        <Grid item xs={12} sm={6} md={4} key={ticket.id}>
                          <Card 
                            sx={{ 
                              display: 'flex',
                              flexDirection: 'column',
                              height: '100%',
                              border: '1px solid',
                              borderColor: 'divider',
                              transition: 'transform 0.3s ease',
                              cursor: 'pointer',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                              },
                            }}
                            onClick={() => navigate(`/tickets/${ticket.id}`)}
                          >
                            <CardContent sx={{ flex: 1 }}>
                              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                Ticket #{ticket.id}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                gutterBottom
                                sx={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                }}
                              >
                                {ticket.title}
                              </Typography>
                              
                              <Box display="flex" alignItems="center" justifyContent="space-between" mt={2} mb={1}>
                                <Chip 
                                  label={ticket.statusName || 'Sin estado'} 
                                  size="small"
                                  sx={{ 
                                    bgcolor: STATUS_COLORS[ticket.statusName] || '#6b7280',
                                    color: 'white',
                                    borderRadius: 1,
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                  }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  {ticket.resolutionTime} h
                                </Typography>
                              </Box>
                              
                              <Typography variant="caption" color="text.secondary" display="block">
                                {parseDate(ticket.updatedAt)?.toLocaleString('es-ES', { 
                                  day: 'numeric', 
                                  month: 'short', 
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }) || 'Fecha no disponible'}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default DashboardPage;