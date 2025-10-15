import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './api.js';
import { API_ENDPOINTS, API_BASE_URL } from '../utils/constants.js';

class TicketService {
  // Obtener lista de tickets con filtros
  async getTickets(filters = {}) {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    const queryString = params.toString();
    const url = queryString ? `${API_ENDPOINTS.TICKETS}?${queryString}` : API_ENDPOINTS.TICKETS;
    
    const response = await apiGet(url);
    // Backend retorna { success: true, tickets: [...] }
    return response.data.tickets || [];
  }

  // Obtener ticket por ID
  async getTicketById(id) {
    const response = await apiGet(`${API_ENDPOINTS.TICKETS}/${id}`);
    // Backend retorna { success: true, ticket: {...} }
    return response.data.ticket;
  }

  // Crear nuevo ticket
  async createTicket(ticketData) {
    const response = await apiPost(API_ENDPOINTS.TICKETS, ticketData);
    return response.data;
  }

  // Actualizar ticket
  async updateTicket(id, ticketData) {
    const response = await apiPut(`${API_ENDPOINTS.TICKETS}/${id}`, ticketData);
    return response.data;
  }

  // Eliminar ticket
  async deleteTicket(id) {
    const response = await apiDelete(`${API_ENDPOINTS.TICKETS}/${id}`);
    return response.data;
  }

  // Asignar ticket a técnico
  async assignTicket(id, technicianId) {
    const response = await apiPost(`${API_ENDPOINTS.TICKETS}/${id}/assign`, {
      assignedTo: technicianId
    });
    return response.data;
  }

  // Cambiar estado del ticket
  async updateTicketStatus(id, status, comment = null) {
    const response = await apiPatch(`${API_ENDPOINTS.TICKETS}/${id}/status`, {
      status,
      comment
    });
    return response.data;
  }

  // Agregar comentario al ticket
  async addComment(ticketId, comment) {
    const response = await apiPost(`${API_ENDPOINTS.TICKETS}/${ticketId}/comments`, {
      comment
    });
    return response.data;
  }

  // Obtener comentarios del ticket
  async getTicketComments(ticketId) {
    const response = await apiGet(`${API_ENDPOINTS.TICKETS}/${ticketId}/comments`);
    // Backend retorna { success: true, comments: [...] }
    return response.data.comments || [];
  }

  // Obtener historial del ticket
  async getTicketHistory(ticketId) {
    const response = await apiGet(`${API_ENDPOINTS.TICKETS}/${ticketId}/history`);
    // Backend retorna { success: true, history: [...] }
    return response.data.history || [];
  }

  // Obtener estadísticas de tickets
  async getTicketStats(filters = {}) {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    const queryString = params.toString();
    const url = queryString ? `${API_ENDPOINTS.TICKET_STATS}?${queryString}` : API_ENDPOINTS.TICKET_STATS;
    
    const response = await apiGet(url);
    // Backend retorna { success: true, stats: {...} }
    return response.data.stats || {};
  }

  // Obtener opciones para filtros
  async getTicketFilters() {
    const response = await apiGet(API_ENDPOINTS.TICKET_FILTERS);
    return response.data;
  }

  // TODO: Exportar tickets (not implemented in backend yet)
  // async exportTickets(format = 'csv', filters = {}) {
  //   const params = new URLSearchParams();
  //   params.append('format', format);
  //   
  //   Object.entries(filters).forEach(([key, value]) => {
  //     if (value) {
  //       params.append(key, value);
  //     }
  //   });
  //
  //   const response = await apiGet(`${API_ENDPOINTS.TICKETS}/export?${params.toString()}`, {
  //     responseType: 'blob'
  //   });
  //   return response.data;
  // }

  // TODO: Búsqueda avanzada de tickets (not implemented in backend yet)
  // async searchTickets(searchQuery) {
  //   const response = await apiPost(`${API_ENDPOINTS.TICKETS}/search`, {
  //     query: searchQuery
  //   });
  //   return response.data;
  // }

  // Obtener categorías (public endpoint - no requiere auth)
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`);
      const json = await response.json();
      return json.data || [];
    } catch (error) {
      console.error('Error loading categories:', error);
      return [];
    }
  }

  // Obtener prioridades (public endpoint - no requiere auth)
  async getPriorities() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/priorities`);
      const json = await response.json();
      return json.data || [];
    } catch (error) {
      console.error('Error loading priorities:', error);
      return [];
    }
  }

  // Obtener estados (public endpoint - no requiere auth)
  async getStatuses() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ticket-statuses`);
      const json = await response.json();
      return json.data || [];
    } catch (error) {
      console.error('Error loading statuses:', error);
      return [];
    }
  }
}

export const ticketService = new TicketService();