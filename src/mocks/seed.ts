import type { AppDatabase } from '../services/types';

const now = new Date();
const days = (n: number) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000).toISOString();

export const seedDb = (): AppDatabase => ({
  users: [
    { id: 'c1', role: 'CLIENT', name: 'Ana Silva', email: 'ana@demo.com' },
    { id: 'c2', role: 'CLIENT', name: 'Bruno Lima', email: 'bruno@demo.com' },
    { id: 'c3', role: 'CLIENT', name: 'Carla Souza', email: 'carla@demo.com' },
    { id: 'c4', role: 'CLIENT', name: 'Diego Costa', email: 'diego@demo.com' },
    { id: 'c5', role: 'CLIENT', name: 'Elisa Nunes', email: 'elisa@demo.com' },
    { id: 'c6', role: 'CLIENT', name: 'Fabio Alves', email: 'fabio@demo.com' },
    { id: 'c7', role: 'CLIENT', name: 'Gabi Melo', email: 'gabi@demo.com' },
    { id: 'c8', role: 'CLIENT', name: 'Hugo Reis', email: 'hugo@demo.com' },
    { id: 'b1', role: 'BUSINESS', name: 'Padaria Trigo', email: 'padaria@demo.com', tenantId: 't1' },
    { id: 'b2', role: 'BUSINESS', name: 'Academia Pulse', email: 'pulse@demo.com', tenantId: 't2' },
    { id: 'b3', role: 'BUSINESS', name: 'Pet Love', email: 'pet@demo.com', tenantId: 't3' },
    { id: 'a1', role: 'ADMIN', name: 'Admin Geral', email: 'admin@demo.com' },
  ],
  tenants: [
    { id: 't1', name: 'Padaria Trigo', category: 'Alimentação', status: 'PENDING_PAYMENT', location: { lat: -23.56, lng: -46.64 }, createdAt: days(-15) },
    { id: 't2', name: 'Academia Pulse', category: 'Fitness', status: 'ACTIVE', location: { lat: -23.53, lng: -46.62 }, createdAt: days(-40) },
    { id: 't3', name: 'Pet Love', category: 'Pet Shop', status: 'SUSPENDED', location: { lat: -23.57, lng: -46.66 }, createdAt: days(-20) },
  ],
  promotions: [
    { id: 'p1', tenantId: 't2', name: '10 treinos', description: 'Complete 10 treinos', goal: { type: 'PURCHASES', target: 10 }, expiresAt: days(20), status: 'ACTIVE', bonus: { type: 'DISCOUNT', value: '15%' }, createdAt: days(-10) },
    { id: 'p2', tenantId: 't2', name: 'Indique amigo', description: '5 indicações', goal: { type: 'POINTS', target: 5 }, expiresAt: days(-2), status: 'EXPIRED', bonus: { type: 'CASHBACK', value: 'R$25' }, createdAt: days(-50) },
    { id: 'p3', tenantId: 't1', name: 'Café grátis', description: 'Compre 8 pães', goal: { type: 'PURCHASES', target: 8 }, expiresAt: days(30), status: 'ACTIVE', bonus: { type: 'PRODUCT', value: '1 café' }, createdAt: days(-5) },
    { id: 'p4', tenantId: 't1', name: 'Combo manhã', description: '12 compras', goal: { type: 'POINTS', target: 12 }, expiresAt: days(-1), status: 'EXPIRED', bonus: { type: 'DISCOUNT', value: '20%' }, createdAt: days(-60) },
    { id: 'p5', tenantId: 't3', name: 'Banho pet', description: '6 banhos', goal: { type: 'PURCHASES', target: 6 }, expiresAt: days(8), status: 'ACTIVE', bonus: { type: 'PRODUCT', value: 'Brinde' }, createdAt: days(-3) },
    { id: 'p6', tenantId: 't2', name: 'Plano premium', description: '15 pontos', goal: { type: 'POINTS', target: 15 }, expiresAt: days(12), status: 'ACTIVE', bonus: { type: 'CASHBACK', value: 'R$40' }, createdAt: days(-2) },
  ],
  participations: [
    { id: 'pa1', tenantId: 't2', promotionId: 'p1', clientId: 'c1', status: 'ACTIVE', progress: 9, lastPointedAt: days(-1) },
    { id: 'pa2', tenantId: 't2', promotionId: 'p2', clientId: 'c1', status: 'EXPIRED_BLOCKED', progress: 3, expiredAt: days(-2) },
    { id: 'pa3', tenantId: 't1', promotionId: 'p3', clientId: 'c2', status: 'ACTIVE', progress: 6, lastPointedAt: days(-2) },
    { id: 'pa4', tenantId: 't1', promotionId: 'p4', clientId: 'c2', status: 'EXPIRED_BLOCKED', progress: 11, expiredAt: days(-1) },
    { id: 'pa5', tenantId: 't2', promotionId: 'p6', clientId: 'c3', status: 'ACTIVE', progress: 14, lastPointedAt: days(-1) },
  ],
  joinRequests: [
    { id: 'j1', tenantId: 't2', promotionId: 'p1', clientId: 'c4', status: 'PENDING', createdAt: days(-1) },
    { id: 'j2', tenantId: 't1', promotionId: 'p3', clientId: 'c5', status: 'PENDING', createdAt: days(-2) },
  ],
  pointRequests: [
    { id: 'pr1', tenantId: 't2', promotionId: 'p1', clientId: 'c1', status: 'PENDING', origin: 'COUNTER', note: 'treino confirmado', createdAt: days(-1) },
    { id: 'pr2', tenantId: 't1', promotionId: 'p3', clientId: 'c2', status: 'PENDING', origin: 'RECEIPT', receiptUrl: 'blob://receipts/r1', createdAt: days(-1) },
  ],
  notificationPrefs: [
    { tenantId: 't2', clientId: 'c1', pushEnabled: true, emailEnabled: true, whatsappEnabled: false, updatedAt: days(-3) },
    { tenantId: 't2', clientId: 'c3', pushEnabled: false, emailEnabled: true, whatsappEnabled: true, updatedAt: days(-4) },
    { tenantId: 't1', clientId: 'c2', pushEnabled: true, emailEnabled: false, whatsappEnabled: false, updatedAt: days(-5) },
  ],
  notifications: [
    { id: 'n1', tenantId: 't2', clientId: 'c1', audience: 'CLIENT', channel: ['IN_APP'], title: 'Lembrete', message: 'Você está quase completando!', createdAt: days(-1) },
    { id: 'n2', tenantId: 't2', audience: 'BUSINESS', channel: ['IN_APP'], title: 'Nova solicitação', message: 'Há solicitação pendente.', createdAt: days(-1) },
  ],
  payments: [
    { tenantId: 't1', plan: 'STARTER', paymentMethod: 'PIX' },
    { tenantId: 't2', plan: 'PRO', paymentMethod: 'CARD' },
    { tenantId: 't3', plan: 'STARTER', paymentMethod: 'BOLETO' },
  ],
  whatsappBillingEvents: [],
});
