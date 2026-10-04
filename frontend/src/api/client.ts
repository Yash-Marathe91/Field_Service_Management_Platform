import axios from 'axios';
import type {
  AuthResponse,
  Customer,
  DashboardMetrics,
  LoginRequest,
  PageResponse,
  Part,
  PartUsage,
  Site,
  TimeLog,
  User,
  WorkOrder,
  WorkOrderStatus
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('keystone_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const authApi = {
  login: (data: LoginRequest) => api.post<AuthResponse>('/auth/login', data),
  getMe: () => api.get<User>('/auth/me')
};

export const customerApi = {
  getCustomers: (params?: { search?: string; page?: number; size?: number }) =>
    api.get<PageResponse<Customer>>('/customers', { params }),
  getCustomerById: (id: number) => api.get<Customer>(`/customers/${id}`),
  createCustomer: (data: Partial<Customer>) => api.post<Customer>('/customers', data),
  updateCustomer: (id: number, data: Partial<Customer>) => api.put<Customer>(`/customers/${id}`, data),
  deleteCustomer: (id: number) => api.delete(`/customers/${id}`)
};

export const siteApi = {
  getSites: (params?: { search?: string; page?: number; size?: number }) =>
    api.get<PageResponse<Site>>('/sites', { params }),
  getSitesByCustomer: (customerId: number) =>
    api.get<Site[]>(`/sites/customer/${customerId}`),
  createSite: (data: Partial<Site>) => api.post<Site>('/sites', data),
  updateSite: (id: number, data: Partial<Site>) => api.put<Site>(`/sites/${id}`, data),
  deleteSite: (id: number) => api.delete(`/sites/${id}`)
};

export const partApi = {
  getParts: (params?: { search?: string; page?: number; size?: number }) =>
    api.get<PageResponse<Part>>('/parts', { params }),
  getPartById: (id: number) => api.get<Part>(`/parts/${id}`),
  createPart: (data: { partNumber: string; name: string; description?: string; unitPrice: number; quantityOnHand: number; minimumStockLevel?: number }) =>
    api.post<Part>('/parts', data),
  updatePart: (id: number, data: Partial<Part>) => api.put<Part>(`/parts/${id}`, data),
  deletePart: (id: number) => api.delete(`/parts/${id}`),
  logPartUsage: (workOrderId: number, data: { partId: number; quantityUsed: number; notes?: string }) =>
    api.post<PartUsage>(`/work-orders/${workOrderId}/parts`, data),
  getPartUsageForWorkOrder: (workOrderId: number) =>
    api.get<PartUsage[]>(`/work-orders/${workOrderId}/parts`)
};

export const userApi = {
  getTechnicians: () => api.get<User[]>('/users/technicians')
};

export const workOrderApi = {
  getWorkOrders: (params?: {
    status?: WorkOrderStatus;
    customerId?: number;
    techId?: number;
    search?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }) => api.get<PageResponse<WorkOrder>>('/work-orders', { params }),
  getWorkOrderById: (id: number) => api.get<WorkOrder>(`/work-orders/${id}`),
  createWorkOrder: (data: {
    title: string;
    description?: string;
    priority: string;
    customerId: number;
    siteId: number;
    assignedTechId?: number;
  }) => api.post<WorkOrder>('/work-orders', data),
  updateWorkOrder: (id: number, data: Partial<WorkOrder>) =>
    api.put<WorkOrder>(`/work-orders/${id}`, data),
  deleteWorkOrder: (id: number) => api.delete(`/work-orders/${id}`),
  updateStatus: (id: number, status: WorkOrderStatus, notes?: string) =>
    api.patch<WorkOrder>(`/work-orders/${id}/status`, { status, notes }),
  logTime: (workOrderId: number, data: { minutes: number; workDescription?: string }) =>
    api.post<TimeLog>(`/work-orders/${workOrderId}/time-logs`, data),
  getTimeLogs: (workOrderId: number) =>
    api.get<TimeLog[]>(`/work-orders/${workOrderId}/time-logs`)
};

export const dashboardApi = {
  getMetrics: () => api.get<DashboardMetrics>('/dashboard/metrics')
};

export default api;

