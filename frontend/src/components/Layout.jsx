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
import { APP_CONFIG, USER_ROLES } from '../utils/constants.js';
import Logo from './Logo.jsx';

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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      {/* Header del drawer con Logo */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo variant="full" size="medium" />
          {isMobile && (
            <IconButton
              onClick={handleDrawerToggle}
              sx={{ 
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <ChevronLeft />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Información del usuario con diseño moderno */}
      <Box 
        sx={{ 
          p: 2.5,
          mx: 2,
          mt: 2,
          borderRadius: 3,
          bgcolor: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main',
              width: 44,
              height: 44,
              fontSize: '1.1rem',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)',
            }}
          >
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.8rem' }}>
              {user?.department}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={getRoleText(user?.role)}
          size="small"
          color={getRoleColor(user?.role)}
          sx={{ 
            fontWeight: 700,
            fontSize: '0.75rem',
            height: '26px',
          }}
        />
      </Box>

      {/* Navegación con diseño moderno */}
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
                  borderRadius: 2.5,
                  py: 1.5,
                  px: 2,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': isActive ? {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    bgcolor: 'primary.main',
                    borderRadius: '0 4px 4px 0',
                  } : {},
                  '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.18),
                    },
                  },
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'primary.main' : 'text.secondary',
                    minWidth: 40,
                    transition: 'color 0.3s ease',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 600,
                    fontSize: '0.9rem',
                    color: isActive ? 'primary.main' : 'text.primary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer del drawer moderno */}
      <Box 
        sx={{ 
          p: 2.5,
          m: 2,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography 
          variant="caption" 
          color="text.secondary" 
          align="center" 
          display="block"
          sx={{ fontWeight: 600, fontSize: '0.75rem' }}
        >
          v{APP_CONFIG.VERSION}
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
              display: { md: 'none' },
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
            <Badge badgeContent={0} color="error">
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
        onClick={handleMenuClose}
        PaperProps={{
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