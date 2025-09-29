import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  ConfirmationNumber,
  People,
  Person,
  Notifications,
  Logout,
  Add,
  Settings,
  ChevronLeft,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { APP_CONFIG, USER_ROLES } from '../utils/constants.js';

const DRAWER_WIDTH = 280;

const Layout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user, logout, isAdmin, isTechnicianOrAdmin } = useAuth();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Navegación principal
  const navigationItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/',
      roles: ['empleado', 'tecnico', 'administrador'],
    },
    {
      text: 'Tickets',
      icon: <ConfirmationNumber />,
      path: '/tickets',
      roles: ['empleado', 'tecnico', 'administrador'],
    },
    {
      text: 'Crear Ticket',
      icon: <Add />,
      path: '/tickets/new',
      roles: ['empleado', 'tecnico', 'administrador'],
    },
    {
      text: 'Usuarios',
      icon: <People />,
      path: '/users',
      roles: ['administrador'],
    },
    {
      text: 'Notificaciones',
      icon: <Notifications />,
      path: '/notifications',
      roles: ['empleado', 'tecnico', 'administrador'],
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/login');
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  // Función para obtener el color del rol
  const getRoleColor = (role) => {
    switch (role) {
      case USER_ROLES.ADMINISTRADOR:
        return 'error';
      case USER_ROLES.TECNICO:
        return 'warning';
      case USER_ROLES.EMPLEADO:
        return 'info';
      default:
        return 'default';
    }
  };

  // Función para obtener el texto del rol
  const getRoleText = (role) => {
    switch (role) {
      case USER_ROLES.ADMINISTRADOR:
        return 'Admin';
      case USER_ROLES.TECNICO:
        return 'Técnico';
      case USER_ROLES.EMPLEADO:
        return 'Empleado';
      default:
        return role;
    }
  };

  // Contenido del drawer
  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header del drawer */}
      <Box
        sx={{
          p: 2,
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box sx={{ fontSize: '1.5rem' }}>📋</Box>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 500 }}>
          {APP_CONFIG.NAME}
        </Typography>
        {isMobile && (
          <IconButton
            color="inherit"
            onClick={handleDrawerToggle}
            sx={{ ml: 'auto' }}
          >
            <ChevronLeft />
          </IconButton>
        )}
      </Box>

      {/* Información del usuario */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="caption" color="textSecondary" noWrap>
              {user?.department}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={getRoleText(user?.role)}
          size="small"
          color={getRoleColor(user?.role)}
          variant="outlined"
        />
      </Box>

      {/* Navegación */}
      <List sx={{ flex: 1, pt: 1 }}>
        {navigationItems.map((item) => {
          if (!item.roles.includes(user?.role)) return null;

          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'white' : theme.palette.text.secondary,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer del drawer */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Typography variant="caption" color="textSecondary" align="center" display="block">
          v{APP_CONFIG.VERSION}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          ml: { md: `${DRAWER_WIDTH}px` },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Toolbar>
          {/* Botón de menú para móviles */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Título de la página */}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {location.pathname === '/' && 'Dashboard'}
            {location.pathname === '/tickets' && 'Tickets'}
            {location.pathname === '/tickets/new' && 'Crear Ticket'}
            {location.pathname === '/users' && 'Usuarios'}
            {location.pathname === '/notifications' && 'Notificaciones'}
            {location.pathname === '/profile' && 'Mi Perfil'}
            {location.pathname.startsWith('/tickets/') && location.pathname !== '/tickets/new' && 'Detalle del Ticket'}
          </Typography>

          {/* Notificaciones */}
          <IconButton color="inherit" onClick={() => navigate('/notifications')}>
            <Badge badgeContent={0} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Menú del usuario */}
          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            sx={{ ml: 1 }}
          >
            <Avatar sx={{ bgcolor: 'white', color: theme.palette.primary.main, width: 32, height: 32 }}>
              {user?.firstName?.charAt(0)}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Menu del usuario */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
      >
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Mi Perfil
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Cerrar Sesión
        </MenuItem>
      </Menu>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{
          width: { md: DRAWER_WIDTH },
          flexShrink: { md: 0 },
        }}
      >
        {/* Drawer para móviles */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Drawer para desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Toolbar /> {/* Spacer para el AppBar */}
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;