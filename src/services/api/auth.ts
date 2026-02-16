import { endpoints } from '../endpoints';
import { httpClient } from '../httpClient';
import type { AuthUser } from '../types';

export const authApi = {
  login: (userId: string) => httpClient.post<AuthUser>(endpoints.authLogin, { userId }),
  users: () => httpClient.get<AuthUser[]>(endpoints.users),
};
