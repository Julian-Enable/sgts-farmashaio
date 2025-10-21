import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAuth } from '../context/AuthContext.jsx';
import { APP_CONFIG, VALIDATION } from '../utils/constants.js';
import Logo from '../components/Logo.jsx';

// Schema de validación
const loginSchema = yup.object({
  email: yup
    .string()
    .required('El email es requerido')
    .email('Debe ser un email válido'),
  password: yup
    .string()
    .required('La contraseña es requerida')
    .min(VALIDATION.PASSWORD_MIN_LENGTH, `Mínimo ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`),
});

const LoginPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, clearError } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (data) => {
    try {
      setIsLoading(true);
      clearError();

      await login(data);

      // Redirigir a la página anterior o al dashboard
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      // El error ya se maneja en el contexto de auth
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #8b5cf6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
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
          opacity: 0.1,
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Logo flotante arriba de la tarjeta */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 3,
            animation: 'float 3s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-10px)' },
            },
          }}
        >
          <Logo variant="full" size="large" />
        </Box>

        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
            bgcolor: 'rgba(255, 255, 255, 0.98)',
          }}
        >
          {/* Header con gradiente sutil */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
              p: 4,
              pb: 3,
              textAlign: 'center',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 1,
              }}
            >
              Bienvenido
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Inicia sesión para continuar
            </Typography>
          </Box>

          <CardContent sx={{ p: 4, pt: 4 }}>

            {/* Mostrar error si existe */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Formulario de login */}
            <Box component="form" onSubmit={handleSubmit(handleLogin)} noValidate>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="email"
                    label="Email"
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color={errors.email ? 'error' : 'action'} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    label="Contraseña"
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color={errors.password ? 'error' : 'action'} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={togglePasswordVisibility}
                            edge="end"
                            aria-label="toggle password visibility"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />
                )}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={!isValid || isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                sx={{
                  py: 2,
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                  boxShadow: '0 8px 24px rgba(30, 58, 138, 0.4)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
                    boxShadow: '0 12px 32px rgba(30, 58, 138, 0.5)',
                    transform: 'translateY(-2px)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)',
                    boxShadow: 'none',
                  },
                }}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </Box>

            {/* ...existing code... */}
          </CardContent>

          {/* Footer mejorado */}
          <Box
            sx={{
              textAlign: 'center',
              p: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.02),
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                fontWeight: 600,
                fontSize: '0.8rem',
              }}
            >
              v{APP_CONFIG.VERSION} • {APP_CONFIG.COMPANY}
            </Typography>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;