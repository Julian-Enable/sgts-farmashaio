import React, { useState, useEffect } from 'react';
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
  alpha,
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
  KeyboardArrowDown,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../hooks/useNotifications.js';
import { APP_CONFIG, USER_ROLES } from '../utils/constants.js';
import Logo from './Logo.jsx';

const DRAWER_WIDTH = 280;

const Layout = () => {
  // ...otros hooks y variables...
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user, logout, isAdmin, isTechnicianOrAdmin } = useAuth();
  const { unreadCount } = useNotifications();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Cerrar drawer automáticamente en móvil SOLO cuando cambia la ruta
  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
    // Solo cerrar cuando cambia la ruta, no cuando cambia isMobile
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

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
      roles: ['empleado', 'administrador'], // Técnicos NO crean tickets, solo los resuelven
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
    setAnchorEl(null); // Cerrar menú de perfil si está abierto
  };

  const handleLogout = async () => {
    setAnchorEl(null); // Cerrar menú inmediatamente
    await logout();
    navigate('/login');
  };

  const handleProfile = () => {
    setAnchorEl(null); // Cerrar menú inmediatamente
    navigate('/profile');
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Cerrar menú de perfil automáticamente al navegar (debe ir después de declarar handleMenuClose y anchorEl)
  useEffect(() => {
    setAnchorEl(null);
  }, [location.pathname]);

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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
      {/* Header del drawer con gradiente azul limpio */}
      <Box
        sx={{
          p: 2.5,
          background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
          borderBottom: '3px solid rgba(255,255,255,0.15)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo variant="full" size="medium" showSubtitle={true} />
          {isMobile && (
            <IconButton
              onClick={handleDrawerToggle}
              size="small"
              sx={{ 
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.15)',
                },
              }}
            >
              <ChevronLeft />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Información del usuario - Diseño limpio y elegante */}
      <Box 
        sx={{ 
          p: 2,
          mx: 2,
          mt: 2.5,
          borderRadius: 2.5,
          bgcolor: '#f8fafc',
          border: '1px solid #e2e8f0',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Avatar 
            sx={{ 
              bgcolor: '#2563eb',
              width: 40,
              height: 40,
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
            }}
          >
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="caption" noWrap sx={{ fontSize: '0.75rem', color: '#64748b' }}>
              {user?.department}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={getRoleText(user?.role)}
          size="small"
          color={getRoleColor(user?.role)}
          sx={{ 
            height: '24px',
            fontSize: '0.7rem',
            fontWeight: 600,
          }}
        />
      </Box>

      {/* Navegación con diseño limpio */}
      <List sx={{ flex: 1, pt: 2, px: 2 }}>
        {navigationItems.map((item) => {
          if (!item.roles.includes(user?.role)) return null;

          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 1.8,
                  transition: 'all 0.2s ease',
                  bgcolor: isActive ? '#eff6ff' : 'transparent',
                  borderLeft: isActive ? '3px solid #2563eb' : '3px solid transparent',
                  '&:hover': {
                    bgcolor: isActive ? '#dbeafe' : '#f8fafc',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? '#2563eb' : '#64748b',
                    minWidth: 38,
                    fontSize: '1.25rem',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.875rem',
                    color: isActive ? '#1e293b' : '#475569',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer con versión y créditos */}
      <Box 
        sx={{ 
          p: 2.5,
          textAlign: 'center',
          borderTop: '1px solid #e2e8f0',
          bgcolor: '#f8fafc',
        }}
      >
        <Typography 
          variant="caption"
          sx={{ 
            fontSize: '0.7rem',
            color: '#64748b',
            fontWeight: 500,
            display: 'block',
            mb: 0.5,
          }}
        >
          v{APP_CONFIG.VERSION}
        </Typography>
        <Typography 
          variant="caption"
          sx={{ 
            fontSize: '0.65rem',
            color: '#94a3b8',
            fontWeight: 400,
            display: 'block',
          }}
        >
          Developed by Julian Merchán
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* App Bar moderno con glassmorphism */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          ml: { md: `${DRAWER_WIDTH}px` },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          {/* Botón de menú para móviles */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { xs: 'block', md: 'none' },
              color: 'primary.main',
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Título de la página con icono */}
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                color: 'white',
              }}
            >
              {location.pathname === '/' && <Dashboard />}
              {location.pathname === '/tickets' && <ConfirmationNumber />}
              {location.pathname === '/tickets/new' && <Add />}
              {location.pathname === '/users' && <People />}
              {location.pathname === '/notifications' && <Notifications />}
              {location.pathname === '/profile' && <Person />}
              {location.pathname.startsWith('/tickets/') && location.pathname !== '/tickets/new' && <ConfirmationNumber />}
            </Box>
            <Box>
              <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.15rem' }}>
                {location.pathname === '/' && 'Dashboard'}
                {location.pathname === '/tickets' && 'Tickets'}
                {location.pathname === '/tickets/new' && 'Crear Ticket'}
                {location.pathname === '/users' && 'Usuarios'}
                {location.pathname === '/notifications' && 'Notificaciones'}
                {location.pathname === '/profile' && 'Mi Perfil'}
                {location.pathname.startsWith('/tickets/') && location.pathname !== '/tickets/new' && 'Detalle del Ticket'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem', display: { xs: 'none', sm: 'block' } }}>
                Sistema de Gestión de Tickets
              </Typography>
            </Box>
          </Box>

          {/* Notificaciones con diseño moderno */}
          <IconButton 
            onClick={() => navigate('/notifications')}
            sx={{
              color: 'text.primary',
              mx: 0.5,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Menú del usuario con dropdown indicator */}
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              ml: 1,
              display: 'flex',
              gap: 1,
              px: 1.5,
              borderRadius: 2,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <Avatar 
              sx={{ 
                bgcolor: 'primary.main',
                width: 36,
                height: 36,
                fontSize: '0.95rem',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(30, 58, 138, 0.3)',
              }}
            >
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </Avatar>
            <KeyboardArrowDown sx={{ display: { xs: 'none', sm: 'block' }, color: 'text.secondary' }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Menu del usuario con diseño moderno */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        disableScrollLock
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              mt: 1.5,
              minWidth: 220,
              borderRadius: 2,
              overflow: 'visible',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 20,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header del menú */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        
        <MenuItem 
          onClick={handleProfile}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <ListItemIcon>
            <Person fontSize="small" color="primary" />
          </ListItemIcon>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Mi Perfil</Typography>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem 
          onClick={handleLogout}
          sx={{
            py: 1.5,
            px: 2,
            color: 'error.main',
            '&:hover': {
              bgcolor: alpha(theme.palette.error.main, 0.08),
            },
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" color="error" />
          </ListItemIcon>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Cerrar Sesión</Typography>
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
          open={isMobile && mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
            hideBackdrop: true,
            disableEnforceFocus: true,
          }}
          slotProps={{
            paper: {
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 220,
                borderRadius: 2,
                overflow: 'visible',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 20,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            },
            list: {
              disableAutoFocusItem: true,
            },
          }}
        >
        </Drawer>

        {/* Drawer permanente para pantallas grandes */}
        <Drawer
          variant="permanent"
          open={!isMobile}
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Contenido principal con diseño moderno */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          bgcolor: '#f8fafc',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '300px',
            background: 'linear-gradient(180deg, rgba(30, 58, 138, 0.03) 0%, rgba(30, 58, 138, 0) 100%)',
            pointerEvents: 'none',
            zIndex: 0,
          },
        }}
      >
        <Toolbar /> {/* Spacer para el AppBar */}
        <Box 
          sx={{ 
            p: { xs: 2, sm: 3, md: 4 },
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;