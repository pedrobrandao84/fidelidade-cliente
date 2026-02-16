export type UserRole = 'CLIENT' | 'BUSINESS' | 'ADMIN';

export type TenantStatus = 'PENDING_PAYMENT' | 'ACTIVE' | 'SUSPENDED';

export type PromotionStatus = 'ACTIVE' | 'EXPIRED' | 'ARCHIVED';

export type ParticipationStatus = 'ACTIVE' | 'COMPLETED' | 'EXPIRED_BLOCKED';

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type PointRequestOrigin = 'COUNTER' | 'RECEIPT';

export type PaymentMethod = 'CARD' | 'PIX' | 'BOLETO' | 'UNKNOWN';

export interface AuthUser {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  tenantId?: string;
}

export interface Tenant {
  id: string;
  name: string;
  category: string;
  status: TenantStatus;
  location: { lat: number; lng: number };
  createdAt: string;
}

export interface NotificationPrefs {
  tenantId: string;
  clientId: string;
  pushEnabled: boolean;
  emailEnabled: boolean;
  whatsappEnabled: boolean;
  updatedAt: string;
}

export interface Promotion {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  goal: { type: 'PURCHASES' | 'POINTS'; target: number };
  expiresAt: string;
  status: PromotionStatus;
  bonus: { type: 'PRODUCT' | 'DISCOUNT' | 'CASHBACK'; value: string };
  originPromotionId?: string;
  createdAt: string;
}

export interface Participation {
  id: string;
  tenantId: string;
  promotionId: string;
  clientId: string;
  status: ParticipationStatus;
  progress: number;
  lastPointedAt?: string;
  expiredAt?: string;
}

export interface JoinRequest {
  id: string;
  tenantId: string;
  promotionId: string;
  clientId: string;
  status: RequestStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface PointRequest {
  id: string;
  tenantId: string;
  promotionId: string;
  clientId: string;
  status: RequestStatus;
  origin: PointRequestOrigin;
  receiptUrl?: string;
  note?: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface AdminTenantMetrics {
  tenantId: string;
  promotionsCount: number;
  clientsCount: number;
  billingStatus: TenantStatus;
  paymentMethod: PaymentMethod;
}

export interface AppNotification {
  id: string;
  tenantId?: string;
  clientId?: string;
  audience: 'CLIENT' | 'BUSINESS' | 'ADMIN';
  channel: Array<'PUSH' | 'EMAIL' | 'WHATSAPP' | 'IN_APP'>;
  title: string;
  message: string;
  createdAt: string;
}

export interface AppDatabase {
  users: AuthUser[];
  tenants: Tenant[];
  promotions: Promotion[];
  participations: Participation[];
  joinRequests: JoinRequest[];
  pointRequests: PointRequest[];
  notificationPrefs: NotificationPrefs[];
  notifications: AppNotification[];
  payments: Array<{ tenantId: string; plan: 'STARTER' | 'PRO'; paymentMethod: PaymentMethod }>;
  whatsappBillingEvents: Array<{ id: string; tenantId: string; cost: number; createdAt: string }>;
}
