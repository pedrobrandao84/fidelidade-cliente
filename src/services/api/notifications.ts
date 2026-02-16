import { endpoints } from '../endpoints';
import { httpClient } from '../httpClient';
import type { AppNotification, NotificationPrefs } from '../types';

export const notificationsApi = {
  list: (params: { clientId?: string; audience?: string; tenantId?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return httpClient.get<AppNotification[]>(`${endpoints.notifications}?${query}`);
  },
  preferences: (clientId: string) => httpClient.get<NotificationPrefs[]>(`${endpoints.preferences}?clientId=${clientId}`),
  updatePreference: (payload: NotificationPrefs) => httpClient.put<NotificationPrefs>(endpoints.preferences, payload),
  sendReminder: (tenantId: string, includeWhatsapp: boolean) =>
    httpClient.post<{ sent: number; whatsappCostMessage: string | null }>(endpoints.businessReminder, { tenantId, includeWhatsapp }),
};
