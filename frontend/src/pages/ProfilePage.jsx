import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip,
  Alert,
  alpha,
  useTheme,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Edit as EditIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  ConfirmationNumber,
  CheckCircle,
  Schedule,
  Email,
  Badge,
  Business,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { ticketService } from '../services/ticketService';

const ProfilePage = () => {
  const theme = useTheme();
  const { user, updateUser } = useAuth();

  // Estados
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalTickets: 0,
    resolvedTickets: 0,
    pendingTickets: 0,
  });

  // Form states
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    department: user?.department || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Cargar estadísticas del usuario
  useEffect(() => {
    const loadStats = async () => {
      try {
        const tickets = await ticketService.getTickets();
        const userTickets = tickets.filter(t => t.requesterId === user?.id);
        
        setStats({
          totalTickets: userTickets.length,
          resolvedTickets: userTickets.filter(t => t.statusName === 'Resuelto' || t.statusName === 'Cerrado').length,
          pendingTickets: userTickets.filter(t => t.statusName !== 'Resuelto' && t.statusName !== 'Cerrado').length,
        });
      } catch (err) {
        console.error('Error loading stats:', err);
      }
    };

    if (user) {
      loadStats();
    }
  }, [user]);

  // Obtener iniciales para avatar
  const getInitials = () => {
    if (!user) return '?';
    const first = user.firstName?.[0] || '';
    const last = user.lastName?.[0] || '';
    return `${first}${last}`.toUpperCase();
  };

  // Obtener color del rol
  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'administrador':
        return 'error';
      case 'tecnico':
        return 'warning';
      case 'empleado':
        return 'info';
      default:
        return 'default';
    }
  };

  // Handlers
  const handleEditOpen = () => {
    setEditForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      department: user?.department || '',
    });
    setError('');
    setSuccess('');
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      
      const updatedUser = await authService.updateProfile(editForm);
      updateUser(updatedUser);
      
      setSuccess('Perfil actualizado correctamente');
      setTimeout(() => {
        setEditDialogOpen(false);
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordOpen = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setError('');
    setSuccess('');
    setPasswordDialogOpen(true);
  };

  const handlePasswordClose = () => {
    setPasswordDialogOpen(false);
  };

  const handlePasswordSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      // Validaciones
      if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
        setError('Todos los campos son obligatorios');
        setLoading(false);
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setError('Las contraseñas nuevas no coinciden');
        setLoading(false);
        return;
      }

      if (passwordForm.newPassword.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        setLoading(false);
        return;
      }

      await authService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      
      setSuccess('Contraseña cambiada correctamente');
      setTimeout(() => {
        setPasswordDialogOpen(false);
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Mi Perfil
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gestiona tu información personal y configuración de cuenta
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Columna Izquierda - Info Personal */}
        <Grid item xs={12} md={4}>
          {/* Card de Perfil */}
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.dark, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  margin: '0 auto',
                  fontSize: '3rem',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                  mb: 2,
                }}
              >
                {getInitials()}
              </Avatar>

              <Typography variant="h5" fontWeight={600} gutterBottom>
                {user.firstName} {user.lastName}
              </Typography>

              <Chip
                label={user.role}
                color={getRoleColor(user.role)}
                size="small"
                sx={{ mb: 2, fontWeight: 600 }}
              />

              <Divider sx={{ my: 2 }} />

              <Box sx={{ textAlign: 'left', mb: 2 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Email fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <Badge fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    @{user.username}
                  </Typography>
                </Box>

                {user.department && (
                  <Box display="flex" alignItems="center">
                    <Business fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {user.department}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box display="flex" gap={1} justifyContent="center" mt={3}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleEditOpen}
                  size="small"
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }}
                >
                  Editar
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LockIcon />}
                  onClick={handlePasswordOpen}
                  size="small"
                >
                  Contraseña
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Columna Derecha - Estadísticas y Actividad */}
        <Grid item xs={12} md={8}>
          {/* Estadísticas */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.dark, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 24px ${alpha(theme.palette.info.main, 0.2)}`,
                  },
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Total Tickets
                      </Typography>
                      <Typography variant="h4" fontWeight={700}>
                        {stats.totalTickets}
                      </Typography>
                    </Box>
                    <ConfirmationNumber
                      sx={{
                        fontSize: 40,
                        color: theme.palette.info.main,
                        opacity: 0.3,
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.dark, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 24px ${alpha(theme.palette.success.main, 0.2)}`,
                  },
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Resueltos
                      </Typography>
                      <Typography variant="h4" fontWeight={700}>
                        {stats.resolvedTickets}
                      </Typography>
                    </Box>
                    <CheckCircle
                      sx={{
                        fontSize: 40,
                        color: theme.palette.success.main,
                        opacity: 0.3,
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.dark, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 24px ${alpha(theme.palette.warning.main, 0.2)}`,
                  },
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Pendientes
                      </Typography>
                      <Typography variant="h4" fontWeight={700}>
                        {stats.pendingTickets}
                      </Typography>
                    </Box>
                    <Schedule
                      sx={{
                        fontSize: 40,
                        color: theme.palette.warning.main,
                        opacity: 0.3,
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Información de Cuenta */}
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Información de Cuenta
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Nombre
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {user.firstName}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Apellido
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {user.lastName}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {user.email}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Usuario
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {user.username}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Departamento
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {user.department || 'No especificado'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">
                    Rol
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {user.role}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog: Editar Perfil */}
      <Dialog open={editDialogOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Perfil</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <TextField
            fullWidth
            label="Nombre"
            value={editForm.firstName}
            onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Apellido"
            value={editForm.lastName}
            onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Departamento"
            value={editForm.department}
            onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Cambiar Contraseña */}
      <Dialog open={passwordDialogOpen} onClose={handlePasswordClose} maxWidth="sm" fullWidth>
        <DialogTitle>Cambiar Contraseña</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <TextField
            fullWidth
            label="Contraseña Actual"
            type={showCurrentPassword ? 'text' : 'password'}
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    edge="end"
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Nueva Contraseña"
            type={showNewPassword ? 'text' : 'password'}
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Confirmar Nueva Contraseña"
            type={showConfirmPassword ? 'text' : 'password'}
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handlePasswordSubmit}
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;