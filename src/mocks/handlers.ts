import { delay, http, HttpResponse } from 'msw';
import type {
  AdminTenantMetrics,
  AppNotification,
  AuthUser,
  JoinRequest,
  NotificationPrefs,
  Participation,
  PointRequest,
  Promotion,
  RequestStatus,
} from '../services/types';
import { createId } from '../utils/id';
import { isExpired } from '../utils/date';
import { getDb, setDb } from './db';

const mutationGuard = async () => {
  await delay(200 + Math.random() * 600);
  if (Math.random() < 0.1) {
    return HttpResponse.json({ message: 'Falha simulada no servidor' }, { status: 500 });
  }
  return null;
};
const readDelay = () => delay(200 + Math.random() * 600);

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { userId: string };
    await readDelay();
    const user = getDb().users.find((u) => u.id === body.userId);
    if (!user) return HttpResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
    return HttpResponse.json(user);
  }),

  http.get('/api/users', async () => {
    await readDelay();
    return HttpResponse.json(getDb().users);
  }),

  http.get('/api/tenants', async () => {
    await readDelay();
    return HttpResponse.json(getDb().tenants);
  }),

  http.put('/api/tenants/:id/status', async ({ params, request }) => {
    const guard = await mutationGuard(); if (guard) return guard;
    const body = (await request.json()) as { status: 'ACTIVE' | 'PENDING_PAYMENT' | 'SUSPENDED' };
    const db = getDb();
    const tenants = db.tenants.map((t) => (t.id === params.id ? { ...t, status: body.status } : t));
    setDb({ ...db, tenants });
    return HttpResponse.json(tenants.find((t) => t.id === params.id));
  }),

  http.get('/api/promotions', async ({ request }) => {
    await readDelay();
    const url = new URL(request.url);
    const tenantId = url.searchParams.get('tenantId');
    const promotions = getDb().promotions.filter((p) => !tenantId || p.tenantId === tenantId);
    return HttpResponse.json(promotions);
  }),

  http.post('/api/promotions', async ({ request }) => {
    const guard = await mutationGuard(); if (guard) return guard;
    const payload = (await request.json()) as Omit<Promotion, 'id' | 'createdAt' | 'status'>;
    const db = getDb();
    const promotion: Promotion = { ...payload, id: createId('p'), createdAt: new Date().toISOString(), status: 'ACTIVE' };
    const promotions = [promotion, ...db.promotions];
    const prefs = db.notificationPrefs.filter((p) => p.tenantId === promotion.tenantId && (p.pushEnabled || p.emailEnabled));
    const notifications: AppNotification[] = prefs.map((pref) => ({
      id: createId('n'),
      tenantId: promotion.tenantId,
      clientId: pref.clientId,
      audience: 'CLIENT',
      channel: [pref.pushEnabled ? 'PUSH' : 'IN_APP', pref.emailEnabled ? 'EMAIL' : 'IN_APP'],
      title: 'Nova promoção disponível',
      message: `A empresa lançou ${promotion.name}`,
      createdAt: new Date().toISOString(),
    }));
    setDb({ ...db, promotions, notifications: [...notifications, ...db.notifications] });
    return HttpResponse.json(promotion, { status: 201 });
  }),

  http.put('/api/promotions/:id', async ({ params, request }) => {
    const guard = await mutationGuard(); if (guard) return guard;
    const payload = (await request.json()) as Partial<Promotion>;
    const db = getDb();
    const promotions = db.promotions.map((p) => (p.id === params.id ? { ...p, ...payload } : p));
    setDb({ ...db, promotions });
    return HttpResponse.json(promotions.find((p) => p.id === params.id));
  }),

  http.post('/api/promotions/:id/extend', async ({ params, request }) => {
    const guard = await mutationGuard(); if (guard) return guard;
    const body = (await request.json()) as { expiresAt: string };
    const db = getDb();
    const promotions = db.promotions.map((p) => (p.id === params.id ? { ...p, expiresAt: body.expiresAt, status: 'ACTIVE' } : p));
    const participations = db.participations.map((p) => (p.promotionId === params.id && p.status === 'EXPIRED_BLOCKED' ? { ...p, status: 'ACTIVE' } : p));
    setDb({ ...db, promotions, participations });
    return HttpResponse.json({ ok: true });
  }),

  http.post('/api/promotions/:id/duplicate', async ({ params }) => {
    const guard = await mutationGuard(); if (guard) return guard;
    const db = getDb();
    const source = db.promotions.find((p) => p.id === params.id);
    if (!source) return HttpResponse.json({ message: 'Promoção não encontrada' }, { status: 404 });
    const copy: Promotion = { ...source, id: createId('p'), createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(), status: 'ACTIVE', originPromotionId: source.id };
    const related = db.participations.filter((p) => p.promotionId === source.id);
    const newParts: Participation[] = related.map((p) => ({ ...p, id: createId('pa'), promotionId: copy.id, progress: 0, status: 'ACTIVE' }));
    setDb({ ...db, promotions: [copy, ...db.promotions], participations: [...newParts, ...db.participations] });
    return HttpResponse.json(copy, { status: 201 });
  }),

  http.get('/api/participations', async ({ request }) => {
    await readDelay();
    const url = new URL(request.url);
    const clientId = url.searchParams.get('clientId');
    const tenantId = url.searchParams.get('tenantId');
    const db = getDb();

    let changed = false;
    const nextParticipations = db.participations.map((part) => {
      const promotion = db.promotions.find((promo) => promo.id === part.promotionId);
      if (promotion && isExpired(promotion.expiresAt) && part.status === 'ACTIVE') {
        changed = true;
        return { ...part, status: 'EXPIRED_BLOCKED', expiredAt: new Date().toISOString() };
      }
      return part;
    });

    if (changed) {
      setDb({ ...db, participations: nextParticipations });
    }

    const joined = nextParticipations
      .filter((part) => (!clientId || part.clientId === clientId) && (!tenantId || part.tenantId === tenantId))
      .map((part) => ({ ...part, promotion: db.promotions.find((promo) => promo.id === part.promotionId) }));

    return HttpResponse.json(joined);
  }),

  http.get('/api/join-requests', async ({ request }) => {
    await readDelay();
    const url = new URL(request.url);
    const tenantId = url.searchParams.get('tenantId');
    const clientId = url.searchParams.get('clientId');
    const list = getDb().joinRequests.filter((j) => (!tenantId || j.tenantId === tenantId) && (!clientId || j.clientId === clientId));
    return HttpResponse.json(list);
  }),

  http.post('/api/join-requests', async ({ request }) => {
    const guard = await mutationGuard(); if (guard) return guard;
    const body = (await request.json()) as Omit<JoinRequest, 'id' | 'createdAt' | 'status'>;
    const db = getDb();
    const newRequest: JoinRequest = { ...body, id: createId('j'), createdAt: new Date().toISOString(), status: 'PENDING' };
    setDb({ ...db, joinRequests: [newRequest, ...db.joinRequests] });
    return HttpResponse.json(newRequest, { status: 201 });
  }),

  http.put('/api/join-requests/:id', async ({ params, request }) => {
    const guard = await mutationGuard(); if (guard) return guard;
    const body = (await request.json()) as { status: RequestStatus; reviewedBy: string };
    const db = getDb();
    const joinRequests = db.joinRequests.map((j) => (j.id === params.id ? { ...j, status: body.status, reviewedBy: body.reviewedBy, reviewedAt: new Date().toISOString() } : j));
    const approved = joinRequests.find((j) => j.id === params.id && j.status === 'APPROVED');
    const participations = approved
      ? [{ id: createId('pa'), tenantId: approved.tenantId, promotionId: approved.promotionId, clientId: approved.clientId, status: 'ACTIVE', progress: 0 } as Participation, ...db.participations]
      : db.participations;
    setDb({ ...db, joinRequests, participations });
    return HttpResponse.json(joinRequests.find((j) => j.id === params.id));
  }),

  http.get('/api/point-requests', async ({ request }) => {
    await readDelay();
    const url = new URL(request.url);
    const tenantId = url.searchParams.get('tenantId');
    const clientId = url.searchParams.get('clientId');
    const list = getDb().pointRequests.filter((j) => (!tenantId || j.tenantId === tenantId) && (!clientId || j.clientId === clientId));
    return HttpResponse.json(list);
  }),

  http.post('/api/point-requests', async ({ request }) => {
    const guard = await mutationGuard(); if (guard) return guard;
    const body = (await request.json()) as Omit<PointRequest, 'id' | 'createdAt' | 'status'>;
    const db = getDb();
    const newRequest: PointRequest = {
      ...body,
      id: createId('pr'),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      receiptUrl: body.origin === 'RECEIPT' ? body.receiptUrl ?? `blob://receipts/${createId('r')}` : undefined,
    };
    setDb({ ...db, pointRequests: [newRequest, ...db.pointRequests] });
    return HttpResponse.json(newRequest, { status: 201 });
  }),

  http.put('/api/point-requests/:id', async ({ params, request }) => {
    const guard = await mutationGuard(); if (guard) return guard;
    const body = (await request.json()) as { status: RequestStatus; reviewedBy: string };
    const db = getDb();
    const pointRequests = db.pointRequests.map((j) => (j.id === params.id ? { ...j, status: body.status, reviewedBy: body.reviewedBy, reviewedAt: new Date().toISOString() } : j));
    const approved = pointRequests.find((j) => j.id === params.id && j.status === 'APPROVED');
    const participations = db.participations.map((p) =>
      approved && p.clientId === approved.clientId && p.promotionId === approved.promotionId ? { ...p, progress: p.progress + 1, lastPointedAt: new Date().toISOString() } : p,
    );
    setDb({ ...db, pointRequests, participations });
    return HttpResponse.json(pointRequests.find((j) => j.id === params.id));
  }),

  http.get('/api/preferences', async ({ request }) => {
    await readDelay();
    const url = new URL(request.url);
    const clientId = url.searchParams.get('clientId');
    return HttpResponse.json(getDb().notificationPrefs.filter((p) => !clientId || p.clientId === clientId));
  }),

  http.put('/api/preferences', async ({ request }) => {
    const guard = await mutationGuard(); if (guard) return guard;
    const body = (await request.json()) as NotificationPrefs;
    const db = getDb();
    const rest = db.notificationPrefs.filter((p) => !(p.clientId === body.clientId && p.tenantId === body.tenantId));
    const next = { ...body, updatedAt: new Date().toISOString() };
    setDb({ ...db, notificationPrefs: [next, ...rest] });
    return HttpResponse.json(next);
  }),

  http.get('/api/notifications', async ({ request }) => {
    await readDelay();
    const url = new URL(request.url);
    const clientId = url.searchParams.get('clientId');
    const audience = url.searchParams.get('audience') as AuthUser['role'] | null;
    const tenantId = url.searchParams.get('tenantId');
    const rows = getDb().notifications.filter((n) => (!clientId || n.clientId === clientId) && (!audience || n.audience === audience) && (!tenantId || n.tenantId === tenantId));
    return HttpResponse.json(rows);
  }),

  http.post('/api/business/send-reminder', async ({ request }) => {
    const guard = await mutationGuard(); if (guard) return guard;
    const body = (await request.json()) as { tenantId: string; includeWhatsapp: boolean };
    const db = getDb();
    const almostDone = db.participations.filter((p) => p.tenantId === body.tenantId).filter((p) => {
      const promo = db.promotions.find((x) => x.id === p.promotionId);
      return promo && promo.goal.target - p.progress <= 2 && p.status === 'ACTIVE';
    });
    const notifications: AppNotification[] = almostDone.map((part) => {
      const pref = db.notificationPrefs.find((p) => p.clientId === part.clientId && p.tenantId === part.tenantId);
      const channels: AppNotification['channel'] = ['IN_APP'];
      if (pref?.pushEnabled) channels.push('PUSH');
      if (pref?.emailEnabled) channels.push('EMAIL');
      if (body.includeWhatsapp && pref?.whatsappEnabled) channels.push('WHATSAPP');
      return { id: createId('n'), audience: 'CLIENT', tenantId: part.tenantId, clientId: part.clientId, channel: channels, title: 'Você está quase lá!', message: 'Falta pouco para concluir sua promoção.', createdAt: new Date().toISOString() };
    });
    const billingEvents = body.includeWhatsapp ? [{ id: createId('w'), tenantId: body.tenantId, cost: notifications.filter((n) => n.channel.includes('WHATSAPP')).length * 0.15, createdAt: new Date().toISOString() }, ...db.whatsappBillingEvents] : db.whatsappBillingEvents;
    setDb({ ...db, notifications: [...notifications, ...db.notifications], whatsappBillingEvents: billingEvents });
    return HttpResponse.json({ sent: notifications.length, whatsappCostMessage: body.includeWhatsapp ? 'WhatsApp habilitado com custo extra' : null });
  }),

  http.get('/api/admin/metrics', async () => {
    await readDelay();
    const db = getDb();
    const data: AdminTenantMetrics[] = db.tenants.map((t) => ({
      tenantId: t.id,
      promotionsCount: db.promotions.filter((p) => p.tenantId === t.id).length,
      clientsCount: new Set(db.participations.filter((p) => p.tenantId === t.id).map((p) => p.clientId)).size,
      billingStatus: t.status,
      paymentMethod: db.payments.find((p) => p.tenantId === t.id)?.paymentMethod ?? 'UNKNOWN',
    }));
    return HttpResponse.json(data);
  }),
];
