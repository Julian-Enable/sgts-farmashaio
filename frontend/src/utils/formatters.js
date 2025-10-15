/**
 * Utilidades de formateo para el frontend
 */

/**
 * Formatea una fecha a formato español legible
 * @param {string|Date} dateString - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  try {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Fecha inválida';
  }
};

/**
 * Formatea una fecha a formato corto (solo fecha, sin hora)
 * @param {string|Date} dateString - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatDateShort = (dateString) => {
  if (!dateString) return '-';
  
  try {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Fecha inválida';
  }
};

/**
 * Formatea una fecha de forma relativa (hace 2 horas, hace 3 días, etc.)
 * @param {string|Date} dateString - Fecha a formatear
 * @returns {string} Fecha relativa formateada
 */
export const formatRelativeDate = (dateString) => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    
    return formatDate(dateString);
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return 'Fecha inválida';
  }
};

/**
 * Formatea un número con separadores de miles
 * @param {number} number - Número a formatear
 * @returns {string} Número formateado
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined) return '0';
  return new Intl.NumberFormat('es-ES').format(number);
};

/**
 * Formatea moneda en pesos colombianos
 * @param {number} amount - Cantidad a formatear
 * @returns {string} Cantidad formateada
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '$0';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Trunca un texto a un número máximo de caracteres
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Capitaliza la primera letra de un texto
 * @param {string} text - Texto a capitalizar
 * @returns {string} Texto capitalizado
 */
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Formatea un nombre completo desde firstName y lastName
 * @param {string} firstName - Nombre
 * @param {string} lastName - Apellido
 * @returns {string} Nombre completo formateado
 */
export const formatFullName = (firstName, lastName) => {
  if (!firstName && !lastName) return 'Sin nombre';
  if (!firstName) return lastName;
  if (!lastName) return firstName;
  return `${firstName} ${lastName}`;
};
