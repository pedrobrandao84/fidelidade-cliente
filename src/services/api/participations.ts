import { endpoints } from '../endpoints';
import { httpClient } from '../httpClient';
import type { Participation, Promotion } from '../types';

export interface ParticipationView extends Participation {
  promotion?: Promotion;
}

export const participationsApi = {
  list: (params: { clientId?: string; tenantId?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return httpClient.get<ParticipationView[]>(`${endpoints.participations}?${query}`);
  },
};
