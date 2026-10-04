export type Role = 'DISPATCHER' | 'TECHNICIAN' | 'MANAGER' | 'CUSTOMER';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type WorkOrderStatus = 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  phone?: string;
  customerId?: number;
  customerName?: string;
}

export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  createdAt: string;
}

export interface Site {
  id: number;
  customerId: number;
  customerName: string;
  name: string;
  address: string;
  buildingCode?: string;
  contactPerson?: string;
  contactPhone?: string;
  createdAt: string;
}

export interface WorkOrderStatusHistory {
  id: number;
  fromStatus?: WorkOrderStatus;
  toStatus: WorkOrderStatus;
  changedById: number;
  changedByName: string;
  changedAt: string;
  notes?: string;
}

export interface WorkOrder {
  id: number;
  code: string;
  title: string;
  description?: string;
  priority: Priority;
  status: WorkOrderStatus;
  customerId: number;
  customerName: string;
  siteId: number;
  siteName: string;
  siteAddress: string;
  assignedTechId?: number;
  assignedTechName?: string;
  creatorId?: number;
  creatorName?: string;
  slaDueDate: string;
  slaBreached: boolean;
  totalPartsCost: number;
  totalLaborMinutes: number;
  createdAt: string;
  updatedAt: string;
  history?: WorkOrderStatusHistory[];
}

export interface Part {
  id: number;
  partNumber: string;
  name: string;
  description?: string;
  unitPrice: number;
  quantityOnHand: number;
  minimumStockLevel: number;
  lowStock: boolean;
  createdAt?: string;
}

export interface PartUsage {
  id: number;
  workOrderId: number;
  partId: number;
  partNumber: string;
  partName: string;
  quantityUsed: number;
  unitPrice: number;
  totalPrice: number;
  loggedByName: string;
  loggedAt: string;
  notes?: string;
}

export interface TimeLog {
  id: number;
  workOrderId: number;
  technicianId: number;
  technicianName: string;
  minutes: number;
  startTime?: string;
  endTime?: string;
  workDescription?: string;
  createdAt: string;
}

export interface TechnicianWorkload {
  id: number;
  name: string;
  email: string;
  activeAssignedOrders: number;
}

export interface DashboardMetrics {
  totalWorkOrders: number;
  activeWorkOrders: number;
  completedWorkOrders: number;
  slaBreachedOrders: number;
  totalPartsCostAllTime: number;
  totalLaborMinutesAllTime: number;
  statusBreakdown: Record<string, number>;
  priorityBreakdown: Record<string, number>;
  technicianWorkload: TechnicianWorkload[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: number;
  email: string;
  fullName: string;
  role: Role;
  customerId?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
