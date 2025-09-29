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
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={8}
          sx={{
            borderRadius: 3,
            overflow: 'visible',
            position: 'relative',
          }}
        >
          {/* Header con logo */}
          <Box
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
              color: 'white',
              p: 4,
              textAlign: 'center',
              borderRadius: '12px 12px 0 0',
            }}
          >
            <Box sx={{ fontSize: '3rem', mb: 1 }}>📋</Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              {APP_CONFIG.NAME}
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              {APP_CONFIG.DESCRIPTION}
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
              Iniciar Sesión
            </Typography>

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
                startIcon={isLoading ? <CircularProgress size={20} /> : <LoginIcon />}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </Box>

            {/* Información de usuarios de prueba */}
            <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                👥 Usuarios de Prueba:
              </Typography>
              <Box sx={{ display: 'grid', gap: 1, fontSize: '0.85rem' }}>
                <Typography variant="body2">
                  <strong>Admin:</strong> admin@farmashaio.com / admin123
                </Typography>
                <Typography variant="body2">
                  <strong>Técnico:</strong> tecnico1@farmashaio.com / tecnico123
                </Typography>
                <Typography variant="body2">
                  <strong>Empleado:</strong> empleado1@farmashaio.com / empleado123
                </Typography>
              </Box>
            </Box>
          </CardContent>

          {/* Footer */}
          <Box
            sx={{
              textAlign: 'center',
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: '0 0 12px 12px',
            }}
          >
            <Typography variant="caption" color="textSecondary">
              v{APP_CONFIG.VERSION} • {APP_CONFIG.COMPANY}
            </Typography>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;