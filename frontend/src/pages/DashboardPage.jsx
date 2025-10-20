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
  AccessTime,
  People,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  ShowChart as ShowChartIcon,
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

  // Procesar datos para gráficos
  const getStatusChartData = () => {
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
      const dateStr = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
      
      const dayTickets = tickets.filter(ticket => {
        const ticketDate = new Date(ticket.createdAt);
        return ticketDate.toDateString() === date.toDateString();
      });

      last7Days.push({
        date: dateStr,
        nuevos: dayTickets.filter(t => t.statusName === 'Nuevo').length,
        resueltos: dayTickets.filter(t => t.statusName === 'Resuelto' || t.statusName === 'Cerrado').length,
        total: dayTickets.length,
      });
    }

    return last7Days;
  };

  // Colores para los gráficos
  const STATUS_COLORS = {
    'Nuevo': '#2563eb',
    'Asignado': '#0ea5e9',
    'En Progreso': '#f59e0b',
    'Esperando Usuario': '#fbbf24',
    'Resuelto': '#10b981',
    'Cerrado': '#6b7280',
    'Cancelado': '#ef4444',
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
              label={trend}
              icon={<TrendingUp sx={{ fontSize: '0.9rem !important' }} />}
              sx={{
                height: 24,
                bgcolor: alpha(theme.palette.success.main, 0.1),
                color: 'success.main',
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
            ¡Hola, {user?.firstName}!
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
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {user?.department}
            </Typography>
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
              />
            </Grid>
            
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Nuevos"
                value={stats.nuevos}
                color="info"
                icon={<Assignment sx={{ fontSize: 28 }} />}
                gradient="linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
                trend="+5%"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="En Progreso"
                value={stats.enProgreso}
                color="warning"
                icon={<Schedule sx={{ fontSize: 28 }} />}
                gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} lg={3}>
              <StatCard
                title="Resueltos"
                value={stats.resueltos}
                color="success"
                icon={<CheckCircle sx={{ fontSize: 28 }} />}
                gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                trend="+12%"
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
                  
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getPriorityChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
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
                  
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={getTimelineChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="tickets"
                        stroke="#1976d2"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
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
