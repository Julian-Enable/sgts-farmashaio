import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Send as SendIcon,
  AttachFile as AttachIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAuth } from '../context/AuthContext.jsx';
import { ticketService } from '../services/ticketService.js';
import { TICKET_PRIORITY, TICKET_CATEGORIES } from '../utils/constants.js';

// Schema de validación
const ticketSchema = yup.object({
  title: yup
    .string()
    .required('El título es requerido')
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(100, 'El título no puede exceder 100 caracteres'),
  description: yup
    .string()
    .required('La descripción es requerida')
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres'),
  category: yup
    .string()
    .required('La categoría es requerida'),
  priority: yup
    .string()
    .required('La prioridad es requerida'),
});

const steps = [
  {
    label: 'Información Básica',
    description: 'Título y descripción del problema',
  },
  {
    label: 'Categorización',
    description: 'Categoría y prioridad',
  },
  {
    label: 'Revisión',
    description: 'Confirmar y enviar',
  },
];

const CreateTicketPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estado
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [attachments, setAttachments] = useState([]);

  // Form
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
  } = useForm({
    resolver: yupResolver(ticketSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      category: '',
      priority: '',
    },
  });

  const watchedValues = watch();

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar categorías y prioridades desde el backend
        const [categoriesResponse, prioritiesResponse] = await Promise.all([
          ticketService.getCategories(),
          ticketService.getPriorities()
        ]);
        setCategories(categoriesResponse || []);
        setPriorities(prioritiesResponse || []);
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError('Error al cargar los datos iniciales');
      }
    };

    loadData();
  }, []);

  // Handlers
  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(activeStep);
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleCreateTicket = async (data) => {
    try {
      setLoading(true);
      setError(null);

      // Transformar category y priority a categoryId y priorityId
      const ticketData = {
        title: data.title,
        description: data.description,
        categoryId: data.category,  // Ya es un número (ID)
        priorityId: data.priority,   // Ya es un número (ID)
        attachments: attachments.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
        })),
      };

      const response = await ticketService.createTicket(ticketData);
      
      // Debug temporal - ver qué respuesta llega
      console.log('Respuesta del servidor:', response);
      console.log('Ticket ID:', response.ticket?.id);
      
      setSuccess(true);
      
      // Redirigir después de un momento - temporalmente vamos a /tickets en lugar del ticket específico
      setTimeout(() => {
        console.log('Redirecting to tickets list...');
        navigate('/tickets');
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Error al crear el ticket');
    } finally {
      setLoading(false);
    }
  };

  const getFieldsForStep = (step) => {
    switch (step) {
      case 0:
        return ['title', 'description'];
      case 1:
        return ['category', 'priority'];
      default:
        return [];
    }
  };

  const handleFileAttach = (event) => {
    const files = Array.from(event.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'muy-baja': 'success',
      'baja': 'info',
      'media': 'warning',
      'alta': 'error',
      'critica': 'error',
    };
    return colors[priority] || 'default';
  };

  if (success) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" color="success.main" gutterBottom>
          ¡Ticket Creado Exitosamente!
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Tu ticket ha sido creado y será atendido pronto.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/tickets')}
          sx={{ mt: 2 }}
        >
          Ver Mis Tickets
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/tickets')} sx={{ mr: 2 }}>
          <BackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Crear Nuevo Ticket
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Stepper */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Stepper 
              activeStep={activeStep} 
              orientation="vertical"
              sx={{ '& .MuiStepLabel-root': { pb: 1 } }}
            >
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>
                    <Typography variant="subtitle2">{step.label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {step.description}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>

        {/* Form Content */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit(handleCreateTicket)}>
                {/* Step 0: Información básica */}
                {activeStep === 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Información Básica del Ticket
                    </Typography>
                    
                    <Controller
                      name="title"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Título del Ticket"
                          placeholder="Describe brevemente el problema..."
                          margin="normal"
                          error={!!errors.title}
                          helperText={errors.title?.message}
                          sx={{ mb: 3 }}
                        />
                      )}
                    />

                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={6}
                          label="Descripción Detallada"
                          placeholder="Describe el problema en detalle, incluyendo pasos para reproducirlo, mensajes de error, etc..."
                          margin="normal"
                          error={!!errors.description}
                          helperText={errors.description?.message || `${field.value.length}/1000 caracteres`}
                        />
                      )}
                    />

                    {/* Adjuntos */}
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Adjuntos (Opcional)
                      </Typography>
                      <input
                        accept="image/*,.pdf,.doc,.docx,.txt"
                        style={{ display: 'none' }}
                        id="file-upload"
                        multiple
                        type="file"
                        onChange={handleFileAttach}
                      />
                      <label htmlFor="file-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<AttachIcon />}
                        >
                          Adjuntar Archivos
                        </Button>
                      </label>
                      
                      {attachments.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          {attachments.map((file, index) => (
                            <Chip
                              key={index}
                              label={`${file.name} (${(file.size / 1024).toFixed(1)} KB)`}
                              onDelete={() => removeAttachment(index)}
                              deleteIcon={<CloseIcon />}
                              sx={{ mr: 1, mb: 1 }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}

                {/* Step 1: Categorización */}
                {activeStep === 1 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Categorización del Ticket
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="category"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth margin="normal" error={!!errors.category}>
                              <InputLabel>Categoría</InputLabel>
                              <Select
                                {...field}
                                label="Categoría"
                              >
                                {categories.map((category) => (
                                  <MenuItem key={category.id} value={category.id}>
                                    <Box>
                                      <Typography variant="body2">{category.name}</Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {category.description}
                                      </Typography>
                                    </Box>
                                  </MenuItem>
                                ))}
                              </Select>
                              {errors.category && (
                                <Typography variant="caption" color="error">
                                  {errors.category.message}
                                </Typography>
                              )}
                            </FormControl>
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Controller
                          name="priority"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth margin="normal" error={!!errors.priority}>
                              <InputLabel>Prioridad</InputLabel>
                              <Select
                                {...field}
                                label="Prioridad"
                              >
                                {priorities.map((priority) => (
                                  <MenuItem key={priority.id} value={priority.id}>
                                    <Box>
                                      <Typography variant="body2">{priority.name}</Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {priority.description}
                                      </Typography>
                                    </Box>
                                  </MenuItem>
                                ))}
                              </Select>
                              {errors.priority && (
                                <Typography variant="caption" color="error">
                                  {errors.priority.message}
                                </Typography>
                              )}
                            </FormControl>
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Step 2: Revisión */}
                {activeStep === 2 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Revisión del Ticket
                    </Typography>

                    <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Título
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            {watchedValues.title}
                          </Typography>
                        </Grid>

                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Descripción
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            {watchedValues.description}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Categoría
                          </Typography>
                          <Typography variant="body2">
                            {categories.find(c => c.id === watchedValues.category)?.name}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Prioridad
                          </Typography>
                          <Chip
                            size="small"
                            label={TICKET_PRIORITY[watchedValues.priority]?.label}
                            color={getPriorityColor(watchedValues.priority)}
                          />
                        </Grid>

                        {attachments.length > 0 && (
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Archivos Adjuntos
                            </Typography>
                            <Box>
                              {attachments.map((file, index) => (
                                <Chip
                                  key={index}
                                  label={file.name}
                                  size="small"
                                  sx={{ mr: 1 }}
                                />
                              ))}
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                  </Box>
                )}

                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                  >
                    Anterior
                  </Button>

                  <Box>
                    {activeStep === steps.length - 1 ? (
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || !isValid}
                        startIcon={loading ? null : <SendIcon />}
                      >
                        {loading ? 'Creando...' : 'Crear Ticket'}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                      >
                        Siguiente
                      </Button>
                    )}
                  </Box>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateTicketPage;