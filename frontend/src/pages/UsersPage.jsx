import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
  Tooltip,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { userService } from '../services/userService.js';
import { USER_ROLES, DEPARTMENTS } from '../utils/constants.js';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Filtros
  const [roleFilter, setRoleFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // 'active', 'inactive', ''
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'empleado',
    department: ''
  });

  useEffect(() => {
    loadUsers();
  }, [roleFilter, departmentFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
  const filters = {};
  if (roleFilter) filters.role = roleFilter;
  if (departmentFilter) filters.department = departmentFilter;
  if (statusFilter === 'active') filters.isActive = true;
  else if (statusFilter === 'inactive') filters.isActive = false;
  const response = await userService.getUsers(filters);
      console.log('Usuarios recibidos:', response);
      // Backend retorna: { success: true, data: { users: [...], total: ... } }
      // userService.getUsers retorna response.data, entonces aquí tenemos { users: [...], total: ... }
      setUsers(response.users || []);
    } catch (err) {
      setError('Error al cargar usuarios: ' + err.message);
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        password: '',
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department || ''
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'empleado',
        department: ''
      });
    }
    setUserDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setUserDialogOpen(false);
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'empleado',
      department: ''
    });
  };

  const handleSaveUser = async () => {
    try {
      setError(null);
      if (editingUser) {
        // Actualizar usuario
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password; // No enviar password vacío
        await userService.updateUser(editingUser.id, updateData);
        setSuccess('Usuario actualizado exitosamente');
      } else {
        // Crear usuario
        await userService.createUser(formData);
        setSuccess('Usuario creado exitosamente');
      }
      handleCloseDialog();
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar usuario');
    }
  };

  const handleDeleteUser = async () => {
    try {
      setError(null);
      await userService.deleteUser(deletingUserId);
      setSuccess('Usuario eliminado exitosamente');
      setDeleteDialogOpen(false);
      setDeletingUserId(null);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      setError(null);
      // toggleUserStatus hace el toggle automático en el backend
      await userService.toggleUserStatus(userId);
      setSuccess(`Usuario ${currentStatus ? 'desactivado' : 'activado'} exitosamente`);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar estado del usuario');
    }
  };

  const getRoleLabel = (role) => {
    return USER_ROLES[role]?.label || role;
  };

  const getRoleColor = (role) => {
    const colors = {
      administrador: 'error',
      tecnico: 'primary',
      empleado: 'default'
    };
    return colors[role] || 'default';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Gestión de Usuarios
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Usuario
        </Button>
      </Box>

      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>{success}</Alert>}

      {/* Filtros */}
      <Card sx={{ mb: 3, p: 2 }}>
  <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
            }}
            sx={{ flexGrow: 1, minWidth: '200px' }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={statusFilter}
              label="Estado"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="active">Activos</MenuItem>
              <MenuItem value="inactive">Inactivos</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Rol</InputLabel>
            <Select
              value={roleFilter}
              label="Rol"
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {Object.entries(USER_ROLES).map(([key, value]) => (
                <MenuItem key={key} value={key}>{value.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Departamento</InputLabel>
            <Select
              value={departmentFilter}
              label="Departamento"
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {DEPARTMENTS.map(dept => (
                <MenuItem key={dept.value} value={dept.value}>{dept.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Card>

      {/* Tabla de usuarios */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Departamento</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No se encontraron usuarios
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={getRoleLabel(user.role)}
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{user.department || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive ? 'Activo' : 'Inactivo'}
                        color={user.isActive ? 'success' : 'default'}
                        size="small"
                        icon={user.isActive ? <CheckCircleIcon /> : <BlockIcon />}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(user)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {user.isActive ? (
                        <Tooltip title="Desactivar">
                          <IconButton
                            size="small"
                            onClick={() => handleToggleStatus(user.id, user.isActive)}
                          >
                            <BlockIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Activar">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleToggleStatus(user.id, user.isActive)}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setDeletingUserId(user.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Dialog Crear/Editar Usuario */}
      <Dialog open={userDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Usuario"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label={editingUser ? "Nueva Contraseña (dejar vacío para no cambiar)" : "Contraseña"}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!editingUser}
              fullWidth
            />
            <TextField
              label="Nombre"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Apellido"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel>Rol</InputLabel>
              <Select
                value={formData.role}
                label="Rol"
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                {Object.entries(USER_ROLES).map(([key, value]) => (
                  <MenuItem key={key} value={key}>{value.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Departamento</InputLabel>
              <Select
                value={formData.department}
                label="Departamento"
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <MenuItem value="">Sin departamento</MenuItem>
                {DEPARTMENTS.map(dept => (
                  <MenuItem key={dept.value} value={dept.value}>{dept.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveUser} variant="contained">
            {editingUser ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Confirmar Eliminación */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;